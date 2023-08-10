// // pages/blog/[slug]/edit.tsx
// import { useRouter } from 'next/router';
// import { revalidateTag } from 'next/cache';
// import db from '../../../utils/db'; // Adjust the path based on your folder structure

// export default function EditStoryPage() {
//   const router = useRouter();
//   const { slug } = router.query;

//   async function handleUpdate(formData: FormData) {
//     'use server'; // This directive indicates the code runs on the server

//     // Fetch the current story
//     const story = await db.getStoryBySlug(slug as string);

//     if (!story) {
//       throw new Error('Story not found');
//     }

//     // Update the story with the new data
//     const updatedStory = {
//       title: formData.get('title'),
//       content: formData.get('content'),
//     };

//     await db.updateStory(slug as string, updatedStory);

//     // Revalidate pages associated with the 'stories' tag
//     revalidateTag('stories');

//     // Redirect to the story page after updating
//     router.push(`/blog/${slug}`);
//   }

//   return (
//     <div>
//       <h1>Edit Story</h1>
//       <form action={handleUpdate}>
//         <div>
//           <label htmlFor="title">Title:</label>
//           <input type="text" name="title" id="title" required />
//         </div>
//         <div>
//           <label htmlFor="content">Content:</label>
//           <textarea name="content" id="content" required></textarea>
//         </div>
//         <button type="submit">Update Story</button>
//       </form>
//     </div>
//   );
// }
