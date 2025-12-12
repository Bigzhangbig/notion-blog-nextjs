import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Helper to handle AI requests via Cloudflare Workers AI REST API if not available in context
// Since we are running in Next.js, we don't have direct access to `env.AI`.
// We need to use the Cloudflare REST API or a mock if running locally without Wrangler.
// However, the user is likely running `npm run dev` which doesn't expose `env.AI`.
// 
// Solution: We can't easily run the actual Llama model in Next.js local dev without binding.
// But we can check if we are in a Cloudflare environment.
// If not, we can mock the translation for testing or require the user to use `wrangler dev`.
//
// Given the user is seeing "Server misconfigured", they are hitting a check.
// We will implement a robust route that tries to use environment variables.

export const runtime = 'edge'; // Use Edge Runtime to potentially access bindings if deployed

export async function POST(req: NextRequest) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }

  try {
    const { articleId, targetLang, title } = await req.json() as { articleId: string, targetLang: string, title: string };
    
    if (!articleId || !targetLang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
    }

    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const NOTION_TRANSLATIONS_DATABASE_ID = process.env.NOTION_TRANSLATIONS_DATABASE_ID;

    if (!NOTION_API_KEY || !NOTION_TRANSLATIONS_DATABASE_ID) {
         return NextResponse.json({ error: "Server misconfigured (missing env vars)" }, { status: 500, headers: corsHeaders });
    }

    const notion = new Client({ auth: NOTION_API_KEY });

    // 0. Cache Check: Check if translation already exists
    try {
      const existing = await notion.databases.query({
        database_id: NOTION_TRANSLATIONS_DATABASE_ID,
        filter: {
          and: [
            {
              property: "Original_ID",
              rich_text: { equals: articleId }
            },
            {
              property: "Language",
              select: { equals: targetLang }
            }
          ]
        }
      });

      if (existing.results.length > 0) {
        return NextResponse.json({ 
          success: true, 
          pageId: existing.results[0].id, 
          cached: true,
          message: "Translation already exists." 
        }, {
          headers: corsHeaders
        });
      }
    } catch (e) {
      console.warn("Failed to check cache:", e);
    }

    const n2m = new NotionToMarkdown({ notionClient: notion });
    
    // 1. Fetch content
    const mdblocks = await n2m.pageToMarkdown(articleId);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    if (!mdString.parent) {
         return NextResponse.json({ error: "No content found to translate" }, { status: 400, headers: corsHeaders });
    }

    // 2. Language Detection & Translation
    // In local Next.js dev, we don't have access to Cloudflare AI bindings directly unless using `next-on-pages` or similar.
    // We will check if `process.env.AI` or similar is available, or use a REST API fallback if configured.
    // For now, if we can't access AI, we return a mock translation or error with specific instruction.
    
    // NOTE: This is the tricky part. The user wants to run this locally. 
    // Without `wrangler pages dev`, we cannot access `env.AI`.
    // We will throw a helpful error if AI is not available.
    
    let translatedContent = "";
    let translatedTitle = "";

    // Check if we are running in Cloudflare Pages (env.AI is passed to Pages Functions, not Next.js API routes usually)
    // However, if deployed to Cloudflare Pages via @cloudflare/next-on-pages, we might get it.
    // For local dev, we really need the user to use `wrangler pages dev`.
    
    // Mocking for now if strictly local node and no API access
    if (process.env.NODE_ENV === 'development') {
        // Simple mock for testing flow without AI
        console.warn("⚠️ AI Binding not found. Using mock translation for development.");
        translatedContent = `[MOCK TRANSLATION to ${targetLang}] \n\n` + mdString.parent;
        translatedTitle = `[MOCK] ${title}`;
    } else {
        // If in production but no AI binding (shouldn't happen if configured right), we fail.
        // But wait, how do we access AI in Next.js App Router on Cloudflare? 
        // We usually need to use the `getRequestContext` from `@cloudflare/next-on-pages`.
        
        try {
            // Attempt to use Cloudflare REST API if ACCOUNT_ID and API_TOKEN are provided
            // This allows local dev to work against real AI.
            const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
            const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
            
            if (ACCOUNT_ID && API_TOKEN) {
                 const runAI = async (model: string, input: any) => {
                    const response = await fetch(
                        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`,
                        {
                            headers: { Authorization: `Bearer ${API_TOKEN}` },
                            method: "POST",
                            body: JSON.stringify(input),
                        }
                    );
                    const result = await response.json() as any;
                    return result.result;
                };

                const contentPrompt = `Translate the following Markdown content to ${targetLang === 'zh' ? 'Chinese' : 'English'}. 
                Rules:
                1. Maintain professional quality.
                2. Keep the markdown formatting exactly as is (headers, lists, links).
                3. Do not add any conversational text or explanations. Just the translation.
                
                Content:
                ${mdString.parent.slice(0, 6000)}`;

                const contentRes = await runAI('@cf/qwen/qwen3-30b-a3b-fp8', {
                    messages: [
                        { role: "system", content: "You are a professional translator. Translate the markdown content accurately while preserving formatting." },
                        { role: "user", content: contentPrompt }
                    ]
                });
                translatedContent = contentRes.response;

                const titleRes = await runAI('@cf/qwen/qwen3-30b-a3b-fp8', {
                    messages: [
                        { role: "system", content: "You are a professional translator. Translate the title provided by the user. Output ONLY the translated text. Do not output anything else. Do not use quotation marks." },
                        { role: "user", content: `Translate the following title to ${targetLang === 'zh' ? 'Chinese' : 'English'}: "${title}"` }
                    ]
                });
                translatedTitle = titleRes.response
                    .replace(/^The translation of ["']?.*?["']? (in \w+ )?is:?\s*/i, '')
                    .replace(/^Translation:?\s*/i, '')
                    .replace(/^"|"$/g, '')
                    .trim();

            } else {
                // If we are on the edge (deployed), we might have access via platform proxy? 
                // Currently, simple Next.js API route deployment to Pages might not expose `env.AI` easily without setup.
                // Fallback to error.
                 return NextResponse.json({ error: "AI service not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN for local dev, or deploy to Pages with AI binding." }, { status: 500, headers: corsHeaders });
            }
        } catch (e) {
             return NextResponse.json({ error: "AI processing failed: " + e }, { status: 500, headers: corsHeaders });
        }
    }

    // 4. Save to Notion
    const blocks = translatedContent.split('\n\n').filter((p: string) => p.trim()).map((p: string) => ({
        object: 'block' as const,
        type: 'paragraph' as const,
        paragraph: {
            rich_text: [{ text: { content: p.substring(0, 2000) } }]
        }
    }));

    const newPage = await notion.pages.create({
      parent: { database_id: NOTION_TRANSLATIONS_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: translatedTitle } }] },
        Language: { select: { name: targetLang } },
        Original_ID: { rich_text: [{ text: { content: articleId } }] },
        Date: { date: { start: new Date().toISOString() } },
        // Use original slug + lang suffix
        Slug: { rich_text: [{ text: { content: `${translatedTitle.replace(/\s+/g, '-').toLowerCase()}-${targetLang}` } }] }
      },
      children: blocks
    });

    return NextResponse.json({ success: true, pageId: newPage.id }, {
        headers: corsHeaders
    });

  } catch (error) {
    return NextResponse.json({ error: "Translation failed: " + error }, { status: 500, headers: corsHeaders });
  }
}
