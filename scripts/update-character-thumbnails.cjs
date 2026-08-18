const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const dns = require('dns');
require('dotenv').config();

if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}
}

const DEFAULT_DATABASE_URL = "mongodb+srv://heisprojekt_db_user:nirvana1998@fiksiai.yvlj7w3.mongodb.net/fiksi_ai_academy?retryWrites=true&w=majority&appName=fiksiai";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

const prisma = new PrismaClient();

// Google Drive File ID Mapping
const DRIVE_THUMBNAILS = {
  1: 'https://lh3.googleusercontent.com/d/1PZdRwGNzmXkpxvtrO6Bj2Jl54jXZ5Tl0',
  2: 'https://lh3.googleusercontent.com/d/1maHjvvHfhawOuxqot_OuNgUZNLFw3og7',
  3: 'https://lh3.googleusercontent.com/d/1RKPc0IrJt7-f-tzR_QPrpekGgvpJQf5B',
  4: 'https://lh3.googleusercontent.com/d/1rISZzzp6MGyRXuZTZX7k1uaBaOwvcUkM',
  5: 'https://lh3.googleusercontent.com/d/10snbAFPK3KH-e3EvNd7ZgSxRt0Tr8t6x',
  6: 'https://lh3.googleusercontent.com/d/116OU3dYdQEjujMaphs9RIf3UySKErP6c',
  7: 'https://lh3.googleusercontent.com/d/1Jer-S8xcWKhUr1mkUog5mNYrjSUXkSwz',
  8: 'https://lh3.googleusercontent.com/d/14yRAcYbVaPgzBUtadI8o03qWotBnDlH3',
  9: 'https://lh3.googleusercontent.com/d/1cvNTPEhd0nYpsj24Bk9OVSkoHZa4mxj-',
  10: 'https://lh3.googleusercontent.com/d/1P7GEn6gPYsWGrKogyjvrnqrdC-lH-9LE',
  11: 'https://lh3.googleusercontent.com/d/1BjlAgNkF37j5YdxZB6VgYw6VqOW1z3Ns',
  12: 'https://lh3.googleusercontent.com/d/1ngrqJ7X3CCsy6j5cgxFaeIIPetLk0-g_',
  13: 'https://lh3.googleusercontent.com/d/1S6rkkAezwh3Stf4hlEs3ECpBFcXR0pKx',
  14: 'https://lh3.googleusercontent.com/d/1NCnrtGOGlxJQgdn3v8QS4Y58qZJD-dz0',
  15: 'https://lh3.googleusercontent.com/d/1WZLwnEKhla0QuV-dd4dXvBlFeHlvcZ0G',
  16: 'https://lh3.googleusercontent.com/d/1Mnhqv8MvuWr6spb_TiyQxawqf23tr5lG',
  17: 'https://lh3.googleusercontent.com/d/1-6Z0g6mrUXeeV1G7OYDrHI03RBZQuROE',
  18: 'https://lh3.googleusercontent.com/d/1svgPXoXPBfIf3_84rZ63WQCc_lc9YApO',
  19: 'https://lh3.googleusercontent.com/d/1eWLaqiGP9wNhlZs9dZqUqPYHwFn3DbdU',
  20: 'https://lh3.googleusercontent.com/d/18_O3K2wPtx3AR0g-TpNzzK92AqJ6Dgkr',
  21: 'https://lh3.googleusercontent.com/d/1PdD3-COJeHf1h7T9VtC4GjgG-fBDG2fV',
  22: 'https://lh3.googleusercontent.com/d/190iGh65CaDjS06OPWhjRwc7dfQw59lw9',
  23: 'https://lh3.googleusercontent.com/d/1JrSabZrYfanrJe2-nbOsjYXSvqZ0BZXR',
  24: 'https://lh3.googleusercontent.com/d/1x67n1CGkqsqu06xhYs6O9tJm0JXOJohz',
  25: 'https://lh3.googleusercontent.com/d/1ju3V1kTwlOPzCQro09bqlOX3NX5v8SKn',
  26: 'https://lh3.googleusercontent.com/d/1gvCOEpzsz_hD7SF3Ogu9bPKT6r2v8_p9',
  27: 'https://lh3.googleusercontent.com/d/1KYX6FX7aUg5kyUrYBt6Y58-C9PdwcHPc',
  28: 'https://lh3.googleusercontent.com/d/1qHFY41WIstNGXZH15SX8xifqFprS0zwE',
  29: 'https://lh3.googleusercontent.com/d/1ASqoZSQvqQNOH9TMXnr1kgnSgAzguFHM',
  30: 'https://lh3.googleusercontent.com/d/1W2UvtHWQ0kzDLVeasHtiHaKe2rdoQGLL',
  31: 'https://lh3.googleusercontent.com/d/1YbJNqfgHg6S2sb_TgFUSmMahj6tnZSES',
  32: 'https://lh3.googleusercontent.com/d/1KkX9S-Uaj5jrzvW5QtBg7WFtLmJM5FKv'
};

