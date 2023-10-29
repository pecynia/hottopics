import { articleFromKeywordArticle } from "@/app/[lang]/utils/generation/prompt-creator"
import { GeneratedStory, StoryPostRequest } from '@/app/../../../typings'
import { fetchStoryStream } from "@/app/[lang]/utils/generation/fetchStoryStreams";
import { streamToStoryContent } from "@/app/[lang]/utils/generation/streamToStoryContent";

export async function generateStory({ keyword, article, languages }: StoryPostRequest): Promise<GeneratedStory> {
    // Construct the prompt
    const prompt = articleFromKeywordArticle(keyword, article, languages);
  
    // Use the fetchStoryStream function to get the stream
    const stream = await fetchStoryStream(prompt);
  
    // Convert the stream to the story content format
    const baseStoryContent = await streamToStoryContent(stream);
  
    // Construct the GeneratedStory object
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


