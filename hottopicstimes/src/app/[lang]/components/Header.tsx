import Link from 'next/link'
import { Locale } from '@/app/../../i18n.config'
import { getDictionary } from '@/lib/dictionary'


export default async function Header({ lang }: { lang: Locale }) {

    const { navigation } = await getDictionary(lang)

    return (
        <header className='flex items-center justify-between space-x-2 font-bold px-10 py-5'>
            <div className='flex items-center space-x-2'>
                <Link href='/[lang]' as={`/${lang}`}>
                    <p>{navigation.title}</p>
                </Link>
            </div>
        </header>
    )
}