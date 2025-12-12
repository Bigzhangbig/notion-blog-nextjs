import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion";
import GiscusComments from "@/components/GiscusComments";
import AISummary from "@/components/AISummary";
import TranslateButton from "@/components/TranslateButton";
import BlogPostHeader from "@/components/BlogPostHeader";
import { calculateReadingStats } from "@/lib/utils";
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

  const { wordCount, readingTime } = calculateReadingStats(post.content || "");

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <BlogPostHeader 
        title={post.title} 
        date={post.date} 
        wordCount={wordCount} 
        readingTime={readingTime} 
        tags={post.tags} 
      />

      <article className="prose dark:prose-invert max-w-none">
        <AISummary content={post.content || ""} articleId={post.id} initialSummary={post.summary} />

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

        <TranslateButton articleId={post.id} title={post.title} />
      </article>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
         <GiscusComments />
      </div>
    </main>
  );
}
