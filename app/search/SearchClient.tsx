'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';

export default function SearchClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  
  const filteredPosts = posts.filter(post => {
      const lowerQuery = query.toLowerCase();
      return (
          post.title.toLowerCase().includes(lowerQuery) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) ||
          post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input 
                type="search" 
                id="search" 
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search articles..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="space-y-4">
          {query && filteredPosts.length === 0 && (
              <p className="text-center text-gray-500">No results found for &quot;{query}&quot;</p>
          )}
          
          {filteredPosts.map(post => (
              <div key={post.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <Link href={`/${post.slug}`}>
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</h5>
                  </Link>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded text-xs text-gray-800 dark:text-gray-200">
                                {tag}
                            </span>
                        ))}
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
