import Head from 'next/head';
import db from '../../../utils/db'; 
import ViewCounter from '../../../utils/ViewCounter';
import { Story, StoryPageProps } from '../../../types/story';


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

async function Post({ params: { slug } }: Props) {

  // Get the story from the database
  const story: Story = await db.getStoryBySlug(slug);

  // If the story is not found, return a 404 page
  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <div>
      <Head>
        <title>{story.title}</title>
        <meta name="description" content={story.content.substring(0, 160)} />
      </Head>

      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <h1>{story.title}</h1>
      <p>{story.content}</p>
    </div>
  )
}

export default Post;