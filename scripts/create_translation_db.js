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
const PARENT_PAGE_ID = '9ccb4ece-e319-4d4e-a17b-d46bd5a7933c'; // From inspect_db.js

async function main() {
  console.log('Creating Translations Database...');
  try {
    const response = await notion.databases.create({
      parent: { page_id: PARENT_PAGE_ID },
      title: [
        {
          type: 'text',
          text: {
            content: 'Translated Articles',
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Slug: {
          rich_text: {},
        },
        Language: {
          select: {
            options: [
              { name: 'en', color: 'blue' },
              { name: 'zh', color: 'red' },
            ],
          },
        },
        Original_ID: {
          rich_text: {}, // Storing ID as text for simplicity, or use relation if we want to be fancy
        },
        Date: {
            date: {}
        },
        Excerpt: {
            rich_text: {}
        },
        Tags: {
            multi_select: {}
        }
      },
    });
    console.log('Success! New Database ID:', response.id);
    
    // Append to .env
    const newEnvLine = `\nNOTION_TRANSLATIONS_DATABASE_ID=${response.id}`;
    fs.appendFileSync(envPath, newEnvLine);
    console.log('Added to .env');
    
  } catch (error) {
    console.error('Error:', JSON.stringify(error.body || error, null, 2));
  }
}

main();
