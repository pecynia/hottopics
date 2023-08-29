import OpenAI from "openai"
import { articleFromKeywordArticle } from "@/app/[lang]/utils/generation/prompt-creator"
import { GeneratedStory, StoryPostRequest } from '@/app/../../../typings'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateStory({ keyword, article, languages }: StoryPostRequest): Promise<GeneratedStory> {
  const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: articleFromKeywordArticle(keyword, article, languages) }],
      model: "gpt-4",
  });

  const baseStoryContent = JSON.parse(completion.choices[0].message.content?.toString() || "{}");
  const generatedStory: GeneratedStory = {};

  languages.forEach(lang => {
      generatedStory[lang] = {
          ...baseStoryContent[lang],
          date: new Date().toISOString(),
          views: 0
      }
  });

  return generatedStory;
}


