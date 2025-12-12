export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  published: boolean;
  content?: string; // Markdown content
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
  };
}
