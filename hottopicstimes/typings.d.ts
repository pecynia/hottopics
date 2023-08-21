export type Story = {
    _id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    content: string;
    language: string;
    views: number;
    tags: string[];
};

export type GeneratedStory = {
    slug: string;
    title: string;
    description: string;
    content: string;
    language: string;
};

export type StoryPostRequest = {
    keyword: string;
    article: string;
};
  
export type StoryPageProps = {
    story: Story | null;
};
  
  
  
  