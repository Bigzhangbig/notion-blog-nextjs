'use client';

import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

export default function PostList({ posts }: { posts: BlogPost[] }) {
  const { language, t } = useLanguage();

  // Filter and group posts to show only the relevant version for the current language
  // Strategy:
  // 1. Group posts by their "Original Content ID" (originalId).
  // 2. For each group, try to find a post that matches the current selected language.
  // 3. If found, show it.
  // 4. If not found, show the original post (fallback), OR show nothing if strict mode is desired.
  //    For now, we fallback to the original to ensure content is always visible.
  
  const uniquePosts = posts.reduce((acc, post) => {
    // Determine the grouping key (originalId or own id)
    const groupId = post.originalId || post.id;
    
    if (!acc[groupId]) {
        acc[groupId] = [];
    }
    acc[groupId].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  const filteredPosts = Object.values(uniquePosts).map(group => {
      // Find exact match for current language
      const match = group.find(p => p.language === language);
      if (match) return match;
      
      // If no exact match, fallback to the one that is NOT a translation (the original)
      // Usually the original has originalId === id or undefined language property logic if from main DB
      // In our logic, main DB posts have language='en' by default in lib/notion.ts, but user might write in zh.
      // So we pick the one that seems to be the "Main" post (usually the one without originalId matching another id, but here they share groupId)
      
      // Simpler fallback: prefer the one that matches 'en' if current is 'en', else just the first one?
      // Better: The original post is the one where id === groupId.
      const original = group.find(p => p.id === (p.originalId || p.id));
      
      // If we are in 'zh' mode and there is no 'zh' translation, showing 'en' is better than nothing.
      return original || group[0];
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid gap-8">
        <h2 className="text-3xl font-bold mb-0 flex items-center gap-2">
            {t('home.latest')}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {filteredPosts.length}
            </span>
        </h2>

        {filteredPosts.map((post) => (
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
            {/* Show language badge if it's a translation or specific language */}
            {post.language && (
                <span className={`text-xs px-2 py-0.5 rounded border ${post.language === 'zh' ? 'border-red-200 text-red-600 bg-red-50' : 'border-blue-200 text-blue-600 bg-blue-50'}`}>
                    {post.language === 'zh' ? '中文' : 'EN'}
                </span>
            )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt || "No excerpt available."}
            </p>
            <Link
            href={`/${post.slug}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
            {t('home.readMore')}
            </Link>
        </article>
        ))}
        {filteredPosts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                No posts found.
            </div>
        )}
    </div>
  );
}
