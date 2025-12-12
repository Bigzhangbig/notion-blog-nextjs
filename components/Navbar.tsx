'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
          Notion Blog
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t('nav.home')}
          </Link>
          <Link href="/timeline" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t('nav.timeline')}
          </Link>
          <Link href="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t('nav.catalog')}
          </Link>
          <Link href="/search" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t('nav.search')}
          </Link>
          <Link href="/about-blog" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t('nav.aboutBlog')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>
      </div>
    </nav>
  );
}
