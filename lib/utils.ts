export function calculateReadingStats(text: string) {
  // Remove Markdown formatting roughly
  const cleanText = text
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images
    .replace(/>\s/g, '') // Blockquotes
    .trim();

  // Count words for English and characters for CJK
  const words = cleanText.match(/[\u00ff-\uffff]|\S+/g)?.length || 0;
  
  // Estimate reading time: 
  // English: ~200 words/min
  // Chinese: ~300 chars/min
  // We use a blended average of 250 for simplicity given the mixed regex
  const readingTime = Math.ceil(words / 250);

  return {
    wordCount: words,
    readingTime: readingTime < 1 ? 1 : readingTime
  };
}
