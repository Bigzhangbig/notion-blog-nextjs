# Notion 博客系统

一个基于 Notion CMS、Next.js 前端和 Cloudflare Workers (Pages) 全球部署的完整个人博客系统。支持 GitHub 自动 Markdown 备份和 Giscus 评论系统。

## 🏗 架构设计

- **CMS (内容管理)**: Notion (使用官方 API)
- **前端框架**: Next.js 16 (App Router)
- **部署平台**: 
  - Cloudflare Pages (推荐，已配置适配器)
  - Vercel (原生支持)
  - Deno Deploy (支持 Next.js)
- **评论系统**: GitHub Discussions (通过 Giscus 集成)
- **备份机制**: 自动将文章以 Markdown 格式备份到私有 GitHub 仓库

## 🚀 快速开始

### 1. 准备工作
- Node.js 18+ 环境
- 一个 Notion 账号
- 一个 GitHub 账号
- (可选) Cloudflare 账号 / Vercel 账号 / Deno 账号

### 2. Notion 配置
1. 访问 [Notion Developers](https://www.notion.so/my-integrations) 创建一个新的 Integration。
2. 获取 **Internal Integration Token** (即 `NOTION_API_KEY`)。
3. 在 Notion 中创建一个新数据库 (Database)，包含以下字段：
   - `Name` (标题)
   - `Slug` (文本) - *用于 URL 的唯一标识符*
   - `Date` (日期)
   - `Tags` (多选)
   - `Published` (复选框)
   - `Excerpt` (文本)
4. 点击数据库右上角的三点菜单 > Connect to > 选择刚才创建的 Integration。
5. 从浏览器地址栏获取 **Database ID**。

### 3. 环境配置
将项目根目录下的 `.env.example` 文件复制为 `.env`，并填入相关配置：

```bash
cp .env.example .env
```

**注意**: `.env` 文件包含敏感信息，默认已被 git 忽略，请勿提交到代码仓库。

### 4. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看效果。

## 🌐 部署指南

### 方案 A: 部署到 Cloudflare Pages (推荐)

本项目已针对 Cloudflare Pages 进行了配置（使用 `@cloudflare/next-on-pages`）。

1. 将代码推送到 GitHub 仓库。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages > Connect to Git。
3. 选择你的仓库。
4. **构建设置 (Build Settings)**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npx @cloudflare/next-on-pages@1`
   - **Output Directory**: `.vercel/output/static`
   - **Compatibility Flags**: `nodejs_compat`
5. **环境变量**: 在 Pages 项目设置中添加 `.env` 中的所有变量。

### 方案 B: 部署到 Vercel

Vercel 是 Next.js 的开发商，提供最原生的支持。

1. 将代码推送到 GitHub 仓库。
2. 登录 [Vercel Dashboard](https://vercel.com/new)。
3. 导入你的 GitHub 仓库。
4. Vercel 会自动识别 Next.js 框架，无需修改构建命令。
5. 在 **Environment Variables** 中添加 `.env` 中的所有变量。
6. 点击 **Deploy**。

### 方案 C: 部署到 Deno Deploy

Deno Deploy 现已支持运行 Next.js 应用。

1. 将代码推送到 GitHub 仓库。
2. 登录 [Deno Deploy Dashboard](https://dash.deno.com/new)。
3. 选择你的 GitHub 仓库。
4. Deno 会自动检测 Next.js 框架。
5. 在设置中配置环境变量。
6. 点击 **Link** 进行部署。

*注意: Deno Deploy 对 Next.js 的支持仍在持续优化中，部分高级特性可能存在差异。*

## 🔄 自动化备份配置

系统包含一个 API 端点 (`/api/backup`)，用于触发全量备份。

1. **GitHub 设置**:
   - 创建一个用于存储备份的私有仓库。
   - 生成一个 Personal Access Token (Classic)，勾选 `repo` 权限。
   - 在 `.env` 中配置 `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`。

2. **设置定时任务 (Cloudflare Cron Triggers)**:
   - 部署到 Cloudflare Pages 后，可以在 Worker 设置中添加 Cron Trigger。
   - 或者，使用 GitHub Actions 定时访问备份接口：
     `GET https://your-blog.pages.dev/api/backup`
   - 请求头需包含: `Authorization: Bearer <YOUR_BACKUP_SECRET_TOKEN>`

## 💬 评论系统配置 (Giscus)

1. 在你的公开 GitHub 仓库中启用 **Discussions** 功能。
2. 安装 [Giscus App](https://github.com/apps/giscus)。
3. 访问 [giscus.app](https://giscus.app) 生成配置。
4. 修改 `components/GiscusComments.tsx` 文件，填入你的 `repo`, `repoId`, 和 `categoryId`。

## 🛠 技术栈

- **Next.js 16**: App Router, Server Components
- **Tailwind CSS**: 样式框架
- **Notion Client**: 数据获取
- **notion-to-md**: Notion 区块转 Markdown
- **Cloudflare Workers**: 边缘计算部署
