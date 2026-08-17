import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { 
  MOCK_COURSES, 
  MOCK_PROMPTS, 
  MOCK_ASSETS, 
  MOCK_BLOGS, 
  MOCK_EXTERNAL_TOOLS, 
  MOCK_WEEKLY_UPDATES 
} from '../src/data/mockData';
import { NOTION_PROMPTS } from '../src/data/notionPrompts';
import dns from 'dns';

// Fix for Windows Node DNS querySrv on Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

dotenv.config();

const prisma = new PrismaClient();

const USERS_TO_MIGRATE = [
  {
    name: 'Heisprojekt Admin',
    email: 'heisprojekt@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'Admin',
    password: 'password123',
    joinedDate: '01 Jan 2025',
    validUntil: 'Lifetime VIP',
    coursesCompleted: 15,
    savedPrompts: 180,
    totalDownloads: 45,
    streakDays: 42,
    bookmarks: ['prompt-1', 'prompt-2', 'prompt-4'],
    completedEpisodes: ['omni-flash-masterclass-ep-1', 'omni-flash-masterclass-ep-2']
  },
  {
    name: 'FIKSI AI Admin',
    email: 'fiksiaiai@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'Admin',
    password: 'password123',
    joinedDate: '01 Jan 2025',
    validUntil: 'Lifetime VIP',
    coursesCompleted: 20,
    savedPrompts: 240,
    totalDownloads: 60,
    streakDays: 50,
    bookmarks: ['prompt-1', 'prompt-3'],
    completedEpisodes: ['omni-flash-masterclass-ep-1']
  },
  {
    name: 'Heisy Creator',
    email: 'heisy.creator@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'Pro Member',
    password: 'password123',
    joinedDate: '12 Mar 2025',
    validUntil: '12 Mar 2026',
    coursesCompleted: 12,
    savedPrompts: 156,
    totalDownloads: 32,
    streakDays: 24,
    bookmarks: ['prompt-1', 'prompt-4'],
    completedEpisodes: ['omni-flash-masterclass-ep-1', 'omni-flash-masterclass-ep-2']
  },
  {
    name: 'Budi Santoso',
    email: 'budi.creators@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'Pro Member',
    password: 'password123',
    joinedDate: '10 Mei 2025',
    validUntil: '10 Mei 2026',
    coursesCompleted: 8,
    savedPrompts: 64,
    totalDownloads: 18,
    streakDays: 14,
    bookmarks: ['prompt-2'],
    completedEpisodes: []
  },
  {
    name: 'Diana Putri',
    email: 'diana.agency@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role: 'Free Member',
    password: 'password123',
    joinedDate: '01 Jun 2025',
    validUntil: 'Free Tier',
    coursesCompleted: 2,
    savedPrompts: 12,
    totalDownloads: 3,
    streakDays: 5,
    bookmarks: [],
    completedEpisodes: []
  }
];

const TRANSACTIONS_TO_MIGRATE = [
  {
    userId: 'u-5',
    userName: 'Diana Putri',
    userEmail: 'diana.agency@gmail.com',
    planName: 'Pro Member Tahunan (1 Tahun Akses)',
    amount: 399000,
    qrisRef: 'QRIS-871923',
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    status: 'Pending'
  },
  {
    userId: 'u-4',
    userName: 'Budi Santoso',
    userEmail: 'budi.creators@gmail.com',
    planName: 'Pro Member Lifetime VIP',
    amount: 699000,
    qrisRef: 'QRIS-652391',
    proofImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80',
    status: 'Approved'
  }
];

