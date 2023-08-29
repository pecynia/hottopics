import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import html from 'remark-html'
import { Locale } from '@/app/../../../i18n.config'
import { getDictionary } from '@/lib/dictionary'


export async function markdownToHtml(markdown: string, lang: Locale) {
  let faqs: { question: string; answer: string }[] = []
  const result = await remark()
    .use([(tree) => addFAQTag(tree, faqs) as any, html])
    .process(markdown)

  let htmlString = result.toString()

  // Replace 'id' with 'class' in the resulting HTML string
  htmlString = htmlString.replace(/ id="/g, ' class="')
  htmlString = htmlString.replace(/ class="user-content-/g, ' class="')

  // Remove everything after the FAQ (this can be FAQ or Frequently Asked Questions)
  const { faq } = await getDictionary(lang)
  const faqIndex = htmlString.indexOf(faq.short) !== -1 ? htmlString.indexOf(faq.short) : htmlString.indexOf(faq.title)
  if (faqIndex !== -1) {
    htmlString = htmlString.substring(0, faqIndex)
  }

  return { content: htmlString, faqs }
}


// Visitor function to add FAQ tags to the headings and paragraphs
function addFAQTag(tree: any, faqs: { question: string; answer: string }[]) {
  let faqCount = 0
  let currentQuestion = ''

  // Visitor function to handle headings
  function headingVisitor(node: any) {
      // H1
      if (node.depth === 1) {
          node.data = node.data || {}
          node.data.hProperties = {
              ...node.data.hProperties,
              id: 'font-bold text-2xl mt-4'
          }
      }

      // H2
      if (node.depth === 2) {
          node.data = node.data || {}
          node.data.hProperties = {
              ...node.data.hProperties,
              id: 'font-bold text-xl mt-4'
          }
      }

      // For FAQ questions
      if (node.depth === 3) {
        currentQuestion = node.children[0].value;
        if (faqs[faqCount]) {
            faqs[faqCount].question = currentQuestion;
        } else {
            faqs[faqCount] = { question: currentQuestion, answer: '' };
        }
        node.data = node.data || {};
        node.data.hProperties = {
            ...node.data.hProperties,
            id: `cursor-pointer mt-4 faq-question`
        };
        faqCount++;
      }

}

function paragraphVisitor(node: any, index: number | null, parent: any) {
    // Assuming FAQ answers come after FAQ questions
    if (index !== null && parent.children[index - 1]?.type === 'heading' && parent.children[index - 1]?.depth === 3) {
        const answerText = node.children[0].value;
        faqs.push({ question: '', answer: answerText }); 
    }
}

  function transform(tree: any): void {
    visit(tree, 'paragraph', paragraphVisitor)
    visit(tree, 'heading', headingVisitor)

  }

  return transform
}

