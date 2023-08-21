import { Metadata, ResolvingMetadata  } from 'next'
import { ArticleJsonLd } from 'next-seo'
import { notFound } from 'next/navigation'

import db from '../../utils/db'; 
import { markdownToHtml } from '../../utils/generation/markdown-to-html'
import ViewCounter from './ViewCounter';
import { Story } from '../../../../typings';

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

  if (!story) return notFound()

  const content = await markdownToHtml(story.content || '')

  function addBlogJsonLd() {
    return {
      __html: `{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.hottopicstimes.com/blog/${story.slug}"
        },
        "headline": "${story.title}",
        "description": "${story.description}",
        "image": [],
        "author": {
          "@type": "Person",
          "url": "https://www.hottopicstimes.com",
          "name": "Hot Topics Times"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hot Topics Times",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.hottopicstimes.com/logo.png"
          }
        },
        "datePublished": "${story.date}",
        "dateModified": "${story.date}"
      }
    `,};
  }

  return (
    <>
      {/* Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addBlogJsonLd()}
      />
      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <article>
        <h1>{story.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  )
}

export default Post 