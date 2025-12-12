import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost, NotionPage } from "./types";

// Mock data for development when env vars are missing
const MOCK_POSTS: BlogPost[] = [
  {
    id: "mock-id-1",
    slug: "welcome-to-notion-blog",
    title: "Welcome to Your Notion Blog (Mock Mode)",
    date: new Date().toISOString(),
    tags: ["Guide", "Mock"],
    excerpt: "This is a mock post because NOTION_DATABASE_ID is not set. Configure your .env file to see real data.",
    published: true,
    content: `
# Welcome to Notion Blog

If you are seeing this, it means your **Notion API configuration is missing**.

## How to fix this?

1. Create a \`.env\` file in the root directory.
2. Add your \`NOTION_API_KEY\` and \`NOTION_DATABASE_ID\`.
3. Restart the server.

Check the \`README.md\` for detailed instructions.
    `,
  },
];

const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return null;
  return new Client({ auth: apiKey });
};

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  // Check for missing or placeholder values
  if (!databaseId || !apiKey || apiKey.includes("secret_xxxxxxxx") || databaseId.includes("xxxxxxxx")) {
    console.warn("⚠️ Notion configuration missing or invalid. Returning mock data.");
    return MOCK_POSTS;
  }

  const notion = getNotionClient();
  if (!notion) return MOCK_POSTS;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const posts = response.results.map((page: any) => {
      return parseNotionPage(page);
    });

    return posts;
  } catch (error: any) {
    console.error("Failed to fetch posts from Notion:", error);

    // Handle missing columns gracefully
    if (error.code === 'validation_error' || error.status === 400) {
       return [{
        id: 'setup-required',
        slug: 'setup-required',
        title: 'Action Required: Configure Notion Database',
        date: new Date().toISOString(),
        tags: ['System'],
        published: true,
        excerpt: 'Your database is connected but missing required columns.',
        content: `
# Database Schema Mismatch

Great job connecting your Notion database! However, the blog cannot fetch articles because some required columns are missing.

## Required Columns

Please go to your Notion Database and add the following properties (case-sensitive):

- **Slug** (Text)
- **Date** (Date)
- **Tags** (Multi-select)
- **Published** (Checkbox)
- **Excerpt** (Text)

Once added, refresh this page.
        `,
      }];
    }

    return MOCK_POSTS;
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  if (!databaseId || !apiKey || apiKey.includes("secret_xxxxxxxx") || databaseId.includes("xxxxxxxx")) {
    const mockPost = MOCK_POSTS.find((p) => p.slug === slug);
    return mockPost || null;
  }

  const notion = getNotionClient();
  if (!notion) {
    const mockPost = MOCK_POSTS.find((p) => p.slug === slug);
    return mockPost || null;
  }

  const n2m = new NotionToMarkdown({ notionClient: notion });

  try {
    // If querying specific slug, we assume columns exist. 
    // If not, it will fail and return null/mock.
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      // If it's the setup post, return it manually
      if (slug === 'setup-required') {
        const posts = await getPublishedPosts();
        return posts.find(p => p.slug === 'setup-required') || null;
      }
      return null;
    }

    const page = response.results[0];
    const post = parseNotionPage(page);
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    
    return {
      ...post,
      content: mdString.parent,
    };
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error);
    // Fallback for setup post
    if (slug === 'setup-required') {
       const posts = await getPublishedPosts();
       return posts.find(p => p.slug === 'setup-required') || null;
    }
    return null;
  }
};

// Helper to get content for backup purposes (by ID)
export const getPageContent = async (pageId: string): Promise<string> => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  if (!databaseId || !apiKey || apiKey.includes("secret_xxxxxxxx") || databaseId.includes("xxxxxxxx")) {
    return MOCK_POSTS[0].content || "";
  }
  
  const notion = getNotionClient();
  if (!notion) return "";
  const n2m = new NotionToMarkdown({ notionClient: notion });

  try {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent;
  } catch (error) {
    console.error(`Failed to fetch content for page ${pageId}:`, error);
    return "";
  }
};

const parseNotionPage = (page: any): BlogPost => {
  const props = page.properties as NotionPage["properties"];
  
  // Safe access to properties that might be missing
  return {
    id: page.id,
    slug: props.Slug?.rich_text?.[0]?.plain_text || "untitled",
    title: props.Name?.title?.[0]?.plain_text || "Untitled",
    date: props.Date?.date?.start || new Date().toISOString(),
    tags: props.Tags?.multi_select?.map((tag) => tag.name) || [],
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
    published: props.Published?.checkbox || false,
  };
};
