import { Octokit } from "@octokit/rest";
import matter from "gray-matter";
import { BlogPost } from "./types";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || "";
const REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";

export const backupPostToGithub = async (post: BlogPost) => {
  if (!post.content) {
    console.warn(`No content for post ${post.slug}, skipping backup.`);
    return;
  }

  // Create frontmatter
  const fileContent = matter.stringify(post.content, {
    title: post.title,
    date: post.date,
    tags: post.tags,
    slug: post.slug,
    notionId: post.id,
  });

  const path = `posts/${post.slug}.md`;
  const message = `Backup: ${post.title}`;
  const contentEncoded = Buffer.from(fileContent).toString("base64");

  try {
    // Check if file exists to get SHA
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: path,
        ref: BRANCH,
      });

      if (!Array.isArray(data) && data.sha) {
        sha = data.sha;
      }
    } catch (e: any) {
      if (e.status !== 404) {
        throw e;
      }
      // File doesn't exist, proceed with creation (sha is undefined)
    }

    // Create or Update
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: message,
      content: contentEncoded,
      branch: BRANCH,
      sha: sha, // Required for update
    });

    console.log(`Successfully backed up ${post.slug} to GitHub.`);
  } catch (error) {
    console.error(`Failed to backup ${post.slug}:`, error);
    throw error;
  }
};
