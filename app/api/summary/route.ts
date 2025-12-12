import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: corsHeaders });
  }

  try {
    const { articleId, content, length, lang } = await req.json() as { articleId: string, content: string, length: string, lang: string };

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400, headers: corsHeaders });
    }

    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    
    // Check Notion for existing summary if articleId is provided
    if (articleId && NOTION_API_KEY) {
       const notion = new Client({ auth: NOTION_API_KEY });
       try {
           const page = await notion.pages.retrieve({ page_id: articleId });
           // @ts-ignore
           const existingSummary = page.properties?.Summary?.rich_text?.[0]?.plain_text;
           
           // If we have an existing summary, and the user didn't request a specific custom length (default is usually medium), 
           // we could return it. But "length" parameter varies.
           // To save tokens, we should prioritize the existing summary if the length matches or if we just want *any* summary.
           // Let's assume if it exists, we return it, unless forced.
           if (existingSummary && existingSummary.length > 10) {
               return NextResponse.json({ summary: existingSummary, cached: true }, { headers: corsHeaders });
           }
       } catch (e) {
           console.warn("Failed to check existing summary:", e);
       }
    }

    let summary = "";

    // AI Logic with Qwen model
    if (process.env.NODE_ENV === 'development') {
         // Mock
         summary = `[MOCK SUMMARY by Qwen] This is a ${length} summary of the content in ${lang}. The content discusses... (Simulated)`;
    } else {
        try {
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
                
                // Truncate content
                const truncatedContent = content.slice(0, 6000);
                const prompt = `Summarize the following content in ${lang === 'zh' ? 'Chinese' : 'English'}. Keep it ${length.toLowerCase()}. Content: ${truncatedContent}`;
                
                const response = await runAI('@cf/qwen/qwen3-30b-a3b-fp8', {
                    messages: [
                        { role: "system", content: "You are a helpful assistant that summarizes articles." },
                        { role: "user", content: prompt }
                    ]
                });
                
                summary = response.response;
            } else {
                return NextResponse.json({ error: "AI not configured" }, { status: 500, headers: corsHeaders });
            }
        } catch (e) {
            return NextResponse.json({ error: "AI Error: " + e }, { status: 500, headers: corsHeaders });
        }
    }

    // Save back to Notion
    if (articleId && NOTION_API_KEY && summary) {
        try {
            const notion = new Client({ auth: NOTION_API_KEY });
            await notion.pages.update({
                page_id: articleId,
                properties: {
                    Summary: {
                        rich_text: [{ text: { content: summary.substring(0, 2000) } }]
                    }
                }
            });
        } catch (e) {
            console.error("Failed to save summary to Notion:", e);
            // Don't fail the request, just log
        }
    }

    return NextResponse.json({ summary }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ error: "Summary failed: " + error }, { status: 500, headers: corsHeaders });
  }
}
