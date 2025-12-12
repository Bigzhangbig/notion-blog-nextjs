"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
      <Giscus
        id="comments"
        repo="Bigzhangbig/notion-blog-nextjs"
        repoId="R_kgDOQndsSQ"
        category="Announcements"
        categoryId="DIC_kwDOQndsSc4Czs0e"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
