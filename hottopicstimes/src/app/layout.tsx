import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Header from './components/Header'
import Banner from './components/Banner'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hot Topics Times',
  description: 'A news site for hot topics',
  openGraph: {
    type: 'website',
    title: 'Hot Topics Times',
    description: 'A news site for hot topics',
    url: 'https://www.hottopicstimes.com',
    images: [],
    siteName: 'Hot Topics Times',
    locale: 'en_US',
    // alternateLocale: 'en_GB',
    ttl: 30,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Banner />
        {children}  {/* What is in page.tsx and below */}
      </body>
    </html>
  )
}
