import { getPublishedPosts } from "@/lib/notion";
import PostList from "@/components/PostList";
import HomeHero from "@/components/HomeHero";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <HomeHero />
      <PostList posts={posts} />
    </main>
  );
}
