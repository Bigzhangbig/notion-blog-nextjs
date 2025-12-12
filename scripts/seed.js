const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Simple .env parser
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const notion = new Client({ auth: env.NOTION_API_KEY });

async function main() {
  console.log('Attempting to create a post in Notion...');
  try {
    const response = await notion.pages.create({
      parent: { database_id: env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: 'Hello World from API' } }] },
        Slug: { rich_text: [{ text: { content: 'hello-world-api' } }] },
        Date: { date: { start: new Date().toISOString() } },
        Tags: { multi_select: [{ name: 'Test' }] },
        Published: { checkbox: true },
        Excerpt: { rich_text: [{ text: { content: 'This is a test post created via API.' } }] },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: 'Hello World' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'This content was inserted programmatically to test the blog integration.' } }],
          },
        },
      ],
    });
    console.log('Success! Page ID:', response.id);
  } catch (error) {
    console.error('Error:', error.body || error);
  }
}

main();
