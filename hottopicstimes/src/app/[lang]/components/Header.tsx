import Link from 'next/link'
import { Locale } from '@/app/../../i18n.config'


export default async function Header({ lang }: { lang: Locale }) {
    return (
        <header className='flex items-center justify-between space-x-2 font-bold px-10 py-5'>
            <div className='flex items-center space-x-2'>
                <Link href='/'>
                    <p>Hot Topics Times</p>
                </Link>
            </div>
        </header>
    )
}