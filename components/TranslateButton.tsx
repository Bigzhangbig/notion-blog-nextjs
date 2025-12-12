'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';

interface TranslateButtonProps {
  articleId: string;
  title: string;
}

export default function TranslateButton({ articleId, title }: TranslateButtonProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTranslate = async (lang: 'en' | 'zh') => {
    setLoading(true);
    setMessage(`Translating to ${lang}... This may take a minute.`);
    try {
      // Use relative path for deployed/dev environment
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, targetLang: lang, title }),
      });
      
      const data = await res.json() as { success: boolean; error?: string; cached?: boolean; message?: string };
      if (res.ok && data.success) {
        if (data.cached) {
            setMessage('Translation already exists in Notion!');
        } else {
            setMessage('Translation created successfully! It will appear after the next site rebuild.');
        }
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      setMessage('Network error or API not available.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {t('admin.translate')}
      </h3>
      <div className="flex gap-3">
        <button 
          onClick={() => handleTranslate('en')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Translate to English'}
        </button>
        <button 
          onClick={() => handleTranslate('zh')}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Translate to Chinese'}
        </button>
      </div>
      {message && (
        <div className={`mt-3 text-sm p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
