import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 className='text-3xl'>Hot Topics Times</h1>
      <p>
        Welcome to the Hot Topics Times! We are a news site for hot topics.
      </p>
      <Link href='/blog'>
        <div className='border border-black p-4 max-w-xs'>
          <h2 className='text-xl'>Blog</h2>
        </div>
      </Link>

    </main>
  )
}
