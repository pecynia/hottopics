import { Locale } from '@/app/../../i18n.config'


type StoryContent = {
    tags: string | string[] | null | undefined
    slug: string
    title: string
    description: string
    content: string
    date: string
    views: number
}
  
type Story = {
    _id: string
    [key: string]: StoryContent | string | undefined
}

type StoryLangRequest = {
    _id: string
    lang: Locale
}

export type PreSingleStory = {
    slug: string
    title: string
    description: string
    content: string
}

export type PreGeneratedStory = {
    [key: string]: {
        slug: string
        title: string
        description: string
        content: string
    }
}

export type GeneratedStory = {
    [key: string]: {
        slug: string
        title: string
        description: string
        content: string
        date: string
        views: number
    }
}

export type StoryAPIRequest = {
    keyword: string
    article: string
}

export type StoryPostRequest = {
    keyword: string
    article: string
    languages: Locale[]
}
  
export type StoryPageProps = {
    story: Story | null
}
  
  
  
  