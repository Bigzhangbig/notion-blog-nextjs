# Notion Blog with Cloudflare Workers & Next.js

A complete personal blog system powered by Notion as a CMS, Next.js for the frontend, and Cloudflare Workers (Pages) for global deployment. Features automatic Markdown backups to GitHub and Giscus comments.

## 🏗 Architecture

- **CMS**: Notion (Official API)
- **Frontend**: Next.js 16 (App Router)
- **Deployment**: Cloudflare Pages (via `@cloudflare/next-on-pages` adapter)
- **Comments**: GitHub Discussions (via Giscus)
- **Backup**: Automated Markdown backup to private GitHub repo via Cron Trigger

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Notion Account
- A Cloudflare Account
- A GitHub Account

### 2. Notion Setup
1. Create a new Integration at [Notion Developers](https://www.notion.so/my-integrations).
2. Get the **Internal Integration Token** (`NOTION_API_KEY`).
3. Create a new Database in Notion with the following properties:
   - `Name` (Title)
   - `Slug` (Text) - *Unique URL identifier*
   - `Date` (Date)
   - `Tags` (Multi-select)
   - `Published` (Checkbox)
   - `Excerpt` (Text)
4. Share the database with your integration (Three dots > Connect to > Select your integration).
5. Get the **Database ID** from the URL.

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

> **Note**: For Chinese documentation, please refer to [README_zh.md](README_zh.md).

### 4. Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 🔄 Automated Backup Setup

The system includes an API endpoint (`/api/backup`) that fetches all published posts and commits them as Markdown files to a GitHub repository.

1. **GitHub Setup**:
   - Create a private repository for backups.
   - Generate a Personal Access Token (Classic) with `repo` scope.
   - Set `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` in environment variables.

2. **Scheduling**:
   - Deploy the project to Cloudflare Pages.
   - In Cloudflare Dashboard, set up a **Cron Trigger** (or use a separate Worker) to make a GET request to `https://your-blog.pages.dev/api/backup` with the header `Authorization: Bearer <YOUR_BACKUP_SECRET_TOKEN>`.
   - *Alternative*: Use GitHub Actions to curl this endpoint daily.

## 💬 Comments Setup (Giscus)

1. Enable **Discussions** in your public GitHub repository.
2. Install the [Giscus App](https://github.com/apps/giscus).
3. Visit [giscus.app](https://giscus.app) to generate your configuration.
4. Update `components/GiscusComments.tsx` with your `repo`, `repoId`, and `categoryId`.

## 📦 Deployment
### Option A: Cloudflare Pages (Recommended)
1. Push this code to a GitHub repository.
2. Log in to Cloudflare Dashboard > Pages > Connect to Git.
3. Select your repository.
4. **Build Settings**:
   - Framework Preset: **Next.js**
   - Build Command: `npx @cloudflare/next-on-pages@1`
   - Output Directory: `.vercel/output/static`
   - Compatibility Flags: `nodejs_compat`
5. **Environment Variables**: Add all variables from `.env` to the Pages project settings.

### Option B: Vercel
1. Push to GitHub.
2. Import project in Vercel Dashboard.
3. Vercel automatically detects Next.js.
4. Add environment variables.
5. Deploy.

### Option C: Deno Deploy
1. Push to GitHub.
2. Link repository in Deno Deploy Dashboard.
3. Deno automatically detects Next.js.
4. Configure environment variables.

## 🧪 Testing

- **Notion Sync**: Add a post in Notion, refresh the local dev server.
- **Backup**: Send a GET request to `/api/backup` with the secret token.
  ```bash
  curl -H "Authorization: Bearer secret" http://localhost:3000/api/backup
  ```

## 🛠 Tech Stack Details
- **Next.js 16**: Using App Router and Server Components for optimal performance.
- **Tailwind CSS**: For styling.
- **notion-to-md**: Converts Notion blocks to Markdown for portable backups.
- **react-markdown**: Renders Markdown safely.
