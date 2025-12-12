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

console.log('API Key length:', env.NOTION_API_KEY ? env.NOTION_API_KEY.length : 0);
console.log('DB ID:', env.NOTION_DATABASE_ID);

const notion = new Client({ auth: env.NOTION_API_KEY });

async function main() {
  try {
    const db = await notion.databases.retrieve({ database_id: env.NOTION_DATABASE_ID });
    console.log('Full DB Object:', JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error:', JSON.stringify(error, null, 2));
  }
}

main();
