
export function articleFromKeywordArticle(keyword: string, article: string, language: string): string {
    return `
        Create a post for a blog, in Markdown, where you explain the topic of ${keyword} in ${language}.

        Write your post based on possible questions that might arrive surrouding the keyword in the article below.
        These should be focused on Google's E-E-A-T guidelines, but dont talk about them explicitly. Furthermore, it
        should not be about your own opinion or experience, but rather about the topic itself. Out of  Experience, Expertise, Authoritativeness, and Trustworthiness.
        Just focus on Expertise, Authoritativeness, and Trustworthiness. 

        Respective article snippet (in html):

        ${article}

        ---
        Include the following sections in your post:
        - Definition of the keyword
        - Related keywords (hidden)
        - Extract relevancy from the article (people will not have access to the article, it is just for you to use for context)
        - Answer questions that might arise from the article (at least 5)

        Other notes:
        - DONT link to the article. You can add it as a source if you have an URL, but avoid saying "this article says" or "this article says that".
        - Related notes will be added to the metadata of the post, so that they can be used for SEO purposes.
        - The FAQ section will be used to generate a FAQ schema for the post, so make sure to answer questions that might arise from the article.

        Skeleton structure:
        ## Definition of the keyword (Make this into your own title, not just "Definition of the keyword")
        ${keyword} is a ...

        ## Social relevancy/other relevancy (Make this into your own title, not just "Social relevancy/other relevancy")

        ## FAQ

        ---

        Write your post below in Markdown, being careful to follow the instructions above. Furthermore, put
        your answer in JSON format, containing the following fields:
        - content (in Markdown)
        - description (short description of the post)
        - title
        - slug (the URL name of the post, make this something sensible and specific)
        - language
        
        Your response should start with
        {
            "slug": 

        and end with
        }

        Important:
        - JSON strings cannot contain newline characters (\n), and they need to be escaped. To fix the JSON, you should replace actual newlines with the escaped newline sequence (\n).
        - Make sure to only write about 'evergreen' topics, that will not change over time. For example, if you are writing about a specific event, make sure to write about the topic of the event, not the event itself.
        - Make a creative title (don't start with 'Understading keyword')

        Write your response below in JSON format in language ${language}:
    `
}