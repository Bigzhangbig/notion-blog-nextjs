import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

interface Env {
  AI: any;
  NOTION_API_KEY: string;
  NOTION_TRANSLATIONS_DATABASE_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId, targetLang, title } = await request.json() as { articleId: string, targetLang: string, title: string };
    
    if (!articleId || !targetLang) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }

    if (!env.NOTION_API_KEY || !env.NOTION_TRANSLATIONS_DATABASE_ID) {
         return new Response(JSON.stringify({ error: "Server misconfigured (missing env vars)" }), { status: 500, headers: corsHeaders });
    }

    const notion = new Client({ auth: env.NOTION_API_KEY });

    // 0. Cache Check: Check if translation already exists
    try {
      const existing = await notion.databases.query({
        database_id: env.NOTION_TRANSLATIONS_DATABASE_ID,
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
        return new Response(JSON.stringify({ 
          success: true, 
          pageId: existing.results[0].id, 
          cached: true,
          message: "Translation already exists." 
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    } catch (e) {
      console.warn("Failed to check cache:", e);
      // Continue to translate if cache check fails
    }

    const n2m = new NotionToMarkdown({ notionClient: notion });
    
    // 1. Fetch content
    const mdblocks = await n2m.pageToMarkdown(articleId);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    if (!mdString.parent) {
         return new Response(JSON.stringify({ error: "No content found to translate" }), { status: 400, headers: corsHeaders });
    }

    // 2. Language Detection & Translation
    // Llama-3-8b context window is limited. We should probably truncate or warn.
    const contentToTranslate = mdString.parent.slice(0, 6000);
    
    const contentPrompt = `Translate the following Markdown content to ${targetLang === 'zh' ? 'Chinese' : 'English'}. 
    Rules:
    1. Maintain professional quality.
    2. Keep the markdown formatting exactly as is (headers, lists, links).
    3. Do not add any conversational text or explanations. Just the translation.
    
    Content:
    ${contentToTranslate}`;
    
    const contentResponse = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
      messages: [
        { role: "system", content: "You are a professional translator. Translate the markdown content accurately while preserving formatting." },
        { role: "user", content: contentPrompt }
      ]
    });
    
    const translatedContent = contentResponse.response;

    // 3. Translate Title
    const titleResponse = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
      messages: [
        { role: "system", content: "You are a professional translator. Translate the title provided by the user. Output ONLY the translated text. Do not output anything else. Do not use quotation marks." },
        { role: "user", content: `Translate the following title to ${targetLang === 'zh' ? 'Chinese' : 'English'}: "${title}"` }
      ]
    });
    const translatedTitle = titleResponse.response
      .replace(/^The translation of ["']?.*?["']? (in \w+ )?is:?\s*/i, '')
      .replace(/^Translation:?\s*/i, '')
      .replace(/^"|"$/g, '')
      .trim();

    // 4. Save to Notion
    const blocks = translatedContent.split('\n\n').filter((p: string) => p.trim()).map((p: string) => ({
        object: 'block' as const,
        type: 'paragraph' as const,
        paragraph: {
            rich_text: [{ text: { content: p.substring(0, 2000) } }]
        }
    }));

    const newPage = await notion.pages.create({
      parent: { database_id: env.NOTION_TRANSLATIONS_DATABASE_ID },
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

    return new Response(JSON.stringify({ success: true, pageId: newPage.id }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Translation failed: " + error }), { status: 500, headers: corsHeaders });
  }
}
