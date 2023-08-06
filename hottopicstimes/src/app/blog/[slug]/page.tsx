import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';

import db from '../../../utils/db'; 
import ViewCounter from '../../../utils/ViewCounter';
import { StoryPageProps } from '../../../types/story';

export default function StoryPage({ story }: StoryPageProps) {
  
  console.log("story: ", story) // story:  undefined

  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <div>
      <Head>
        <title>{story.title}</title>
        <meta name="description" content={story.content.substring(0, 160)} />
        {/* Add other metadata tags as needed */}
      </Head>

      {/* Increment the views counter */}
      <ViewCounter slug={story.slug} />

      {/* Render the story */}
      <h1>{story.title}</h1>
      <p>{story.content}</p>
      <a href={`/blog/${story.slug}/edit`}>Edit this story</a>
    </div>
  );
}

// Static data fetching. Is called at build time.
export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const story = await db.getStoryBySlug(slug);
    return {
      props: {
        story
      }
    };
  } catch (error) {
    console.error("Error fetching story:", error);
    return {
      notFound: true
    };
  }
};

// Static data fetching. Is called at build time.
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await db.getAllStorySlugs();
  return {
    paths,
    fallback: true
  };
};





