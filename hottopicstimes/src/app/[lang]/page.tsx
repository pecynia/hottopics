import Link from 'next/link'
import { Metadata, ResolvingMetadata  } from 'next'

import { Locale } from '@/app/../../i18n.config'
import { getDictionary } from '@/lib/dictionary'

export async function generateMetadata(
  { params }: { params: { lang: Locale } }, // The params for the page
  parent: ResolvingMetadata 
  ): Promise<Metadata> {
  return {
    title: 'Hot Topics Times',
    description: 'A news site for hot topics',
    openGraph: {
      type: 'website',
      title: 'Hot Topics Times',
      description: 'A news site for hot topics',
      url: 'https://www.hottopicstimes.com',
      images: [],
      siteName: 'Hot Topics Times',
      locale: params.lang,
      ttl: 30,
    }
  }
}

export default async function Home({
    params: { lang }
  }: {
    params: { lang: Locale }
  }) {  
    const { page } = await getDictionary(lang)
    
    return (
      <section>
        <h1 className='text-3xl'>{page.home.title}</h1>
        <p>{page.home.description}</p>
        <Link href='/[lang]/blog' as={`/${lang}/blog`}>
          <div className='border border-black p-4 max-w-xs'>
            <h2 className='text-xl'>{page.home.button}</h2>
          </div>
        </Link>

      </section>
  )
}
