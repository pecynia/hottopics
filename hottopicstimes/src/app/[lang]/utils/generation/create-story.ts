import { articleFromKeywordArticle } from "@/app/[lang]/utils/generation/prompt-creator"
import { GeneratedStory, PreGeneratedStory, PreSingleStory, StoryPostRequest } from '@/app/../../../typings'
import { fetchStoryStream } from "@/app/[lang]/utils/generation/fetchStoryStreams"
import { streamToStoryContent } from "@/app/[lang]/utils/generation/streamToStoryContent"

export async function generateStory({ keyword, article, languages }: StoryPostRequest): Promise<GeneratedStory> {
    const prompt = articleFromKeywordArticle(keyword, article, languages)
    const stream = await fetchStoryStream(prompt)
    
    const baseStoryContent = await streamToStoryContent(stream) as PreGeneratedStory

    console.log("Base story content:", baseStoryContent)
    console.log("Keys in baseStoryContent:", Object.keys(baseStoryContent));
    console.log("Languages:", languages)
    console.log("Base story content for first language:", baseStoryContent[languages[0]])

    const generatedStory: GeneratedStory = {}
    languages.forEach(lang => {
        const contentForLang = baseStoryContent[lang] as PreSingleStory
        generatedStory[lang] = {
            ...contentForLang,
            date: new Date().toISOString(),
            views: 0
        }
    })

    console.log("Generated story:", generatedStory)
    
    return generatedStory
}
