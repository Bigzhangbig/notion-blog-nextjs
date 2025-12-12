interface Env {
  AI: any;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { text } = await request.json() as { text: string };
    
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Truncate text to avoid token limits (approx 4000 chars)
    const truncatedText = text.slice(0, 4000);

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that summarizes blog posts. Provide a concise summary in the same language as the blog post (likely Chinese or English). Keep it under 200 words." 
        },
        { 
          role: "user", 
          content: `Please summarize the following text:\n\n${truncatedText}` 
        }
      ]
    });

    return new Response(JSON.stringify({ summary: response.response }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate summary" + error }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
