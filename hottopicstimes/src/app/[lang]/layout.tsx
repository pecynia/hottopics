import './globals.css'
import type { Metadata } from 'next'
import { Locale, i18n } from '@/app/../../i18n.config'
import { Inter } from 'next/font/google'

import Header from '@/app/[lang]/components/Header'
import Banner from '@/app/[lang]/components/Banner'


const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <Header lang={params.lang} />
        <Banner />
        <main>{children}</main>
      </body>
    </html>
  )
}
