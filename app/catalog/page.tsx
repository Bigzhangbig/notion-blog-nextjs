import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;

export default async function CatalogPage() {
  const posts = await getPublishedPosts();
  
  // Group posts by tag
  const tagsMap: Record<string, typeof posts> = {};
  
  posts.forEach(post => {
      post.tags.forEach(tag => {
          if (!tagsMap[tag]) {
              tagsMap[tag] = [];
          }
          tagsMap[tag].push(post);
      });
  });

  const sortedTags = Object.keys(tagsMap).sort();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Catalog</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {sortedTags.map(tag => (
            <div key={tag} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-blue-600">#</span> {tag}
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full ml-auto">
                        {tagsMap[tag].length}
                    </span>
                </h2>
                <ul className="space-y-3">
                    {tagsMap[tag].map(post => (
                        <li key={post.id}>
                            <Link href={`/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 block truncate">
                                {post.title}
                            </Link>
                            <span className="text-xs text-gray-500">
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </main>
  );
}
