export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  published: boolean;
  content?: string; // Markdown content
  language?: string; // 'en' or 'zh'
  originalId?: string; // ID of the original post if this is a translation
  summary?: string; // AI Summary
}

export interface NotionPage {
  id: string;
  properties: {
    Name: {
      title: Array<{ plain_text: string }>;
    };
    Slug: {
      rich_text: Array<{ plain_text: string }>;
    };
    Date: {
      date: { start: string };
    };
    Tags: {
      multi_select: Array<{ name: string }>;
    };
    Published: {
      checkbox: boolean;
    };
    Excerpt: {
      rich_text: Array<{ plain_text: string }>;
    };
    // For translations
    Language?: {
      select: { name: string };
    };
    Original_ID?: {
      rich_text: Array<{ plain_text: string }>;
    };
    Summary?: {
      rich_text: Array<{ plain_text: string }>;
    };
  };
}
