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
  try {
    console.log('Attempting raw query...');
    const response = await notion.request({
      path: `databases/${env.NOTION_DATABASE_ID}/query`,
      method: 'POST',
    });
    console.log(`Query successful via raw request. Found ${response.results.length} posts.`);
    response.results.forEach(page => {
        const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';
        console.log(`- [${page.id}] ${title}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
