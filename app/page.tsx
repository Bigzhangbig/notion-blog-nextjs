import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <section className="mb-16 text-center py-20 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 rounded-2xl">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Notion Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          A modern, static blog powered by Notion as a CMS and Next.js.
          Write in Notion, publish to the web instantly.
        </p>
        <div className="flex gap-4 justify-center">
            <Link href="/timeline" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                View Timeline
            </Link>
            <Link href="/search" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                Search Posts
            </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            Recent Posts
            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {posts.length}
            </span>
        </h2>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-6 border rounded-xl hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 group"
            >
              <Link href={`/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-500 mb-4 flex gap-4 items-center">
                <time className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {new Date(post.date).toLocaleDateString()}
                </time>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {post.excerpt || "No excerpt available."}
              </p>
              <Link
                href={`/${post.slug}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Read article 
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
