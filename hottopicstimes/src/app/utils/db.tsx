import { MongoClient, ServerApiVersion } from 'mongodb'
import NodeCache from 'node-cache'
import { Story, StoryPageProps  } from '../../../typings'


// -------------------- DATABASE --------------------

// MongoDB Atlas connection URI
const uri: string | undefined = process.env.MONGODB_URI
if (!uri) throw new Error("The MONGODB_URI environment variable must be defined.")

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

let cachedDb: any = null

// Function to connect to the database
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb
    }

    // Connect the client to the server
    await client.connect()

    const dbName: string | undefined = process.env.MONGODB_DB
    if (!dbName) throw new Error("The MONGODB_DB environment variable must be defined.")

    const db = client.db(dbName)
    cachedDb = db
    return db
}

// -------------------- DATABASE OPERATIONS --------------------

// Function to update a story
async function updateStory(slug: string, updatedStory: any) {
    const db = await connectToDatabase()
    return await db.collection('stories').updateOne({ slug }, { $set: updatedStory })
}

// Function to fetch all stories
async function getStories() {
    const db = await connectToDatabase()

    // Convert array to Story objects
    return await db.collection('stories').find().toArray()
}

type StoryFind ={
    _id: string,
    slug: string,
}
// Function to fetch all story slugs
async function getAllStorySlugs() {
    const db = await connectToDatabase()
    const foundStories: StoryFind[] = await db.collection('stories').find({}, { projection: { slug: 1 } }).toArray()
    return foundStories.map((story: StoryFind) => story.slug)
}

// Function to add a new story to the database
async function addStory(newStory: Story) {
    const db = await connectToDatabase();
    await db.collection('stories').insertOne(newStory);
    return {
        status: 'ok',
        message: 'Story added successfully',
    };
}

// --------------- CACHING AND SERVER-SIDE PROPS ---------------

const storyCache = new NodeCache({ stdTTL: 3600 }) // Cache for 1 hour

function getEnvVar(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Environment variable ${key} is not set.`)
    }
    return value
}

const STORY_VIEW_THRESHOLD = getEnvVar('STORY_VIEW_THRESHOLD') as unknown as number

async function getStoryBySlug(slug: string): Promise<Story> {
    // Try to get the story from the cache first
    const cachedStory: Story = storyCache.get(slug) as Story
    if (cachedStory) {
      return cachedStory
    }
  
    // If the story is not in the cache, get it from the database
    const db = await connectToDatabase()
    const story: Story = await db.collection('stories').findOne({ slug })
  
    // If the story has a high view count, cache it
    if (story && story.views > STORY_VIEW_THRESHOLD) {
      storyCache.set(slug, story)
    }
  
    return story
  }
  

// -------------------- SERVER-SIDE PROPS --------------------

async function incrementStoryViews(slug: string) {
    const db = await connectToDatabase()
    return await db.collection('stories').updateOne({ slug }, { $inc: { views: 1 } })
}
  
export default {
    updateStory,
    addStory,
    getStories,
    getAllStorySlugs,
    getStoryBySlug,
    incrementStoryViews,
}

// -------------------- TRIGGERS --------------------


// const db = await connectToDatabase()
// const collection = db.collection('stories');

// const changeStream = collection.watch();

// changeStream.on('change', (next: { operationType: string; fullDocument: any }) => {
//     // Handle the change event
//     if (next.operationType === 'insert') {
//         const newStory = next.fullDocument;
//         // Trigger the webhook endpoint to regenerate the page
//         fetch('/api/regenerate', {
//             method: 'POST',
//             body: JSON.stringify(newStory),
//         });
//     }
// });
