'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.timeline': 'Timeline',
    'nav.catalog': 'Catalog',
    'nav.search': 'Search',
    'nav.aboutBlog': 'About Blog',
    'home.latest': 'Latest Posts',
    'home.readMore': 'Read more →',
    'home.hero.title': 'Notion Blog',
    'home.hero.desc': 'A modern, static blog powered by Notion as a CMS and Next.js. Write in Notion, publish to the web instantly.',
    'home.hero.timeline': 'View Timeline',
    'home.hero.search': 'Search Posts',
    'post.back': '← Back to Home',
    'post.words': 'words',
    'post.minRead': 'min read',
    'summary.title': '✨ AI Summary',
    'summary.generate': 'Generate Summary',
    'summary.generating': 'Generating...',
    'summary.style': 'Style',
    'summary.length': 'Length',
    'summary.concise': 'Concise',
    'summary.detailed': 'Detailed',
    'summary.casual': 'Casual',
    'summary.professional': 'Professional',
    'summary.short': 'Short',
    'summary.medium': 'Medium',
    'summary.long': 'Long',
    'comments.title': 'Comments',
    'admin.translate': 'Admin: Translate',
    'footer.copyright': '© 2025 Notion Blog. Powered by Next.js & Cloudflare.',
  },
  zh: {
    'nav.home': '首页',
    'nav.timeline': '时间线',
    'nav.catalog': '目录',
    'nav.search': '搜索',
    'nav.aboutBlog': '关于博客',
    'home.latest': '最新文章',
    'home.readMore': '阅读更多 →',
    'home.hero.title': 'Notion 博客',
    'home.hero.desc': '基于 Notion CMS 和 Next.js 构建的现代化静态博客。在 Notion 写作，即刻发布到全网。',
    'home.hero.timeline': '查看时间线',
    'home.hero.search': '搜索文章',
    'post.back': '← 返回首页',
    'post.words': '字',
    'post.minRead': '分钟阅读',
    'summary.title': '✨ AI 智能摘要',
    'summary.generate': '生成摘要',
    'summary.generating': '生成中...',
    'summary.style': '风格',
    'summary.length': '长度',
    'summary.concise': '精简',
    'summary.detailed': '详细',
    'summary.casual': '轻松',
    'summary.professional': '专业',
    'summary.short': '简短',
    'summary.medium': '适中',
    'summary.long': '详尽',
    'comments.title': '评论',
    'admin.translate': '管理：翻译文章',
    'footer.copyright': '© 2025 Notion Blog. 基于 Next.js & Cloudflare 构建。',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh'); // Default to Chinese

  useEffect(() => {
    const savedLang = localStorage.getItem('blog_language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
       // Auto-detect browser language
       const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
       setLanguageState(browserLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('blog_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
