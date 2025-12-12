"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
      <Giscus
        id="comments"
        repo="YOUR_GITHUB_USERNAME/YOUR_REPO_NAME" // User needs to configure this
        repoId="YOUR_REPO_ID" // User needs to configure this
        category="Announcements"
        categoryId="YOUR_CATEGORY_ID"
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
