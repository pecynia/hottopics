import OpenAI from "openai"
import { articleFromKeywordArticle } from "./prompt-creator"
import { GeneratedStory, StoryPostRequest } from '../../../../typings'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Make a story based on a provided keyword and corresponding HTML news article
export async function generateStory( { keyword, article }: StoryPostRequest ): Promise<GeneratedStory> {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: articleFromKeywordArticle(keyword, article, "en") }],
    model: "gpt-4",
  })

  // Convert the response to JSON based on the GeneratedStory type
  const generatedStory: GeneratedStory = JSON.parse(completion.choices[0].message.content?.toString() || "{}")

  return generatedStory;
}
