import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getPageContent } from "@/lib/notion";
import { backupPostToGithub } from "@/lib/github";

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET(request: NextRequest) {
  // Simple authorization check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.BACKUP_SECRET_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getPublishedPosts();
    const results = [];

    for (const post of posts) {
      // Fetch full content including markdown
      const content = await getPageContent(post.id);
      const fullPost = { ...post, content };
      
      await backupPostToGithub(fullPost);
      results.push({ slug: post.slug, status: "backed_up" });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Backup failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
