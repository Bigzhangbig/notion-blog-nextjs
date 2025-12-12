# Multi-Language Support Implementation

I have implemented the multi-language feature using Cloudflare Workers AI and Notion.

## 1. Notion Database Setup
- Created a new "Translated Articles" database in your Notion workspace.
- **ID**: `2c7148e0-41ac-81b8-af3a-c7cfa2f2b4c1`
- **Schema**: Name, Slug, Language (en/zh), Original_ID, Date, Excerpt.

## 2. Backend (Cloudflare Workers AI)
- Created `functions/api/translate.ts`:
  - Accepts article ID and target language.
  - Fetches original content from Notion.
  - Uses `@cf/meta/llama-3-8b-instruct` to translate Title and Markdown content.
  - Saves the translated article to the new Notion database.

## 3. Frontend (Next.js)
- **Translate Button**: Added an admin tool section at the bottom of each blog post.
  - Allows translating to English or Chinese with one click.
- **Data Fetching**: Updated `lib/notion.ts` to seamlessly fetch posts from *both* the main database and the translations database.
  - Translated posts will appear in the main feed and be accessible via their own slugs (e.g., `original-title-zh`).

## 4. Configuration
- Updated `wrangler.toml` with `NOTION_TRANSLATIONS_DATABASE_ID`.
- Created `.dev.vars` for local development.

## How to Verify
1. Run `npx wrangler pages dev .vercel/output/static` (after building) or use `npm run dev` (note: `npm run dev` won't trigger the API, you need `wrangler pages dev` to test the translation function).
2. Go to a blog post.
3. Click "Translate to Chinese" (or English).
4. Wait for success message.
5. Rebuild the site (since it's static) to see the new post.

Note: For production, ensure `NOTION_API_KEY` is set in your Cloudflare Pages project settings.
