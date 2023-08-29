import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import NodeCache from 'node-cache'
import { Story, StoryContent, StoryPostRequest, StoryLangRequest } from '@/app/../../../typings'
import { generateStory } from '@/app/[lang]/utils/generation/create-story'
import { Locale } from '@/app/../../i18n.config'



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

async function getStories(lang: Locale) {
    const db = await connectToDatabase();

    // Fetch stories that have the given language property (e.g., "en.slug" exists)
    const stories = await db.collection('stories').find({ [`${lang}.slug`]: { $exists: true } }).toArray();

    // Restructure the results to only contain the specified language content
    const formattedStories = stories.map((story: Story) => {
        return {
            _id: story._id,
            [lang]: story[lang]
        };
    }) as Story[]

    return formattedStories;
}


type StoryFind ={
    _id: string,
    slug: string,
}
// Function to fetch all story slugs for a given language
async function getAllStorySlugs(lang: Locale): Promise<StoryFind[]> {
    const db = await connectToDatabase()

    // Use the dot notation to query nested fields
    const foundStories: Story[] = await db.collection('stories').find({ [`${lang}.slug`]: { $exists: true } }, { projection: { [`${lang}.slug`]: 1 } }).toArray()

    return foundStories.map((story: Story) => {
        const storyContent = story[lang] as StoryContent  // Here's the type assertion
        return {
            _id: story._id,
            slug: storyContent.slug,
        }
    })
}

async function addStory({ keyword, article, languages }: StoryPostRequest) {
    const generatedStory = await generateStory({ keyword, article, languages })
    const db = await connectToDatabase();
    
    await db.collection('stories').insertOne({
      ...generatedStory,
      _id: new ObjectId().toString()
    });
  
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

async function getStoryBySlug(slug: string, lang: Locale): Promise<StoryContent> {
    // Try to get the story from the cache first
    const cachedStory: Story = storyCache.get(slug) as Story
    const cachedStoryContent = cachedStory && cachedStory[lang] as StoryContent
    if (cachedStory) {
      return cachedStoryContent
    }
  
    // If the story is not in the cache, get it from the database
    const db = await connectToDatabase()
    const story: Story = await db.collection('stories').findOne({ [`${lang}.slug`]: slug })
    const storyContent = story && story[lang] as StoryContent
    
    // If the story has a high view count, cache it
    if (story && storyContent.views > STORY_VIEW_THRESHOLD) {
      storyCache.set(slug, story)
    }
  
    return storyContent
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
