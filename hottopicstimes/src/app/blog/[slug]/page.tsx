// "use client"

import { Metadata, ResolvingMetadata  } from 'next'
import { notFound } from 'next/navigation'

import db from '@/app/utils/db'; 
import { addBlogJsonLd } from '@/app/utils/schemas/blog-schema';
import { markdownToHtml } from '@/app/utils/generation/markdown-to-html'
import ViewCounter from '@/app/components/ViewCounter';
import { Story } from '@/app/../../typings';
import FAQSection from '@/app/components/FaqSection';

type Props = {
  params: {
    slug: string,
  }
}

export const revalidate = 30

export async function generateStaticParams() {
  const slugs: string[] = await db.getAllStorySlugs()
  return slugs.map((slug: string) => ({
    slug,
  }))
}

// Export dynamic metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Parent metadata (can be used to extend the parent metadata, rather than replace)
): Promise<Metadata> {
  const slug = params.slug;
  const story = await db.getStoryBySlug(slug);

  if (!story) {
    return {
      title: 'Story not found',
      description: 'The requested story could not be found.'
    };
  }

  return {
    title: story.title,
    description: story.description,

    // Is this necessary?
    openGraph: {
      type: 'article',
      title: story.title,
      description: story.description,
      url: `https://www.hottopicstimes.com/blog/${story.slug}`,
      publishedTime: story.date,
      modifiedTime: story.date,
      authors: ['Hot Topics Times'],
      section: 'Blog',
      tags: story.tags,
      images: [],
      siteName: 'Hot Topics Times',
      locale: 'en_US',
      // alternateLocale: 'en_GB',
      ttl: 30,
    },
  }
}


async function Post({ params: { slug } }: Props) {
  const story: Story = await db.getStoryBySlug(slug);

  if (!story) return notFound();

  const { content, faqs } = await markdownToHtml(story.content || '');

  return (
    <>
      {/* Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addBlogJsonLd(story)}
      />

      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <article className="p-10">
        <h1 className="text-2xl mb-5">
          {story.title}
        </h1>
        
        <div className="flex items-center justify-between text-gray-500 mb-5">
          <p>{story.description}</p>
          <p>{story.date}</p>
        </div>
        
        <hr className="mb-5" />
        <div dangerouslySetInnerHTML={{ __html: content }} />

        <hr className="mb-5" />
        <FAQSection faqs={faqs} />
      </article>
    </>
  );
}

export default Post 