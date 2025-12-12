import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { getPublishedPosts, getPageContent } from '@/lib/notion';
import { BlogPost } from '@/lib/types';
import matter from 'gray-matter';

// Use Node.js runtime for this route as it involves heavier processing and Octokit
export const runtime = 'nodejs'; 

export async function GET(req: NextRequest) {
  // 1. Auth Check
  const authHeader = req.headers.get('Authorization');
  const backupToken = process.env.BACKUP_SECRET_TOKEN;

  if (!backupToken || authHeader !== `Bearer ${backupToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json({ error: 'GitHub configuration missing' }, { status: 500 });
  }

  try {
    // 2. Fetch Data
    const posts = await getPublishedPosts();
    
    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts to backup' });
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // 3. Prepare Files (Fetch Content + Frontmatter)
    const filePromises = posts.map(async (post) => {
      const content = await getPageContent(post.id);
      
      // Create Frontmatter
      const frontmatter = {
        title: post.title,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        published: post.published,
        slug: post.slug,
        id: post.id,
        ...(post.language ? { language: post.language } : {}),
        ...(post.originalId ? { originalId: post.originalId } : {}),
        ...(post.summary ? { summary: post.summary } : {}),
      };

      // Combine frontmatter and content using gray-matter
      const fileContent = matter.stringify(content || '', frontmatter);
      
      // Path: posts/YYYY-MM-DD-slug.md or just posts/slug.md
      // Using slug is cleaner, but duplicate slugs (in diff languages) might conflict if not careful.
      // Our slugs usually have -zh suffix for translations, so it should be fine.
      const path = `posts/${post.slug}.md`;

      return {
        path,
        mode: '100644' as const,
        type: 'blob' as const,
        content: fileContent,
      };
    });

    const files = await Promise.all(filePromises);

    // 4. Git Data API: Create Commit
    // Get latest commit on main
    const { data: refData } = await octokit.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
    });
    const latestCommitSha = refData.object.sha;

    // Create Tree
    const { data: treeData } = await octokit.git.createTree({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      base_tree: latestCommitSha,
      tree: files,
    });
    const newTreeSha = treeData.sha;

    // Create Commit
    const { data: commitData } = await octokit.git.createCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      message: `Backup: Sync ${files.length} posts from Notion`,
      tree: newTreeSha,
      parents: [latestCommitSha],
    });
    const newCommitSha = commitData.sha;

    // Update Ref
    await octokit.git.updateRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
      sha: newCommitSha,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Backed up ${files.length} posts to ${GITHUB_OWNER}/${GITHUB_REPO}`,
      commit: newCommitSha 
    });

  } catch (error: any) {
    console.error('Backup failed:', error);
    return NextResponse.json({ error: 'Backup failed: ' + error.message }, { status: 500 });
  }
}
