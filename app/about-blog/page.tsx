'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

export default function AboutBlogPage() {
  const { language } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">
        {language === 'zh' ? '关于本博客' : 'About This Blog'}
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
             {language === 'zh' ? '核心技术栈' : 'Core Stack'}
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="font-bold">Framework:</span> Next.js 15 (App Router)
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">Language:</span> TypeScript
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">Styling:</span> Tailwind CSS 4
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">CMS:</span> Notion Database
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">
            {language === 'zh' ? '云服务 & AI' : 'Cloud & AI'}
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="font-bold">Hosting:</span> Cloudflare Pages
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">Serverless:</span> Cloudflare Pages Functions
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">AI Model:</span> Qwen3-30b-a3b-fp8
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">Comments:</span> Giscus (GitHub Discussions)
            </li>
          </ul>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">
            {language === 'zh' ? '系统架构' : 'System Architecture'}
        </h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Simple CSS-based Diagram Representation */}
            <div className="flex flex-wrap justify-center gap-8 w-full">
              <div className="w-48 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <div className="font-bold text-lg mb-2">Notion</div>
                <div className="text-sm">Content Management</div>
              </div>
              <div className="text-2xl self-center">→</div>
              <div className="w-48 p-4 bg-black text-white rounded-lg">
                <div className="font-bold text-lg mb-2">Next.js Build</div>
                <div className="text-sm">Static Generation (SSG)</div>
              </div>
              <div className="text-2xl self-center">→</div>
              <div className="w-48 p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <div className="font-bold text-lg mb-2">Cloudflare</div>
                <div className="text-sm">Global Edge Network</div>
              </div>
            </div>
            
            <div className="h-8 w-0.5 bg-gray-300 dark:bg-gray-700 my-2"></div>
            
            <div className="flex flex-wrap justify-center gap-8 w-full">
              <div className="w-64 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border-2 border-dashed border-blue-400">
                <div className="font-bold text-lg mb-2">Workers AI</div>
                <div className="text-sm">
                  {language === 'zh' ? 'Qwen 模型自动翻译与总结' : 'Auto-Translation & Summary via Qwen'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">
            {language === 'zh' ? '核心功能实现' : 'Key Features Implementation'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2 text-blue-600">🤖 {language === 'zh' ? 'AI 智能翻译' : 'AI-Powered Translation'}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'zh' 
                ? '博客集成 Cloudflare Workers AI，使用 Qwen 模型自动翻译文章。当触发翻译时，Serverless 函数从 Notion 获取内容，处理并生成新的本地化条目。'
                : 'The blog uses Cloudflare Workers AI to automatically translate articles. When triggered, a serverless function fetches the content from Notion, processes it with Qwen, and creates a new localized entry in a dedicated Notion database.'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-green-600">⚡ {language === 'zh' ? '静态站点生成 (SSG)' : 'Static Site Generation (SSG)'}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'zh'
                ? '为了确保极致速度和 SEO 表现，整个博客在构建时预渲染。动态功能如搜索和评论在客户端处理，而内容通过 Cloudflare CDN 即时分发。'
                : 'To ensure maximum speed and SEO performance, the entire blog is pre-rendered at build time. Dynamic features like search and comments are handled client-side, while content delivery is instant via Cloudflare\'s CDN.'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-purple-600">🔄 {language === 'zh' ? '智能同步' : 'Intelligent Synchronization'}</h3>
            <p className="text-gray-600 dark:text-gray-400">
               {language === 'zh'
                ? '内容完全在 Notion 中管理。自定义构建脚本获取数据，优化图像并生成必要的静态文件。这种分离允许用户友好的写作体验与开发者友好的部署流程。'
                : 'Content is managed entirely in Notion. A custom build script fetches data, optimizes images, and generates the necessary static files. This separation allows for a user-friendly writing experience with a developer-friendly deployment pipeline.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
