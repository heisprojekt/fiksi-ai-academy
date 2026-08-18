import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import dns from 'dns';

// Fix for Windows Node DNS querySrv on Atlas only (avoid overriding DNS in Vercel/Lambda Linux)
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // ignore
  }
}

dotenv.config();

// Default fallback for MongoDB Atlas to ensure connection works on Vercel deployment
const DEFAULT_DATABASE_URL = "mongodb+srv://heisprojekt_db_user:nirvana1998@fiksiai.yvlj7w3.mongodb.net/fiksi_ai_academy?retryWrites=true&w=majority&appName=fiksiai";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

const ADMIN_EMAILS = ['heisprojekt@gmail.com', 'fiksiaiai@gmail.com'];

const app = express();
const port = process.env.PORT || 3001;

// Serverless Singleton Prisma Client to prevent connection pool exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

const getIdParam = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : (id || '');
};

const router = express.Router();

// Root route
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 FIKSI AI Academy API Backend is running!',
    database: 'MongoDB Atlas',
    status: 'online',
    endpoints: {
      health: '/api/health',
      dbStatus: '/api/db-status',
      prompts: '/api/prompts',
      courses: '/api/courses',
      assets: '/api/assets',
      tools: '/api/tools',
      users: '/api/users',
      googleAuth: '/api/auth/google',
      blogs: '/api/blogs',
      updates: '/api/weekly-updates'
    }
  });
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', database: 'mongodb', timestamp: new Date().toISOString() });
});

// Live Database connection & User count status check
router.get('/db-status', async (_req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const promptCount = await prisma.promptPack.count();
    const courseCount = await prisma.course.count();
    res.json({
      status: 'connected',
      database: 'MongoDB Atlas (fiksi_ai_academy)',
      counts: {
        users: userCount,
        prompts: promptCount,
        courses: courseCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'MongoDB Atlas',
      error: error.message
    });
  }
});

// ==========================================
// 1. PROMPTS API
// ==========================================
router.get('/prompts', async (req: Request, res: Response) => {
  try {
    const { category, aiModel, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isPublished: true };

    if (category && category !== 'All') {
      where.category = category as string;
    }

    if (aiModel && aiModel !== 'All') {
      where.aiModel = aiModel as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { promptText: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } }
      ];
    }

    const [prompts, total] = await Promise.all([
      prisma.promptPack.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.promptPack.count({ where })
    ]);

    res.json({
      data: prompts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching prompts from MongoDB:', error.message);
    res.status(500).json({ error: 'Failed to fetch prompts', details: error.message });
  }
});

router.post('/prompts', async (req: Request, res: Response) => {
  try {
    const newPrompt = await prisma.promptPack.create({
      data: req.body
    });
    res.status(201).json(newPrompt);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create prompt', details: error.message });
  }
});

router.put('/prompts/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.promptPack.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update prompt', details: error.message });
  }
});

router.delete('/prompts/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    await prisma.promptPack.delete({
      where: { id }
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete prompt', details: error.message });
  }
});

// ==========================================
// 2. COURSES API
// ==========================================
router.get('/courses', async (_req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error: any) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

router.post('/courses', async (req: Request, res: Response) => {
  try {
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCourse = await prisma.course.create({
      data: { ...req.body, slug }
    });
    res.status(201).json(newCourse);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
});

router.put('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.course.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update course', details: error.message });
  }
});

router.delete('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    await prisma.course.delete({
      where: { id }
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete course', details: error.message });
  }
});

// ==========================================
// 3. ASSETS API
// ==========================================
router.get('/assets', async (_req: Request, res: Response) => {
  try {
    const assets = await prisma.downloadAsset.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch assets', details: error.message });
  }
});

router.post('/assets', async (req: Request, res: Response) => {
  try {
    const newAsset = await prisma.downloadAsset.create({ data: req.body });
    res.status(201).json(newAsset);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create asset', details: error.message });
  }
});

router.put('/assets/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.downloadAsset.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update asset', details: error.message });
  }
});

router.delete('/assets/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    await prisma.downloadAsset.delete({ where: { id } });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete asset', details: error.message });
  }
});

// ==========================================
// 4. EXTERNAL TOOLS API
// ==========================================
router.get('/tools', async (_req: Request, res: Response) => {
  try {
    const tools = await prisma.externalTool.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tools);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tools', details: error.message });
  }
});

router.post('/tools', async (req: Request, res: Response) => {
  try {
    const tool = await prisma.externalTool.create({ data: req.body });
    res.status(201).json(tool);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create tool', details: error.message });
  }
});

router.put('/tools/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.externalTool.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update tool', details: error.message });
  }
});

router.delete('/tools/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    await prisma.externalTool.delete({ where: { id } });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete tool', details: error.message });
  }
});

