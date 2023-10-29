


// TODOS:
// - Look into submitting a sitemap to Google

import { Locale } from "@/app/../../i18n.config";

export function articleFromKeywordArticle(keyword: string, article: string, languages: Locale[]): string {
    return `
        Create a post for a blog, in Markdown, where you explain the topic of ${keyword} in the languages ${languages}.

        Write your post based on possible questions that might arrive surrouding the keyword in the article below.
        These should be focused on Google's E-E-A-T guidelines, but dont talk about them explicitly. Furthermore, it
        should not be about your own opinion or experience, but rather about the topic itself. Out of  Experience, Expertise, Authoritativeness, and Trustworthiness.
        
        Just focus on Expertise, Authoritativeness, and Trustworthiness. 

        Respective article snippet (in html):
        \`\`\`
        ${article}
        \`\`\`

        ---
        Include the following sections in your post:
        - Definition of the keyword
        - Extract the relevancy of the keyword from the article, why its interesting (people will not have access to the article, it is just for you to use for context)
        - Answer questions that might arise from the article (at least 5)

        Other notes:
        - DONT link to the article. Avoid saying "this article says" or "this article says that".
        - The FAQ section will be used to generate a FAQ schema for the post, so make sure to answer questions that might arise from the article.

        Skeleton structure:
        ## Definition of the keyword (Make this into your own title, not just "Definition of the keyword")
        ${keyword} is a ...

        ## Social relevancy/other relevancy (Make this into your own title, not just "Social relevancy/other relevancy")

        ## FAQ

        ---

        Write your post below in Markdown, being careful to follow the instructions above. Furthermore, put
        your answer in JSON format, containing the following fields for each language.
        - content (in Markdown)
        - description (short description of the post)
        - title
        - slug (the URL name of the post, make this something sensible and specific)
        
        Your response should look like
        {
            "language-1": {
                "content": "Markdown content",
                "description": "Short description",
                "title": "Title",
                "slug": "slug"
            },
            "language-2": {
                ...
            },
            ...

        and end with
        }

        Important:
        - JSON strings cannot contain newline characters (\n), and they need to be escaped. To fix the JSON, you should replace actual newlines with the escaped newline sequence (\n).
        - Make sure to only write about 'evergreen' topics, that will not change over time. For example, if you are writing about a specific event, make sure to write about the topic of the event, not the event itself.
        - Make a creative title (don't start with 'Understanding ${keyword}')
        - The description will also be used as the meta description for the post, so make sure it is a good description of the post.
        - Make the faq title a ## heading
        - Make the faq questions a ### heading
        - Make the faq answers a normal paragraph

        Write your response below in JSON format for the languages ${languages}:
    `
}