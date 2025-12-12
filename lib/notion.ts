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
  
  // Custom fetch to ignore SSL errors (development only or specific network issues)
  const customFetch = (url: string, options: any) => {
    return fetch(url, {
        ...options,
        // @ts-ignore - This is a Node.js specific option for fetch
        dispatcher: new (require('undici').Agent)({
            connect: {
                rejectUnauthorized: false
            }
        })
    });
  };

  // Only use custom fetch if we are in a Node environment (Next.js server side)
  if (typeof window === 'undefined') {
      try {
          // Check if undici is available (built-in in newer Node or Next.js)
          require('undici');
          return new Client({ 
              auth: apiKey,
              fetch: customFetch
          });
      } catch (e) {
          // Fallback to default
          return new Client({ auth: apiKey });
      }
  }

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

    let posts = response.results.map((page: any) => {
      return parseNotionPage(page);
    });

    // Fetch translations if configured
    const translationsDbId = process.env.NOTION_TRANSLATIONS_DATABASE_ID;
    if (translationsDbId) {
      try {
        const transResponse = await notion.databases.query({
          database_id: translationsDbId,
          sorts: [{ property: "Date", direction: "descending" }],
        });
        const transPosts = transResponse.results.map((page: any) => parseNotionPage(page));
        posts = [...posts, ...transPosts];
      } catch (err) {
        console.warn("Failed to fetch translations:", err);
      }
    }

    // Sort combined posts by date
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    let response = await notion.databases.query({
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

    // If not found in main DB, check Translations DB
    if (response.results.length === 0) {
      const translationsDbId = process.env.NOTION_TRANSLATIONS_DATABASE_ID;
      if (translationsDbId) {
         try {
           const transResponse = await notion.databases.query({
             database_id: translationsDbId,
             filter: {
               property: "Slug",
               rich_text: { equals: slug }
             }
           });
           if (transResponse.results.length > 0) {
             response = transResponse;
           }
         } catch (e) {
           console.warn("Failed to query translations DB", e);
         }
      }
    }

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
  
  const rawSlug = props.Slug?.rich_text?.[0]?.plain_text || "untitled";
  // Sanitize slug: remove special chars, spaces to hyphens, lowercase
  const slug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\-]/g, '-') // Allow Chinese chars, numbers, letters, hyphens
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const rawTitle = props.Name?.title?.[0]?.plain_text || "Untitled";
  // Clean up potential AI translation artifacts
  const title = rawTitle
    .replace(/^The translation of ["']?.*?["']? (in \w+ )?is:?\s*/i, '')
    .replace(/^Translation:?\s*/i, '')
    .replace(/^Translated title:?\s*/i, '')
    .replace(/^Here is the translation:?\s*/i, '')
    .replace(/^"|"$/g, '')
    .trim();

  // Extract Language and Original_ID for filtering
  const language = props.Language?.select?.name || 'en'; // Default to 'en' for main DB
  const originalId = props.Original_ID?.rich_text?.[0]?.plain_text || page.id; // For main DB, originalId is its own ID
  const summary = props.Summary?.rich_text?.[0]?.plain_text || "";

  return {
    id: page.id,
    slug: slug || "untitled",
    title: title,
    date: props.Date?.date?.start || new Date().toISOString(),
    tags: props.Tags?.multi_select?.map((tag) => tag.name) || [],
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || "",
    published: props.Published?.checkbox || false,
    language,
    originalId,
    summary
  };
};
