import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting MongoDB database seeding for FIKSI AI Academy...');

  // 1. Seed Users (Including the two specified Admin emails)
  console.log('🌱 Seeding Users...');
  const users = [
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
      completedEpisodes: ['omni-flash-masterclass-ep-1', 'omni-flash-masterclass-ep-2'],
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
      completedEpisodes: ['omni-flash-masterclass-ep-1'],
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
      completedEpisodes: ['omni-flash-masterclass-ep-1', 'omni-flash-masterclass-ep-2'],
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
      completedEpisodes: [],
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
      completedEpisodes: [],
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
  console.log(`✅ Seeded ${users.length} users.`);

  // 2. Seed Courses
  console.log('🌱 Seeding Courses...');
  const courses = [
    {
      slug: 'omni-flash-masterclass',
      title: 'Omni Flash Masterclass',
      subtitle: 'Kuasai Omni Flash dari dasar hingga mahir untuk hasilkan visual AI konsisten',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      category: 'AI Video & Visual',
      level: 'Menengah',
      progressPercentage: 35,
      totalEpisodes: 6,
      completedEpisodes: 2,
      instructor: {
        name: 'Rian Antigravity',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'Lead AI Creative Director'
      },
      description: 'Masterclass eksklusif cara menghasilkan animasi video dan konsistensi karakter sinematik menggunakan model Omni Flash v3. Belajar prompt structure, camera movement, dan color grading.',
      episodes: [
        {
          id: 'ep-1',
          title: 'Episode 1: Pengenalan Omni Flash',
          duration: '12:45',
          completed: true,
          videoUrl: 'https://drive.google.com/file/d/1jg0t4FgM25ei0JdJPmowjqQeimtx9rGT/view?usp=sharing',
          description: 'Memahami arsitektur Omni Flash, perbandingan dengan model lain, dan pengaturan workspace dasar.',
          keyTopics: ['Omni Flash Architecture', 'Model Parameters', 'Prompt Base Setup']
        },
        {
          id: 'ep-2',
          title: 'Episode 2: Dasar Prompting & Seed Control',
          duration: '18:20',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'Cara menyusun prompt terstruktur untuk menghindari distorsi anatomi dan artifacts.',
          keyTopics: ['Prompt Weighting', 'Negative Prompt Master', 'Seed Locking']
        },
        {
          id: 'ep-3',
          title: 'Episode 3: Character Consistency',
          duration: '24:15',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'Pelajari teknik menjaga konsistensi karakter di berbagai scene menggunakan Omni Flash reference image.',
          keyTopics: ['Reference Image Injection', 'Prompt Structure Continuity', 'Consistency Techniques', 'Common Mistakes Avoidance']
        },
        {
          id: 'ep-4',
          title: 'Episode 4: Camera & Motion Dynamics',
          duration: '15:30',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoytimes.mp4',
          description: 'Mengontrol pergerakan kamera pan, tilt, zoom, dan orbital movement tanpa glitch.',
          keyTopics: ['Pan & Tilt Prompting', 'Focal Length Control', 'Slow Motion Dynamics']
        },
        {
          id: 'ep-5',
          title: 'Episode 5: Lighting & Cinematic Mood',
          duration: '21:10',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          description: 'Teknik pencahayaan Volumetric, Cyberpunk Neon, Rembrant, dan Natural Golden Hour lighting.',
          keyTopics: ['Volumetric Light', 'Color Palette Prompting', 'HDR Tone Mapping']
        },
        {
          id: 'ep-6',
          title: 'Episode 6: Export & Post-Production Upscaling',
          duration: '19:40',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          description: 'Trik upscaling 4K 60fps dengan Topaz AI & Color Grading LUTs di Premiere/DaVinci.',
          keyTopics: ['4K Upscaling', '60fps Interpolation', 'LUT Application']
        }
      ],
      resources: [
        { title: 'Omni Flash Cheatsheet PDF', type: 'PDF', size: '4.2 MB', downloadUrl: '#' },
        { title: 'Cinematic Color Grading LUT Pack', type: 'ZIP', size: '18.5 MB', downloadUrl: '#' },
        { title: 'Prompt Preset File (.json)', type: 'JSON', size: '120 KB', downloadUrl: '#' }
      ]
    },
    {
      slug: 'nano-banana-starter',
      title: 'Nano Banana Workflow',
      subtitle: 'Solusi cepat bikin video iklan AI ultra-realistic tanpa budget produksi besar',
      thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
      category: 'Commercial AI',
      level: 'Pemula',
      progressPercentage: 72,
      totalEpisodes: 5,
      completedEpisodes: 3,
      instructor: {
        name: 'Sarah Wijaya',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        role: 'UGC Content Strategist'
      },
      description: 'Panduan lengkap cara memproduksi video UGC (User Generated Content) produk Skincare, Fashion, dan Gadget dalam waktu 10 menit.',
      episodes: [
        {
          id: 'nb-1',
          title: 'Episode 1: Setup Nano Banana Model',
          duration: '10:15',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnTheGrid.mp4',
          description: 'Inisialisasi environment dan API Nano Banana.',
          keyTopics: ['API Setup', 'Model Parameters']
        },
        {
          id: 'nb-2',
          title: 'Episode 2: UGC Product Review Automation',
          duration: '16:00',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          description: 'Bikin script voiceover AI dan sync dengan avatar manusia hiper-realistis.',
          keyTopics: ['Avatar Lipsync', 'Scripting AI', 'Commercial Lighting']
        }
      ],
      resources: [
        { title: 'UGC Script Templates', type: 'DOCX', size: '1.1 MB', downloadUrl: '#' }
      ]
    },
    {
      slug: 'seedance-ai-animation',
      title: 'Seedance Motion Animation',
      subtitle: 'Kreasikan efek visual 3D & animasi motion graphics level studio kelas dunia',
      thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=80',
      category: '3D Animation',
      level: 'Lanjutan',
      progressPercentage: 100,
      totalEpisodes: 8,
      completedEpisodes: 8,
      instructor: {
        name: 'Kevin Pratama',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        role: '3D AI Artist'
      },
      description: 'Kuasai teknik rendering animasi Seedance 3D untuk iklan komersial, klip musik, dan teaser film.',
      episodes: [],
      resources: []
    }
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }
  console.log(`✅ Seeded ${courses.length} courses.`);

  // 3. Seed Prompts
  console.log('🌱 Seeding Prompt Packs...');
  const prompts = [
    {
      title: 'UGC Product Review - Skincare',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      category: 'UGC',
      aiModel: 'Omni Flash',
      usageCount: 12400,
      isNew: true,
      isPopular: true,
      difficulty: 'Mudah',
      aspectRatio: '9:16',
      tags: ['Skincare', 'UGC', 'TikTok Ads', 'Realism'],
      promptText: 'Cinematic 9:16 portrait of a young Indonesian woman holding a serum glass bottle in a modern minimalist bathroom, soft morning sunlight through frosted window, natural skin texture, bokeh background, 8k resolution, photorealistic, shallow depth of field --ar 9:16 --v 6.0',
      negativePrompt: 'blurry, oversaturated, deformed hands, plastic skin, bad anatomy, low quality, noise',
      cameraSettings: 'Lens 85mm f/1.4, ISO 100, Shutter Speed 1/250s, Eye Auto-Focus',
      lighting: 'Soft Natural Morning Window Light + White Reflector Fill',
      motion: 'Slow subtle zoom in towards product bottle (0.2x speed)',
      voice: 'Indonesian Female Energetic Warm Tone (ElevenLabs ID-Sarah-v2)',
      environment: 'Modern Scandinavian White Marble Bathroom',
      tips: [
        'Gunakan seed yang sama untuk kontinuitas ekspresi wajah.',
        'Sangat disarankan memakai aspect ratio 9:16 untuk Reels/TikTok Ads.'
      ],
      author: 'FIKSI Team'
    },
    {
      title: 'Fashion Try-On - Streetwear',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      category: 'Product',
      aiModel: 'Nano Banana',
      usageCount: 9800,
      isNew: true,
      isPopular: true,
      difficulty: 'Sedang',
      aspectRatio: '9:16',
      tags: ['Fashion', 'OOTD', 'Streetwear', 'Tokyo Style'],
      promptText: 'Full body shot of male model wearing oversize vintage black hoodie with futuristic cyberpunk holographic embroidery, Shibuya crossing Tokyo backdrop at blue hour, wet neon reflections, shot on Hasselblad H6D-100c --ar 9:16',
      negativePrompt: 'overexposed, blurry logo, low-res texture, bad proportion',
      cameraSettings: '50mm f/1.8, ISO 400, Cinematic Motion Blur',
      lighting: 'Ambient Neon City Light with Cyan & Violet Rim Light',
      motion: 'Camera tracking forward, model walking towards camera',
      environment: 'Tokyo Shibuya Pedestrian Crossing at Rain Evening',
      tips: ['Bisa ganti warna hoodie dengan mengubah keyword "black" menjadi warna impian.'],
      author: 'Heisy'
    },
    {
      title: 'Cinematic B-Roll - Coffee Shop',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
      category: 'Camera',
      aiModel: 'Kling AI',
      usageCount: 8700,
      isPopular: true,
      difficulty: 'Ahli',
      aspectRatio: '16:9',
      tags: ['B-Roll', 'Coffee', 'Atmosphere', '4K'],
      promptText: 'Extreme close up micro shot of hot dark espresso pouring smoothly into a ceramic white cup, steam rising softly, dramatic moody side lighting, golden ratio composition, 120fps slow motion --ar 16:9',
      negativePrompt: 'splash artifact, unnatural steam, jitter, frame drops',
      cameraSettings: 'Macro 100mm f/2.8, 120fps Slow-Mo',
      lighting: 'Single Warm Tungsten Spotlight from Left 45 degree',
      motion: 'Liquid pouring motion with particle steam animation',
      environment: 'Dark Rustic Wooden Barista Counter',
      author: 'Rian Antigravity'
    },
    {
      title: 'AI Character Portrait - Cyber Neon',
      thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      category: 'Character',
      aiModel: 'Midjourney v6',
      usageCount: 15400,
      isPopular: true,
      difficulty: 'Sedang',
      aspectRatio: '1:1',
      tags: ['Cyberpunk', 'Character', 'Portrait', 'Glow'],
      promptText: 'Detailed headshot of futuristic female cyborg, glowing translucent circuitry lines on cheeks, violet neon eyes, dark slicked back hair, sharp focus, 8k Unreal Engine 5 render style --ar 1:1 --stylize 250',
      negativePrompt: 'cartoon, drawing, anime style, flat color, low contrast',
      cameraSettings: 'Portrait 85mm f/1.2, ISO 50',
      lighting: 'Bi-color Neon (Purple & Electric Blue)',
      environment: 'Sci-fi Studio Darkness',
      author: 'FIKSI Team'
    },
    {
      title: 'Interior Design - Japandi Living Room',
      thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      category: 'Lighting',
      aiModel: 'Flux.1 Pro',
      usageCount: 6200,
      isNew: false,
      difficulty: 'Mudah',
      aspectRatio: '16:9',
      tags: ['Interior', 'Architecture', 'Japandi', 'Minimalist'],
      promptText: 'Architectural digest photograph of modern Japandi style living room with light oak wood panelling, beige linen sofa, large Monstera plant in terracotta pot, sunbeams filtering through bamboo blinds, photorealistic interior design --ar 16:9',
      negativePrompt: 'cluttered, dark, distorted furniture, cartoonish',
      cameraSettings: '24mm Wide Angle architectural lens, Tilt-shift',
      lighting: 'Soft diffused natural sunlight with dust particles',
      environment: 'Luxury Urban Penthouse',
      author: 'Studio Zero'
    },
    {
      title: 'Product Showcase - 15s Commercial',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      category: 'Storyboard',
      aiModel: 'Omni Flash',
      usageCount: 11300,
      isPopular: true,
      difficulty: 'Ahli',
      aspectRatio: '16:9',
      tags: ['Watch', 'Luxury', 'Commercial', 'Product'],
      promptText: '3D luxury smartwatch floating in zero gravity surrounded by metallic chrome liquid droplets, smooth metallic surface reflections, dark gradient backdrop, high key studio rim light --ar 16:9',
      negativePrompt: 'cheap plastic texture, low detail, noise, static',
      cameraSettings: '360 Orbital Camera Rotation',
      lighting: 'Studio 3-Point softbox lighting + Rim light',
      motion: 'Slow 360 degree product spin with floating liquid effect',
      author: 'FIKSI Team'
    }
  ];

  for (const prompt of prompts) {
    const existing = await prisma.promptPack.findFirst({ where: { title: prompt.title } });
    if (!existing) {
      await prisma.promptPack.create({ data: prompt });
    }
  }
  console.log(`✅ Seeded ${prompts.length} prompt packs.`);

  // 4. Seed Assets
  console.log('🌱 Seeding Download Assets...');
  const assets = [
    {
      title: 'Cinematic Color LUTs Pack (15 Presets)',
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80',
      format: 'LUT',
      size: '24.5 MB',
      category: 'Color Grading',
      downloadsCount: 1420,
      tags: ['CUBE', 'Premiere', 'DaVinci', 'LUT'],
      fileUrl: '#',
      isPremium: true
    },
    {
      title: 'Futuristic HUD & UI Overlay PNG Pack',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      format: 'PNG',
      size: '112.0 MB',
      category: 'Graphic Overlay',
      downloadsCount: 2890,
      tags: ['PNG', 'Transparent', 'Sci-fi', 'HUD'],
      fileUrl: '#',
      isPremium: false
    },
    {
      title: 'AI Storyboard Grid PSD Template',
      thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31216994c4?auto=format&fit=crop&w=600&q=80',
      format: 'PSD',
      size: '45.8 MB',
      category: 'Templates',
      downloadsCount: 950,
      tags: ['Photoshop', 'PSD', 'Storyboard', 'Grid'],
      fileUrl: '#',
      isPremium: true
    },
    {
      title: 'Character Consistency Sheet & Turnaround Mockup',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      format: 'Mockups',
      size: '88.4 MB',
      category: 'Character Design',
      downloadsCount: 3100,
      tags: ['Character Sheet', 'Turnaround', 'Mockup'],
      fileUrl: '#',
      isPremium: true
    }
  ];

  for (const asset of assets) {
    const existing = await prisma.downloadAsset.findFirst({ where: { title: asset.title } });
    if (!existing) {
      await prisma.downloadAsset.create({ data: asset });
    }
  }
  console.log(`✅ Seeded ${assets.length} creative assets.`);

  // 5. Seed Weekly Updates
  console.log('🌱 Seeding Weekly Updates...');
  const updates = [
    {
      version: 'v1.8',
      date: '20 Mei 2025',
      title: 'Update Mingguan FIKSI AI Academy v1.8',
      highlights: [
        '+ 35 Prompt Baru untuk Omni Flash & Nano Banana',
        '+ Tutorial Seedance Motion Animation Masterclass',
        '+ Template Storyboard PSD Baru Siap Download'
      ]
    },
    {
      version: 'v1.7',
      date: '12 Mei 2025',
      title: 'Update Mingguan FIKSI AI Academy v1.7',
      highlights: [
        '+ Fitur Instant Copy Prompt dengan 1-Klik',
        '+ Integration Filter Model AI Kling & Flux.1',
        '+ Pembaharuan Player Masterclass 4K'
      ]
    }
  ];

  for (const update of updates) {
    const existing = await prisma.weeklyUpdate.findFirst({ where: { version: update.version } });
    if (!existing) {
      await prisma.weeklyUpdate.create({ data: update });
    }
  }
  console.log(`✅ Seeded ${updates.length} weekly updates.`);

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
