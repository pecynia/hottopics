import db from '@/app/[lang]/utils/db'
import { GeneratedStory } from '@/app/../../typings'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  const apiKey = req.headers.get('x-api-key')?.toString()

  // Validate the API key
  if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const story = await req.json() as GeneratedStory

  try {
    const { status, message } = await db.addStory(story)
    return NextResponse.json({ status, message }, { status: 200 })
  } catch (error) {
    console.error("Error adding story:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
