import Link from 'next/link'

function Header() {
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

export default Header