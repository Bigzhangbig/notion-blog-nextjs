import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">My Notion Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Powered by Notion, Next.js, and Cloudflare Workers
        </p>
      </header>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          >
            <Link href={`/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                {post.title}
              </h2>
            </Link>
            <div className="text-sm text-gray-500 mb-4 flex gap-4">
              <time>{new Date(post.date).toLocaleDateString()}</time>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {post.excerpt || "No excerpt available."}
            </p>
            <div className="mt-4">
              <Link
                href={`/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
