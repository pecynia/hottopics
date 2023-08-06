import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hot Topics Times',
  description: 'A news site for hot topics',
};

type LayoutProps = {
  children: React.ReactNode;
};

const BlogLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={inter.className}>
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center my-8">
            <h1 className="text-4xl font-bold">{metadata.title}</h1>
          </header>
          <main>{children}</main>
          <footer className="text-center my-8">
            <p className="text-gray-600">&copy; 2023 Hot Topics Times</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default BlogLayout;
