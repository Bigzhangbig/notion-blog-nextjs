import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion";
import GiscusComments from "@/components/GiscusComments";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <time>{new Date(post.date).toLocaleDateString()}</time>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            img: (props) => {
                const { node, ...rest } = props;
                // If it's a relative URL, or we want to use next/image for optimization
                // Since we don't know dimensions, we use the unoptimized prop or width/height auto trick
                // However, for Notion S3 urls, they might expire. 
                // Using standard img tag is often safer for dynamic content unless we proxy images.
                // But let's try to make it responsive.
                return (
                    <span className="block relative w-full h-auto min-h-[200px] my-8">
                         {/* Fallback to standard img if next/image fails or for simplicity with unknown sizes */}
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img 
                            {...rest} 
                            className="rounded-lg shadow-lg max-w-full h-auto mx-auto"
                            loading="lazy"
                            alt={props.alt || "Post image"}
                         />
                    </span>
                );
            },
            // Custom styling for code blocks if needed, but prose plugin handles most
            pre: ({ children }) => <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">{children}</pre>,
          }}
        >
          {post.content || ""}
        </ReactMarkdown>
      </article>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
         <GiscusComments />
      </div>
    </main>
  );
}
