import React from 'react';
import { Metadata  } from 'next'

import db from '@/app/[lang]/utils/db'
import ClientSideRoute from '@/app/[lang]/components/ClientSideRoute'
import { Story, StoryContent } from '@/app/../../../typings'
import { Locale } from '@/app/../../i18n.config'


export const revalidate = 30

// Export dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Blog',
        description: 'This is a blog page.',
    };
}

export default async function BlogPage({
    params: { lang },
}: {
    params: { lang: Locale }
}): Promise<React.ReactElement> {
    const stories: StoryContent[] = await db.getStories(lang);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
                <ClientSideRoute key={story.slug} route={`/blog/${story.slug}`}>
                    <div className="block p-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                        <p className="text-gray-600 mb-4">{story.date}</p>
                        <p className="text-gray-600">{story.description}</p>
                    </div>
                </ClientSideRoute>
            ))}
        </div>
    );
}


