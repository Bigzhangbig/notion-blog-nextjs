import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
          Notion Blog
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <Link href="/timeline" className="hover:text-blue-600 dark:hover:text-blue-400">
            Timeline
          </Link>
          <Link href="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400">
            Catalog
          </Link>
          <Link href="/search" className="hover:text-blue-600 dark:hover:text-blue-400">
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}
