import db from '../../utils/db'
import { Story } from '../../../../typings'
import { NextResponse } from 'next/server'

async function readStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  let chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(value);
    }
  }
  const concatenated = new Uint8Array(chunks.reduce((acc, val) => acc + val.length, 0));
  let offset = 0;
  for (let chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(concatenated);
}

export const POST = async (req: Request) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
  const apiKey = req.headers.get('x-api-key')?.toString()
  
  // Validate the API key
  if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const storyData = await readStream(req.body!);
  const story = JSON.parse(storyData) as Story;

  console.log("Story:", story);

  // Validate the story data
  if (!story.title || !story.content || !story.slug) {
    return NextResponse.json({ error: 'Invalid story data' }, { status: 400 })
  }

  // Push it to the database
  try {
    const { status, message } = await db.addStory(story)
    return NextResponse.json({ status, message }, { status: 200 })
  } catch (error) {
    console.error("Error adding story:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
