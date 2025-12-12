'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="mb-16 text-center py-20 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 rounded-2xl">
      <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {t('home.hero.title')}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        {t('home.hero.desc')}
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/timeline" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          {t('home.hero.timeline')}
        </Link>
        <Link href="/search" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
          {t('home.hero.search')}
        </Link>
      </div>
    </section>
  );
}
