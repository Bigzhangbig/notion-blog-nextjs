interface Env {
  AI: any;
}

interface SummaryRequest {
  text: string;
  length?: 'short' | 'medium' | 'long';
  style?: 'concise' | 'detailed' | 'casual' | 'professional';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const { text, length = 'medium', style = 'concise' } = await request.json() as SummaryRequest;
    
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Truncate text to avoid token limits (approx 4000 chars)
    const truncatedText = text.slice(0, 4000);

    let systemPrompt = "You are a helpful assistant that summarizes blog posts. Provide the summary in the same language as the blog post (likely Chinese or English).";

    // Adjust prompt based on length
    if (length === 'short') systemPrompt += " Keep it very short, under 50 words.";
    else if (length === 'medium') systemPrompt += " Keep it around 150 words.";
    else if (length === 'long') systemPrompt += " Provide a comprehensive summary, up to 300 words.";

    // Adjust prompt based on style
    if (style === 'concise') systemPrompt += " Be direct and to the point.";
    else if (style === 'detailed') systemPrompt += " Include key details and examples.";
    else if (style === 'casual') systemPrompt += " Use a friendly, conversational tone.";
    else if (style === 'professional') systemPrompt += " Use formal, professional language.";

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { 
          role: "system", 
          content: systemPrompt
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
