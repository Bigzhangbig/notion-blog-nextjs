'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

type LengthOption = 'short' | 'medium' | 'long';

export default function AISummary({ content, articleId, initialSummary }: { content: string, articleId: string, initialSummary?: string }) {
  const { language, t } = useLanguage();
  const [summary, setSummary] = useState<string | null>(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default to medium length for auto-summary
  const [length] = useState<LengthOption>('medium');

  useEffect(() => {
    // If we already have a summary (from props/cache), do nothing
    if (summary) return;
    
    // Auto generate on mount
    const generateSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // We pass articleId so the backend can cache it to Notion
          body: JSON.stringify({ articleId, content, length, lang: language }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }

        const data = await response.json() as { summary: string };
        setSummary(data.summary);
      } catch (err) {
        setError('Failed to load summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, content, language]); // Re-run if language changes

  if (error) return null; // Hide if error to keep UI clean

  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">✨</span> {t('summary.title')}
        </h3>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500 animate-pulse py-4">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{t('summary.generating')}</span>
        </div>
      )}

      {summary && !loading && (
        <div className="prose dark:prose-invert max-w-none animate-in fade-in duration-500">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              &quot;{summary}&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
