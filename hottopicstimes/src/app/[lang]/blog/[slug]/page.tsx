// "use client"

import { Metadata, ResolvingMetadata  } from 'next'
import { notFound } from 'next/navigation'

import { Locale } from '@/app/../../i18n.config'
import db from '@/app/[lang]/utils/db'
import { addBlogJsonLd } from '@/app/[lang]/utils/schemas/blog-schema'
import { markdownToHtml } from '@/app/[lang]/utils/generation/markdown-to-html'
import ViewCounter from '@/app/[lang]/components/ViewCounter'
import { StoryLangRequest, StoryContent } from '@/app/../../typings'
import FAQSection from '@/app/[lang]/components/FaqSection'

type Props = {
  params: {
    slug: string,
    lang: Locale
  }
}

export const revalidate = 30

export async function generateStaticParams({ params }: Props): Promise<StoryLangRequest[]> {
  const storyData = await db.getAllStorySlugs(params.lang)
  return storyData.map((story) => ({
    _id: story._id,
    slug: story.slug,
    lang: params.lang,
  }))
}

// Export dynamic metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Parent metadata (can be used to extend the parent metadata, rather than replace)
): Promise<Metadata> {
  const slug = params.slug
  const story = await db.getStoryBySlug(slug, params.lang)

  if (!story) {
    return {
      title: 'Story not found',
      description: 'The requested story could not be found.'
    }
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
      locale: params.lang,
      ttl: 30,
    },
  }
}


async function Post({ params: { slug, lang } }: Props) {
  const story: StoryContent = await db.getStoryBySlug(slug, lang)

  if (!story) return notFound()

  const { content, faqs } = await markdownToHtml(story.content, lang || '')

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
  )
}

export default Post 