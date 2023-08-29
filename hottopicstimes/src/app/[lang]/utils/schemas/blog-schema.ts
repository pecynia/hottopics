import { StoryContent } from '@/app/../../typings';

export function addBlogJsonLd(story: StoryContent) {
    return {
      __html: `{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.hottopicstimes.com/blog/${story.slug}"
        },
        "headline": "${story.title}",
        "description": "${story.description}",
        "image": [],
        "author": {
          "@type": "Person",
          "url": "https://www.hottopicstimes.com",
          "name": "Hot Topics Times"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hot Topics Times",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.hottopicstimes.com/logo.png"
          }
        },
        "datePublished": "${story.date}",
        "dateModified": "${story.date}"
      }
    `,}
  }