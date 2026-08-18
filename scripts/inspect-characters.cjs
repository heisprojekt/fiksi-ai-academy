const fs = require('fs');

const content = fs.readFileSync('./src/data/notionPrompts.ts', 'utf-8');
const match = content.match(/export const NOTION_PROMPTS: PromptPack\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.log('Regex match failed');
  process.exit(1);
}

const prompts = JSON.parse(match[1]);
const karakterPrompts = prompts.filter(p => p.category === 'Karakter AI' || (p.title && p.title.toUpperCase().includes('KARAKTER')));

console.log(`Found ${karakterPrompts.length} Karakter prompts:`);
karakterPrompts.forEach((p, idx) => {
  console.log(`${idx + 1}. ID: ${p.id} | Title: ${p.title} | SubCategory: ${p.subCategory} | Model: ${p.aiModel}`);
  console.log(`   Prompt preview: ${p.promptText.substring(0, 100)}...`);
  console.log(`   Current Thumbnail: ${p.thumbnail}`);
});
