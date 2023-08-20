import { Metadata, ResolvingMetadata  } from 'next'
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
    description: story.content.substring(0, 160),
  };
}


async function Post({ params: { slug } }: Props) {
  const story: Story = await db.getStoryBySlug(slug);

  if (!story) return notFound()

  const content = await markdownToHtml(story.content || '')

  return (
    <div>
      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <h1>{story.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export default Post;