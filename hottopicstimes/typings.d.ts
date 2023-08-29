import { Locale } from '@/app/../../i18n.config'


type StoryContent = {
    tags: string | string[] | null | undefined;
    slug: string,
    title: string,
    description: string,
    content: string,
    date: string,
    views: number
}
  
type Story = {
    _id: string;
    [key: string]: StoryContent | string | undefined;
}

type StoryLangRequest = {
    _id: string;
    lang: Locale;
}


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
  
  
  
  