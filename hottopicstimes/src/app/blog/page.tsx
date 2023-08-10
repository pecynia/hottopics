import React from 'react';
import { Metadata, ResolvingMetadata  } from 'next'


import db from '../utils/db'; // Adjust the path to your db module

import ClientSideRoute from '../components/ClientSideRoute';

// Is in typings.d.ts
import { Story } from '../../../typings';

export const revalidate = 30

// Export dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Blog',
        description: 'This is a blog page.',
    };
}

const BlogPage: React.FC = async () => {
    const stories: Story[] = await db.getStories()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
                <ClientSideRoute key={story.slug} route={`/blog/${story.slug}`}>
                    <div className="block p-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                        <p className="text-gray-600">{story.content}</p>
                    </div>
                </ClientSideRoute>
            ))}
        </div>
    );
};

export default BlogPage;
