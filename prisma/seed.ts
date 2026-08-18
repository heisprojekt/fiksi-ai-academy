import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import dns from 'dns';

if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}
}

dotenv.config();

const DEFAULT_DATABASE_URL = "mongodb+srv://heisprojekt_db_user:nirvana1998@fiksiai.yvlj7w3.mongodb.net/fiksi_ai_academy?retryWrites=true&w=majority&appName=fiksiai";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

const prisma = new PrismaClient();

// Import mock data directly
import { MOCK_COURSES, MOCK_ASSETS, MOCK_EXTERNAL_TOOLS } from '../src/data/mockData';
import { NOTION_PROMPTS } from '../src/data/notionPrompts';

async function seed() {
  console.log('🌱 Starting MongoDB Atlas database sync & seed...');

  // 1. SEED COURSES
  const courseCount = await prisma.course.count();
  console.log(`Current courses in MongoDB: ${courseCount}`);
  if (courseCount === 0) {
    console.log('Seeding courses...');
    for (const c of MOCK_COURSES) {
      await prisma.course.create({
        data: {
          slug: c.id,
          title: c.title,
          subtitle: c.subtitle,
          thumbnail: c.thumbnail,
          bannerImage: c.bannerImage,
          category: c.category,
          level: c.level,
          progressPercentage: c.progressPercentage || 0,
          totalEpisodes: c.episodes?.length || 0,
          completedEpisodes: c.completedEpisodes || 0,
          instructor: c.instructor,
          description: c.description,
          episodes: c.episodes || [],
          resources: (c.resources || []).map(r => ({
            title: r.title,
            type: r.type,
            size: r.size,
            downloadUrl: r.downloadUrl
          })),
          isPublished: true
        }
      });
      console.log(`✓ Seeded course: ${c.title} (${c.id})`);
    }
  }

  // 2. SEED PROMPTS
  const promptCount = await prisma.promptPack.count();
  console.log(`Current prompts in MongoDB: ${promptCount}`);
  if (promptCount === 0) {
    console.log('Seeding prompts from Notion library...');
    for (const p of NOTION_PROMPTS) {
      await prisma.promptPack.create({
        data: {
          title: p.title,
          thumbnail: p.thumbnail,
          category: p.category,
          subCategory: p.subCategory || null,
          aiModel: p.aiModel,
          usageCount: p.usageCount || 0,
          isNew: !!p.isNew,
          isPopular: !!p.isPopular,
          isPremium: !!p.isPremium,
          difficulty: p.difficulty || 'Mudah',
          aspectRatio: p.aspectRatio || '16:9',
          tags: p.tags || ['AI', 'Prompt'],
          promptText: p.promptText,
          negativePrompt: p.negativePrompt || null,
          cameraSettings: p.cameraSettings || null,
          lighting: p.lighting || null,
          motion: p.motion || null,
          voice: p.voice || null,
          environment: p.environment || null,
          tips: p.tips || [],
          author: p.author || 'FIKSI Team',
          isPublished: true
        }
      });
    }
    console.log(`✓ Seeded ${NOTION_PROMPTS.length} prompt packs into MongoDB.`);
  }

  // 3. SEED ASSETS
  const assetCount = await prisma.downloadAsset.count();
  console.log(`Current assets in MongoDB: ${assetCount}`);
  if (assetCount === 0) {
    console.log('Seeding assets...');
    for (const a of MOCK_ASSETS) {
      await prisma.downloadAsset.create({
        data: {
          title: a.title,
          thumbnail: a.thumbnail,
          format: a.format,
          size: a.size,
          category: a.category,
          downloadsCount: a.downloadsCount || 0,
          tags: a.tags || [],
          fileUrl: a.fileUrl,
          isPremium: !!a.isPremium,
          isPublished: true
        }
      });
    }
    console.log(`✓ Seeded ${MOCK_ASSETS.length} assets into MongoDB.`);
  }

  // 4. SEED TOOLS
  const toolCount = await prisma.externalTool.count();
  console.log(`Current tools in MongoDB: ${toolCount}`);
  if (toolCount === 0) {
    console.log('Seeding tools...');
    for (const t of MOCK_EXTERNAL_TOOLS) {
      await prisma.externalTool.create({
        data: {
          name: t.name,
          description: t.description,
          category: t.category,
          url: t.url,
          thumbnail: t.thumbnail,
          pricingType: t.pricingType,
          isPremium: !!t.isPremium,
          isFeatured: !!t.isFeatured,
          tags: t.tags || []
        }
      });
    }
    console.log(`✓ Seeded ${MOCK_EXTERNAL_TOOLS.length} external tools into MongoDB.`);
  }

  const finalCounts = {
    users: await prisma.user.count(),
    courses: await prisma.course.count(),
    prompts: await prisma.promptPack.count(),
    assets: await prisma.downloadAsset.count(),
    tools: await prisma.externalTool.count(),
  };

  console.log('🎉 Seed completed successfully! Final counts:', finalCounts);
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