async function main() {
  console.log('🔄 Updating character thumbnails in src/data/notionPrompts.ts...');

  const filePath = './src/data/notionPrompts.ts';
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/export const NOTION_PROMPTS: PromptPack\[\] = (\[[\s\S]*?\]);\s*$/);
  
  if (!match) {
    console.error('Could not find NOTION_PROMPTS array in notionPrompts.ts');
    process.exit(1);
  }

  const prompts = JSON.parse(match[1]);
  let updatedCount = 0;

  prompts.forEach(p => {
    if (p.category === 'Karakter AI' || (p.title && p.title.toUpperCase().includes('KARAKTER'))) {
      const numMatch = p.title.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0]);
        if (DRIVE_THUMBNAILS[num]) {
          p.thumbnail = DRIVE_THUMBNAILS[num];
          updatedCount++;
          console.log(`Updated ${p.title} -> ${DRIVE_THUMBNAILS[num]}`);
        }
      }
    }
  });

  // Check if Karakter 31 and 32 exist in prompts, if not add them
  const hasKarakter31 = prompts.some(p => p.title.toUpperCase() === 'KARAKTER 31');
  if (!hasKarakter31) {
    prompts.unshift({
      id: 'notion-fiksi-0-31',
      title: 'KARAKTER 31',
      thumbnail: DRIVE_THUMBNAILS[31],
      category: 'Karakter AI',
      subCategory: 'Cewek',
      aiModel: 'Flux.1 Pro',
      usageCount: 8120,
      difficulty: 'Sedang',
      aspectRatio: '4:5',
      tags: ['Karakter AI', 'Cewek', 'Fashion'],
      promptText: 'Photorealistic portrait, Indonesian creative woman, Studio Fashion portrait aesthetic. Symmetrical elegant face, glowing warm medium skin with natural finish, dark expressive almond eyes with soft eyeliner, natural brows, soft lips in peach gloss, sleek dark hair parted in the middle. Confident artistic expression. Minimalist contemporary outfit. Pure neutral studio background with soft directional key light. Shot on Sony A7R V with 85mm f/1.4 lens, shallow depth of field, ultra-high realistic skin texture with visible micro details, no plastic skin, film grain texture.',
      negativePrompt: 'blurry, deformed hands, plastic skin, bad anatomy, low quality, oversaturated, noise, artifacts',
      cameraSettings: 'Sony A7R V, 85mm f/1.4 GM lens, natural depth of field',
      lighting: 'Professional Studio Soft Lighting + Rim Light',
      motion: 'Subtle Natural Breathing Movement',
      environment: 'Authentic Indonesian Interior & Studio Setting',
      tips: [
        'Deskripsi: Potret wanita Indonesia kreatif dalam gaya studio fashion portrait elegan.',
        'Sub-Kategori: Cewek',
        'Gunakan seed yang sama untuk mempertahankan konsistensi visual.',
        'Rekomendasi Aspect Ratio: 4:5'
      ],
      author: 'FIKSI AI',
      isPremium: true,
      isPublished: true
    });
    console.log('✓ Added KARAKTER 31');
  }

  const hasKarakter32 = prompts.some(p => p.title.toUpperCase() === 'KARAKTER 32');
  if (!hasKarakter32) {
    prompts.unshift({
      id: 'notion-fiksi-0-32',
      title: 'KARAKTER 32',
      thumbnail: DRIVE_THUMBNAILS[32],
      category: 'Karakter AI',
      subCategory: 'Cewek',
      aiModel: 'Omni Flash',
      usageCount: 9340,
      difficulty: 'Sedang',
      aspectRatio: '4:5',
      tags: ['Karakter AI', 'Cewek', 'Indonesian Portrait'],
      promptText: 'Photorealistic studio portrait, Indonesian woman in studio setting. Natural warm tan complexion with subtle highlight, glowing dewy finish, deep dark brown eyes with soft catchlights, well-defined brows, natural rosy lips, black glossy wavy hair. Warm approachable smile. Elegant modern studio casual wear. Soft studio lighting with warm fill. Shot on 85mm f/1.4 lens, sharp focus on eyes, micro skin pore details, subsurface scattering, authentic Indonesian beauty aesthetic.',
      negativePrompt: 'blurry, deformed hands, plastic skin, bad anatomy, low quality, oversaturated, noise, artifacts',
      cameraSettings: 'Sony A7R V, 85mm f/1.4 GM lens, natural depth of field',
      lighting: 'Professional Studio Soft Lighting + Rim Light',
      motion: 'Subtle Natural Breathing Movement',
      environment: 'Authentic Indonesian Interior & Studio Setting',
      tips: [
        'Deskripsi: Potret wanita Indonesia studio portrait dengan pencahayaan hangat alami.',
        'Sub-Kategori: Cewek',
        'Gunakan seed yang sama untuk mempertahankan konsistensi visual.',
        'Rekomendasi Aspect Ratio: 4:5'
      ],
      author: 'FIKSI AI',
      isPremium: false,
      isPublished: true
    });
    console.log('✓ Added KARAKTER 32');
  }

  const newFileContent = `// Autogenerated Prompt Packs imported from Notion (PROMPT PACK BY FIKSI AI)\nimport { PromptPack } from '../types';\n\nexport const NOTION_PROMPTS: PromptPack[] = ${JSON.stringify(prompts, null, 2)};\n`;
  fs.writeFileSync(filePath, newFileContent, 'utf-8');
  console.log(`✅ Saved ${filePath} (${prompts.length} total prompts, ${updatedCount} thumbnails updated).`);

  // Now update MongoDB Atlas PromptPack collection
  console.log('🔄 Updating prompts in MongoDB Atlas database...');
  for (let num = 1; num <= 32; num++) {
    const thumbUrl = DRIVE_THUMBNAILS[num];
    if (!thumbUrl) continue;

    // Search by title (e.g. KARAKTER 1, KARAKTER 2, ...)
    const title = `KARAKTER ${num}`;
    const existing = await prisma.promptPack.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' }
      }
    });

    if (existing) {
      await prisma.promptPack.update({
        where: { id: existing.id },
        data: { thumbnail: thumbUrl }
      });
      console.log(`✓ Updated in DB: ${title} -> ${thumbUrl}`);
    } else {
      // Find the prompt definition from local array
      const promptDef = prompts.find(p => p.title.toUpperCase() === title);
      if (promptDef) {
        await prisma.promptPack.create({
          data: {
            title: promptDef.title,
            thumbnail: thumbUrl,
            category: promptDef.category,
            subCategory: promptDef.subCategory || null,
            aiModel: promptDef.aiModel,
            usageCount: promptDef.usageCount || 0,
            isNew: !!promptDef.isNew,
            isPopular: !!promptDef.isPopular,
            isPremium: !!promptDef.isPremium,
            difficulty: promptDef.difficulty || 'Mudah',
            aspectRatio: promptDef.aspectRatio || '16:9',
            tags: promptDef.tags || ['AI', 'Prompt'],
            promptText: promptDef.promptText,
            negativePrompt: promptDef.negativePrompt || null,
            cameraSettings: promptDef.cameraSettings || null,
            lighting: promptDef.lighting || null,
            motion: promptDef.motion || null,
            voice: promptDef.voice || null,
            environment: promptDef.environment || null,
            tips: promptDef.tips || [],
            author: promptDef.author || 'FIKSI AI',
            isPublished: true
          }
        });
        console.log(`✓ Created in DB: ${title} -> ${thumbUrl}`);
      }
    }
  }

  console.log('🎉 Successfully synchronized all character thumbnails with Google Drive & MongoDB Atlas!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error updating thumbnails:', err);
  process.exit(1);
});
