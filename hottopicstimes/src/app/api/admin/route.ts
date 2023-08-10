import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'
import { Story } from '../../../../typings'
import { NextResponse } from 'next/server'

// The original path was src/app/pages/api/admin/route.ts

export const POST = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const apiKey = req.headers.get('x-api-key')?.toString()
  
  console.log("API Key:", apiKey)

  if (!apiKey || apiKey !== process.env.SECRET_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const story = req.body as unknown as Story

  // Validate the story data
  if (!story.title || !story.content || !story.slug) {
    return NextResponse.json({ error: 'Invalid story data' }, { status: 400 })
  }

  try {
    const { status, message } = await db.addStory(story)
    return NextResponse.json({ status, message }, { status: 200 })
  } catch (error) {
    console.error("Error adding story:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
