const fs = require('fs');

const content = fs.readFileSync('./src/data/notionPrompts.ts', 'utf-8');
const match = content.match(/export const NOTION_PROMPTS: PromptPack\[\] = (\[[\s\S]*?\]);\s*$/);
const prompts = JSON.parse(match[1]);

const karakterPrompts = prompts.filter(p => p.category === 'Karakter AI' || (p.title && p.title.toUpperCase().includes('KARAKTER')));

console.log('Total characters:', karakterPrompts.length);
karakterPrompts.forEach(p => {
  const numMatch = p.title.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0]) : null;
  console.log(`Title: ${p.title} (Num: ${num}) | ID: ${p.id} | Sub: ${p.subCategory}`);
  console.log(`  Prompt: ${p.promptText.substring(0, 120)}...`);
});