async function main() {
  console.log('🚀 Starting Full Migration to MongoDB (FIKSI AI Academy)...');

  // 1. Migrate Users
  console.log('🌱 Migrating Users...');
  for (const user of USERS_TO_MIGRATE) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        password: user.password,
        joinedDate: user.joinedDate,
        validUntil: user.validUntil,
        coursesCompleted: user.coursesCompleted,
        savedPrompts: user.savedPrompts,
        totalDownloads: user.totalDownloads,
        streakDays: user.streakDays,
        bookmarks: user.bookmarks,
        completedEpisodes: user.completedEpisodes
      },
      create: user
    });
  }
  console.log(`✅ Migrated ${USERS_TO_MIGRATE.length} users.`);

  // 2. Migrate Courses
  console.log('🌱 Migrating Courses & Episodes with Rich Articles...');
  for (const course of MOCK_COURSES) {
    const slug = course.id;
    await prisma.course.upsert({
      where: { slug },
      update: {
        title: course.title,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
        bannerImage: course.bannerImage,
        category: course.category,
        level: course.level,
        progressPercentage: course.progressPercentage,
        totalEpisodes: course.totalEpisodes,
        completedEpisodes: course.completedEpisodes,
        instructor: course.instructor,
        episodes: course.episodes,
        resources: course.resources,
        description: course.description,
        isPublished: true
      },
      create: {
        slug,
        title: course.title,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
        bannerImage: course.bannerImage,
        category: course.category,
        level: course.level,
        progressPercentage: course.progressPercentage,
        totalEpisodes: course.totalEpisodes,
        completedEpisodes: course.completedEpisodes,
        instructor: course.instructor,
        episodes: course.episodes,
        resources: course.resources,
        description: course.description,
        isPublished: true
      }
    });
  }
  console.log(`✅ Migrated ${MOCK_COURSES.length} courses with full episode articles & resources.`);

  // 3. Migrate Creative Assets
  console.log('🌱 Migrating Creative Download Assets...');
  for (const asset of MOCK_ASSETS) {
    const { id: _, ...assetData } = asset;
    const existing = await prisma.downloadAsset.findFirst({ where: { title: asset.title } });
    if (existing) {
      await prisma.downloadAsset.update({
        where: { id: existing.id },
        data: assetData
      });
    } else {
      await prisma.downloadAsset.create({
        data: assetData
      });
    }
  }
  console.log(`✅ Migrated ${MOCK_ASSETS.length} download assets.`);

  // 4. Migrate External AI Tools
  console.log('🌱 Migrating External AI Tools...');
  for (const tool of MOCK_EXTERNAL_TOOLS) {
    const { id: _, ...toolData } = tool;
    const existing = await prisma.externalTool.findFirst({ where: { name: tool.name } });
    if (existing) {
      await prisma.externalTool.update({
        where: { id: existing.id },
        data: toolData
      });
    } else {
      await prisma.externalTool.create({
        data: toolData
      });
    }
  }
  console.log(`✅ Migrated ${MOCK_EXTERNAL_TOOLS.length} external AI tools.`);

  // 5. Migrate QRIS Transactions
  console.log('🌱 Migrating QRIS Transactions...');
  for (const trx of TRANSACTIONS_TO_MIGRATE) {
    const existing = await prisma.qRISPaymentTransaction.findFirst({ where: { qrisRef: trx.qrisRef } });
    if (existing) {
      await prisma.qRISPaymentTransaction.update({
        where: { id: existing.id },
        data: trx
      });
    } else {
      await prisma.qRISPaymentTransaction.create({
        data: trx
      });
    }
  }
  console.log(`✅ Migrated ${TRANSACTIONS_TO_MIGRATE.length} transactions.`);

  // 6. Migrate Blog Articles
  console.log('🌱 Migrating Blog Articles...');
  for (const article of MOCK_BLOGS) {
    const { id: _, ...articleData } = article;
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {
        title: articleData.title,
        coverImage: articleData.coverImage,
        category: articleData.category,
        readTime: articleData.readTime,
        publishedAt: articleData.publishedAt,
        author: articleData.author,
        excerpt: articleData.excerpt,
        content: articleData.content,
        tags: articleData.tags,
        tableOfContents: articleData.tableOfContents,
        isPublished: true
      },
      create: {
        slug: articleData.slug,
        title: articleData.title,
        coverImage: articleData.coverImage,
        category: articleData.category,
        readTime: articleData.readTime,
        publishedAt: articleData.publishedAt,
        author: articleData.author,
        excerpt: articleData.excerpt,
        content: articleData.content,
        tags: articleData.tags,
        tableOfContents: articleData.tableOfContents,
        isPublished: true
      }
    });
  }
  console.log(`✅ Migrated ${MOCK_BLOGS.length} blog articles.`);

  // 7. Migrate Weekly Updates
  console.log('🌱 Migrating Weekly Updates...');
  for (const update of MOCK_WEEKLY_UPDATES) {
    const existing = await prisma.weeklyUpdate.findFirst({ where: { version: update.version } });
    if (!existing) {
      await prisma.weeklyUpdate.create({
        data: update
      });
    }
  }
  console.log(`✅ Migrated ${MOCK_WEEKLY_UPDATES.length} weekly updates.`);

  // 8. Migrate All 500+ Prompts (Mock Prompts + Notion Dataset)
  console.log('🌱 Migrating All Prompts (Mock + Notion Prompts Dataset)...');
  const allPrompts = [...MOCK_PROMPTS, ...NOTION_PROMPTS];
  console.log(`📦 Total prompts to process: ${allPrompts.length}`);

  let insertedCount = 0;
  let updatedCount = 0;

  // Process in batches of 50 for fast bulk insertion
  const batchSize = 50;
  for (let i = 0; i < allPrompts.length; i += batchSize) {
    const chunk = allPrompts.slice(i, i + batchSize);
    
    await Promise.all(
      chunk.map(async (prompt) => {
        const { id: _, ...promptData } = prompt;
        const existing = await prisma.promptPack.findFirst({ where: { title: prompt.title } });
        if (existing) {
          await prisma.promptPack.update({
            where: { id: existing.id },
            data: {
              thumbnail: promptData.thumbnail,
              category: promptData.category,
              subCategory: promptData.subCategory,
              aiModel: promptData.aiModel,
              usageCount: promptData.usageCount || 0,
              isNew: promptData.isNew || false,
              isPopular: promptData.isPopular || false,
              isPremium: promptData.isPremium || false,
              difficulty: promptData.difficulty || 'Mudah',
              aspectRatio: promptData.aspectRatio || '16:9',
              tags: promptData.tags || [],
              promptText: promptData.promptText,
              negativePrompt: promptData.negativePrompt || null,
              cameraSettings: promptData.cameraSettings || null,
              lighting: promptData.lighting || null,
              motion: promptData.motion || null,
              voice: promptData.voice || null,
              environment: promptData.environment || null,
              tips: promptData.tips || [],
              author: promptData.author || 'FIKSI Team',
              isPublished: true
            }
          });
          updatedCount++;
        } else {
          await prisma.promptPack.create({
            data: {
              title: promptData.title,
              thumbnail: promptData.thumbnail,
              category: promptData.category,
              subCategory: promptData.subCategory,
              aiModel: promptData.aiModel,
              usageCount: promptData.usageCount || 0,
              isNew: promptData.isNew || false,
              isPopular: promptData.isPopular || false,
              isPremium: promptData.isPremium || false,
              difficulty: promptData.difficulty || 'Mudah',
              aspectRatio: promptData.aspectRatio || '16:9',
              tags: promptData.tags || [],
              promptText: promptData.promptText,
              negativePrompt: promptData.negativePrompt || null,
              cameraSettings: promptData.cameraSettings || null,
              lighting: promptData.lighting || null,
              motion: promptData.motion || null,
              voice: promptData.voice || null,
              environment: promptData.environment || null,
              tips: promptData.tips || [],
              author: promptData.author || 'FIKSI Team',
              isPublished: true
            }
          });
          insertedCount++;
        }
      })
    );

    console.log(`...processed ${Math.min(i + batchSize, allPrompts.length)} / ${allPrompts.length} prompts`);
  }

  console.log(`✅ Successfully migrated prompts: ${insertedCount} created, ${updatedCount} updated.`);
  console.log('🎉 ALL DATA HAS BEEN SUCCESSFULLY MIGRATED TO MONGODB!');
}

main()
  .catch((e) => {
    console.error('❌ Migration Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
