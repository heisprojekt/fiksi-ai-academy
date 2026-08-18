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

const MOCK_COURSES = [
  {
    slug: 'omni-flash-masterclass',
    title: 'Omni Flash Masterclass',
    subtitle: 'Kuasai Omni Flash dari dasar hingga mahir untuk hasilkan visual AI konsisten',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    category: 'AI Video & Visual',
    level: 'Menengah',
    progressPercentage: 0,
    totalEpisodes: 5,
    completedEpisodes: 0,
    instructor: {
      name: 'Rian Antigravity',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Lead AI Creative Director'
    },
    description: 'Masterclass eksklusif cara menghasilkan animasi video dan konsistensi karakter sinematik menggunakan model Omni Flash v3.',
    episodes: [
      {
        id: 'ep-1',
        title: 'Episode 1: Pengenalan & Workflow Karakter AI',
        duration: '12:45',
        completed: false,
        videoUrl: 'https://drive.google.com/file/d/1jg0t4FgM25ei0JdJPmowjqQeimtx9rGT/view?usp=sharing',
        description: 'Panduan langkah demi langkah membuat prompt karakter konsisten dan generate visual pertama.',
        keyTopics: ['Omni Flash Architecture', 'Model Parameters', 'Prompt Base Setup']
      },
      {
        id: 'ep-2',
        title: 'Episode 2: Dasar Prompting & Seed Control',
        duration: '18:20',
        completed: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        description: 'Cara menyusun prompt terstruktur untuk menghindari distorsi anatomi dan artifacts.',
        keyTopics: ['Prompt Weighting', 'Negative Prompt Master', 'Seed Locking']
      }
    ],
    resources: [],
    isPublished: true
  },
  {
    slug: 'kling-ai-video-mastery',
    title: 'Kling AI 1.5 Video Mastery',
    subtitle: 'Generate cinematic AI video commercial grade dengan Kling AI 1.5 Pro',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=80',
    category: 'AI Video & Motion',
    level: 'Pemula',
    progressPercentage: 0,
    totalEpisodes: 4,
    completedEpisodes: 0,
    instructor: {
      name: 'Maya Studio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Cinematographer & VFX Artist'
    },
    description: 'Panduan lengkap membuat video sinematik dengan Kling AI 1.5.',
    episodes: [
      {
        id: 'ep-1',
        title: 'Episode 1: Setup & Prompt Motion Camera Kling AI',
        duration: '15:10',
        completed: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Setting awal dan cara membuat prompt motion realistis.',
        keyTopics: ['Camera Motion', 'Frame Interpolation', 'Resolution Setup']
      }
    ],
    resources: [],
    isPublished: true
  },
  {
    slug: 'midjourney-v6-mastery',
    title: 'Midjourney v6 Masterclass: Photorealism & Branding',
    subtitle: 'Kuasai teknik prompt lighting, lensing, dan color styling di Midjourney v6.1',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    category: 'Image Generation',
    level: 'Pemula',
    progressPercentage: 0,
    totalEpisodes: 5,
    completedEpisodes: 0,
    instructor: {
      name: 'Devin K.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'Commercial Visual Artist'
    },
    description: 'Eksplorasi pembuatan gambar fotorealistis untuk branding komersial.',
    episodes: [],
    resources: [],
    isPublished: true
  },
  {
    slug: 'flux-photorealism',
    title: 'Flux.1 Pro & Schnell: Zero-Artifact Visuals',
    subtitle: 'Belajar rendering gambar super realistis dengan teks akurat menggunakan Flux.1',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=80',
    category: 'Image Generation',
    level: 'Lanjutan',
    progressPercentage: 0,
    totalEpisodes: 4,
    completedEpisodes: 0,
    instructor: {
      name: 'Sarah Lin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      role: 'Prompt Architect'
    },
    description: 'Optimalisasi rendering visual tanpa artefak dan konsistensi teks.',
    episodes: [],
    resources: [],
    isPublished: true
  }
];

async function seed() {
  console.log('Seeding courses into MongoDB Atlas...');
  for (const c of MOCK_COURSES) {
    const existing = await prisma.course.findFirst({ where: { slug: c.slug } });
    if (!existing) {
      await prisma.course.create({ data: c });
      console.log('✓ Inserted course:', c.title);
    } else {
      console.log('Course already exists in DB:', c.slug);
    }
  }

  const count = await prisma.course.count();
  console.log('Total courses now in MongoDB Atlas:', count);
  process.exit(0);
}

seed().catch(e => {
  console.error('Seed error:', e);
  process.exit(1);
});
