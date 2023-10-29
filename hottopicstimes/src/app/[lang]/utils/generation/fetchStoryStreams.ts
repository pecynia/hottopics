import { OpenAI } from "openai-streams";

export const runtime = 'edge'

export async function fetchStoryStream(prompt: string): Promise<ReadableStream> {
  return await OpenAI("chat", {
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }]
  });
}
