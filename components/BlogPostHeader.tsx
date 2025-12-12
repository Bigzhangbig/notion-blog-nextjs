'use client';

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function BlogPostHeader({ 
  title, 
  date, 
  wordCount, 
  readingTime, 
  tags 
}: { 
  title: string, 
  date: string, 
  wordCount: number, 
  readingTime: number, 
  tags: string[] 
}) {
  const { t } = useLanguage();

  return (
    <>
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 inline-block"
      >
        {t('post.back')}
      </Link>

      <header className="mb-8 not-prose">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <time>{new Date(date).toLocaleDateString()}</time>
          <div className="flex items-center gap-1">
            <span>{wordCount} {t('post.words')}</span>
            <span>•</span>
            <span>{readingTime} {t('post.minRead')}</span>
          </div>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
