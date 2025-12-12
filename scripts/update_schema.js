const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const notion = new Client({ auth: env.NOTION_API_KEY });

async function main() {
  console.log('Updating Database Schema...');
  try {
    const response = await notion.databases.update({
      database_id: env.NOTION_DATABASE_ID,
      properties: {
        "Slug": { rich_text: {} },
        "Date": { date: {} },
        "Tags": { multi_select: {} },
        "Published": { checkbox: {} },
        "Excerpt": { rich_text: {} }
      }
    });
    console.log('Success! Properties added.');
    console.log('Current Properties:', Object.keys(response.properties));
  } catch (error) {
    console.error('Failed to update schema:', error.body || error);
  }
}

main();
