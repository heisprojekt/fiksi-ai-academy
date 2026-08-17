import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import dns from 'dns';

// Fix for Windows Node DNS querySrv on Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

dotenv.config();

// Default fallback for MongoDB Atlas to ensure connection works on Vercel deployment
const DEFAULT_DATABASE_URL = "mongodb+srv://heisprojekt_db_user:nirvana1998@fiksiai.yvlj7w3.mongodb.net/fiksi_ai_academy?retryWrites=true&w=majority&appName=fiksiai";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const getIdParam = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : (id || '');
};

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 FIKSI AI Academy API Backend is running!',
    database: 'MongoDB Atlas',
    status: 'online',
    endpoints: {
      health: '/api/health',
      prompts: '/api/prompts',
      courses: '/api/courses',
      assets: '/api/assets',
      tools: '/api/tools',
      users: '/api/users',
      blogs: '/api/blogs',
      updates: '/api/weekly-updates'
    }
  });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', database: 'mongodb', timestamp: new Date().toISOString() });
});

// ==========================================
// 1. PROMPTS API
// ==========================================
app.get('/api/prompts', async (req: Request, res: Response) => {
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

app.post('/api/prompts', async (req: Request, res: Response) => {
  try {
    const newPrompt = await prisma.promptPack.create({
      data: req.body
    });
    res.status(201).json(newPrompt);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create prompt', details: error.message });
  }
});

app.put('/api/prompts/:id', async (req: Request, res: Response) => {
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

app.delete('/api/prompts/:id', async (req: Request, res: Response) => {
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
app.get('/api/courses', async (_req: Request, res: Response) => {
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

app.post('/api/courses', async (req: Request, res: Response) => {
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

app.put('/api/courses/:id', async (req: Request, res: Response) => {
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

app.delete('/api/courses/:id', async (req: Request, res: Response) => {
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
app.get('/api/assets', async (_req: Request, res: Response) => {
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

app.post('/api/assets', async (req: Request, res: Response) => {
  try {
    const newAsset = await prisma.downloadAsset.create({ data: req.body });
    res.status(201).json(newAsset);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create asset', details: error.message });
  }
});

app.put('/api/assets/:id', async (req: Request, res: Response) => {
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

app.delete('/api/assets/:id', async (req: Request, res: Response) => {
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
app.get('/api/tools', async (_req: Request, res: Response) => {
  try {
    const tools = await prisma.externalTool.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tools);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tools', details: error.message });
  }
});

app.post('/api/tools', async (req: Request, res: Response) => {
  try {
    const tool = await prisma.externalTool.create({ data: req.body });
    res.status(201).json(tool);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create tool', details: error.message });
  }
});

app.put('/api/tools/:id', async (req: Request, res: Response) => {
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

app.delete('/api/tools/:id', async (req: Request, res: Response) => {
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
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, role, status, validUntil, bookmarks, streakDays } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailClean = email.trim().toLowerCase();
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      const updated = await prisma.user.update({
        where: { email: emailClean },
        data: {
          name: name || existing.name,
          avatar: avatar || existing.avatar,
          role: role || existing.role,
          status: status || existing.status || 'Active',
          validUntil: validUntil || existing.validUntil,
          streakDays: streakDays !== undefined ? streakDays : existing.streakDays,
          bookmarks: bookmarks || existing.bookmarks
        }
      });
      return res.json(updated);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: emailClean,
          name: name || emailClean.split('@')[0],
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          role: role || 'Free Member',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          validUntil: validUntil || 'Free Tier',
          status: status || 'Active',
          streakDays: streakDays || 1,
          bookmarks: bookmarks || []
        }
      });
      return res.status(201).json(newUser);
    }
  } catch (error: any) {
    console.error('Error in POST /api/users:', error.message);
    res.status(500).json({ error: 'Failed to create or update user in database', details: error.message });
  }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
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

app.delete('/api/users/:id', async (req: Request, res: Response) => {
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

app.get('/api/transactions', async (_req: Request, res: Response) => {
  try {
    const trxs = await prisma.qRISPaymentTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(trxs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
});

app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const trx = await prisma.qRISPaymentTransaction.create({ data: req.body });
    res.status(201).json(trx);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
});

app.put('/api/transactions/:id', async (req: Request, res: Response) => {
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
app.get('/api/blogs', async (_req: Request, res: Response) => {
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

app.get('/api/weekly-updates', async (_req: Request, res: Response) => {
  try {
    const updates = await prisma.weeklyUpdate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(updates);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch weekly updates', details: error.message });
  }
});

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 FIKSI AI Academy API Server running at http://localhost:${port}`);
  });
}

export default app;
