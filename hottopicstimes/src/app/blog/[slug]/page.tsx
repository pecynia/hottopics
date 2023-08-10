
import { Metadata, ResolvingMetadata  } from 'next'

import db from '../../utils/db'; 
import ViewCounter from '../../utils/ViewCounter';
import { Story } from '../../types/story';


type Props = {
  params: {
    slug: string,
  }
}

export const revalidate = 30

export async function generateStaticParams() {
  // Fetch all the slugs 
  const slugs = await db.getAllStorySlugs();

  // Return mapping of all possible slugs
  const slugRoutes =  slugs.map((slug: { slug: string }) => {
    return {
      params: {
        slug: slug.slug
      }
    }
  });

  return slugRoutes;
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

  // Get the story from the database
  const story: Story = await db.getStoryBySlug(slug);

  // If the story is not found, return a 404 page
  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <div>
      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <h1>{story.title}</h1>
      <p>{story.content}</p>
    </div>
  )
}

export default Post;