// ==========================================
// 5. USERS & TRANSACTIONS API
// ==========================================
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    console.error('[MongoDB Error] Failed to fetch users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Sync / Upsert User into MongoDB Atlas (Google Sign-In / Register / Profile update)
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, role, status, validUntil, bookmarks, streakDays, coursesCompleted, savedPrompts, totalDownloads } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailClean = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailClean);
    
    // Check if user already exists in MongoDB Atlas
    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      const updated = await prisma.user.update({
        where: { email: emailClean },
        data: {
          name: name || existing.name,
          avatar: avatar || existing.avatar,
          role: isAdmin ? 'Admin' : (role || existing.role),
          status: status || existing.status || 'Active',
          validUntil: isAdmin ? 'Lifetime VIP' : (validUntil || existing.validUntil),
          streakDays: streakDays !== undefined ? Number(streakDays) : existing.streakDays,
          bookmarks: bookmarks || existing.bookmarks,
          coursesCompleted: coursesCompleted !== undefined ? Number(coursesCompleted) : existing.coursesCompleted,
          savedPrompts: savedPrompts !== undefined ? Number(savedPrompts) : existing.savedPrompts,
          totalDownloads: totalDownloads !== undefined ? Number(totalDownloads) : existing.totalDownloads,
          updatedAt: new Date()
        }
      });
      console.log(`[MongoDB Atlas] ✅ Updated existing user: ${emailClean} (Role: ${updated.role})`);
      return res.json(updated);
    } else {
      const fallbackName = emailClean.split('@')[0];
      const newUser = await prisma.user.create({
        data: {
          email: emailClean,
          name: name || (isAdmin ? 'Admin FIKSI' : fallbackName),
          avatar: avatar || (isAdmin 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'),
          role: isAdmin ? 'Admin' : (role || 'Free Member'),
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          validUntil: isAdmin ? 'Lifetime VIP' : (validUntil || 'Free Tier'),
          status: status || 'Active',
          coursesCompleted: 0,
          savedPrompts: 0,
          totalDownloads: 0,
          streakDays: streakDays ? Number(streakDays) : 1,
          bookmarks: bookmarks || [],
          completedEpisodes: []
        }
      });
      console.log(`[MongoDB Atlas] 🌟 Created NEW user via Google/Auth: ${emailClean} (ID: ${newUser.id}, Role: ${newUser.role})`);
      return res.status(201).json(newUser);
    }
  } catch (error: any) {
    console.error('[MongoDB Atlas Error] in POST /api/users:', error.message);
    res.status(500).json({ error: 'Failed to create or update user in MongoDB Atlas', details: error.message });
  }
});

// Dedicated Google Authentication Endpoint
router.post('/auth/google', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign-In' });
    }

    const emailClean = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailClean);

    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      const updated = await prisma.user.update({
        where: { email: emailClean },
        data: {
          name: name || existing.name,
          avatar: avatar || existing.avatar,
          role: isAdmin ? 'Admin' : existing.role,
          updatedAt: new Date()
        }
      });
      console.log(`[Google Auth -> MongoDB Atlas] Existing user logged in: ${emailClean}`);
      return res.json({ success: true, user: updated, isNew: false });
    } else {
      const fallbackName = emailClean.split('@')[0];
      const newUser = await prisma.user.create({
        data: {
          email: emailClean,
          name: name || (isAdmin ? 'Admin FIKSI' : fallbackName),
          avatar: avatar || (isAdmin 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'),
          role: isAdmin ? 'Admin' : 'Free Member',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          validUntil: isAdmin ? 'Lifetime VIP' : 'Free Tier',
          status: 'Active',
          coursesCompleted: 0,
          savedPrompts: 0,
          totalDownloads: 0,
          streakDays: 1,
          bookmarks: [],
          completedEpisodes: []
        }
      });
      console.log(`[Google Auth -> MongoDB Atlas] New Google account registered: ${emailClean} (ID: ${newUser.id})`);
      return res.status(201).json({ success: true, user: newUser, isNew: true });
    }
  } catch (error: any) {
    console.error('[Google Auth Error]:', error.message);
    res.status(500).json({ error: 'Failed to authenticate Google user in MongoDB Atlas', details: error.message });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.user.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    await prisma.user.delete({
      where: { id }
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

router.get('/transactions', async (_req: Request, res: Response) => {
  try {
    const trxs = await prisma.qRISPaymentTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(trxs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
});

router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const trx = await prisma.qRISPaymentTransaction.create({ data: req.body });
    res.status(201).json(trx);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
});

router.put('/transactions/:id', async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);
    const updated = await prisma.qRISPaymentTransaction.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
});

// ==========================================
// 6. BLOGS & UPDATES API
// ==========================================
router.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
  }
});

router.get('/weekly-updates', async (_req: Request, res: Response) => {
  try {
    const updates = await prisma.weeklyUpdate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(updates);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch weekly updates', details: error.message });
  }
});

// Mount router on both '/api' and '/' so all environments & Vercel rewrites work seamlessly
app.use('/api', router);
app.use('/', router);

// Start standalone server only when executed directly via node/tsx
const isStandalone = process.argv[1]?.includes('server') || process.env.STANDALONE === 'true';
if (isStandalone && !process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 FIKSI AI Academy API Server running at http://localhost:${port}`);
  });
}

export default app;
