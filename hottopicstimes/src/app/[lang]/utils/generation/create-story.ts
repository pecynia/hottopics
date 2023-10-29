import { articleFromKeywordArticle } from "@/app/[lang]/utils/generation/prompt-creator";
import { GeneratedStory, StoryPostRequest } from '@/app/../../../typings';
import { fetchStoryStream } from "@/app/[lang]/utils/generation/fetchStoryStreams";
import { streamToStoryContent } from "@/app/[lang]/utils/generation/streamToStoryContent";

export async function generateStory({ keyword, article, languages }: StoryPostRequest): Promise<GeneratedStory> {
    const prompt = articleFromKeywordArticle(keyword, article, languages);
    const stream = await fetchStoryStream(prompt);
    const baseStoryContent = await streamToStoryContent(stream);

    const generatedStory: GeneratedStory = {};
    languages.forEach(lang => {
        generatedStory[lang] = {
            ...baseStoryContent[lang],
            date: new Date().toISOString(),
            views: 0
        };
    });

    return generatedStory;
}
