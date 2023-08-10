import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../utils/db'
import { Story } from '../../../types/story'
import { NextResponse } from 'next/server'

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const apiKey = req.headers['x-api-key'] as string
  
  console.log("API Key:", apiKey)

  if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const story = req.body as Story

  // Validate the story data
  if (!story.title || !story.content || !story.slug) {
    return res.status(400).json({ error: 'Invalid story data' })
  }

  try {
    const { status, message } = await db.addStory(story)
    return NextResponse.json({ status, message }, { status: 200 })
  } catch (error) {
    console.error("Error adding story:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
