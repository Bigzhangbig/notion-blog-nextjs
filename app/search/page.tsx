import { getPublishedPosts } from "@/lib/notion";
import SearchClient from "./SearchClient";

export const revalidate = 60;

export default async function SearchPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Search</h1>
      <SearchClient posts={posts} />
    </main>
  );
}
