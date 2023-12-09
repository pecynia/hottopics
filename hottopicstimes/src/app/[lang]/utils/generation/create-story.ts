import { articleFromKeywordArticle } from "@/app/[lang]/utils/generation/prompt-creator"
import { GeneratedStory, PreGeneratedStory, PreSingleStory, StoryPostRequest } from '@/app/../../../typings'
import { fetchStoryStream } from "@/app/[lang]/utils/generation/fetchStoryStreams"
import { streamToStoryContent } from "@/app/[lang]/utils/generation/streamToStoryContent"

export async function generateStory({ keyword, article, languages }: StoryPostRequest): Promise<GeneratedStory> {
    const prompt = articleFromKeywordArticle(keyword, article, languages)
    const stream = await fetchStoryStream(prompt)

    console.log("Getting stream success")
    
    const baseStoryContent = await streamToStoryContent(stream)! as PreGeneratedStory

    const generatedStory: GeneratedStory = {}
    languages.forEach(lang => {
        const contentForLang = baseStoryContent[lang] as PreSingleStory
        generatedStory[lang] = {
            ...contentForLang,
            date: new Date().toISOString(),
            views: 0
        }
    })

    return generatedStory
}
