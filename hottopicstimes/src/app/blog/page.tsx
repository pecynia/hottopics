import React from 'react';
import Link from 'next/link';
import db from '../../utils/db'; // Adjust the path to your db module

import BlogLayout from './layout'; // Import the BlogLayout
import { Story } from '../../types/story';

const BlogPage: React.FC = async () => {
    // Fetch stories from the database (this is a placeholder; you'd likely fetch from your database)
    const stories: Story[] = await db.getStories(); // Adjust this to your actual db function

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
                <Link href={`/blog/${story.slug}`} key={story._id}>
                    <div className="block p-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                        <p className="text-gray-600">{story.content}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default BlogPage;
