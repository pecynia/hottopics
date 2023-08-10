import { Inter } from 'next/font/google';
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hot Topics Times',
  description: 'A news site for hot topics',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}