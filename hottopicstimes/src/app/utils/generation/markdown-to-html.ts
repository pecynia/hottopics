import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import html from 'remark-html';

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html)
    .use(addFAQTag)
    .process(markdown);
  return result.toString();
}

function addFAQTag() {
  return (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      // For FAQ section
      if (node.depth === 2 && node.children[0].value === 'FAQ') {
        node.data = {
          hProperties: {
            className: 'faq',
          },
        };
      }
      // For FAQ questions
      if (node.depth === 3) {
        node.data = {
          hProperties: {
            className: 'faq-question cursor-pointer font-bold mt-4',
          },
        };
      }
      // You can add more conditions for other headers or elements
    });

    visit(tree, 'paragraph', (node: any, index: number | null, parent: any) => {
      // Assuming FAQ answers come after FAQ questions
      if (index !== null && parent.children[index - 1]?.type === 'heading' && parent.children[index - 1]?.depth === 3) {
        node.data = {
          hProperties: {
            className: 'faq-answer hidden ml-5',
          },
        };
      }
    });
  };
}
