import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, PromptPack, DownloadAsset, UserProfile, UserRole, Episode, ResourceItem, QRISPaymentTransaction, ExternalTool } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Sparkles, 
  GraduationCap, 
  FolderDown, 
  Wrench,
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  FileText,
  RotateCcw,
  Check,
  X,
  SlidersHorizontal,
  Flame,
  Crown,
  QrCode,
  CreditCard,
  Clock,
  XCircle,
  DollarSign,
  Wallet,
  ArrowUpRight,
  Cpu,
  Download,
  RefreshCw
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const PRESET_AI_MODELS = [
  // Image Generation
  'Omni Flash',
  'Nano Banana',
  'Midjourney v6',
  'Midjourney v5.2',
  'Flux.1 Pro',
  'Flux.1 Schnell',
  'Flux.1 Dev',
  'Stable Diffusion 3.5',
  'SDXL Turbo',
  'DALL-E 3',
  'Ideogram 2.0',
  'Leonardo AI',
  'Recraft V3',
  // Video Generation
  'Kling AI',
  'Kling 1.5',
  'Luma Dream Machine',
  'Runway Gen-3',
  'Hailuo / Minimax',
  'OpenAI Sora',
  'Pika 2.0',
  'Veed AI',
  'Viggle AI',
  // LLM & Multimodal
  'ChatGPT / GPT-4o',
  'Claude 3.5 Sonnet',
  'Google Gemini 1.5 Pro',
  'DeepSeek R1'
];

export const DEFAULT_EPISODE_ARTICLE_TEMPLATE = `# Panduan & Rangkuman Materi Pembelajaran

Selamat datang di materi episode ini! Gunakan rangkuman dan panduan langkah demi langkah di bawah ini untuk mempraktikkan isi video.

---

### 📌 Langkah 1 — Pembuatan Prompt di Gemini / ChatGPT
Mulai dengan membuat prompt deskripsi subjek dan karakter yang mendalam:

> **💡 Formula Prompt Utama:**  
> \`Indonesian young creator, 24 years old, natural warm smile, glowing glass skin, wavy dark brown hair, wearing casual modern batik blazer, soft indoor natural lighting, captured on 85mm lens, f/1.8, 8k realism --ar 16:9\`

**Poin-poin penting:**
- Tentukan detail subjek (usia, etnis, ekspresi wajah, pakaian).
- Tentukan pencahayaan (volumetric rim light / cinematic golden hour).
- Tentukan resolusi dan rasio aspek yang diinginkan.

---

### 📌 Langkah 2 — Generate Visual di Engine AI
1. Buka workspace AI Generator lalu buat render karakter utama.
2. Kunci nomor Seed (Seed Locking) agar proporsi anatomi tidak berubah di pose lain.
3. Simpan render master beresolusi tinggi (4K).

---

### 📌 Langkah 3 — Video Motion & Editing
- Gunakan setting pergerakan kamera halus (Subtle Zoom atau Pan).
- Atur motion scale antara 3 - 5 agar struktur wajah stabil.
- Tambahkan negative prompt untuk menghindari artefak.

---

### 💡 Pro Tips & Rekomendasi
- Selalu uji coba prompt dengan resolusi standar sebelum melakukan upscaling final.
- Simpan prompt favorit ke Prompt Library untuk digunakan kembali.`;

export const AdminDashboard: React.FC = () => {
  const { 
    courses, 
    addCourse, 
    updateCourse, 
    deleteCourse,
    prompts, 
    addPrompt, 
    updatePrompt, 
    deletePrompt,
    assets, 
    addAsset, 
    updateAsset, 
    deleteAsset,
    externalTools,
    addExternalTool,
    updateExternalTool,
    deleteExternalTool,
    usersList,
    updateUserRole,
    updateUserTier,
    deleteUser,
    refreshUsers,
    paymentTransactions,
    approveQRISPayment,
    rejectQRISPayment,
    currentUser,
    navigateTo,
    showToast,
    resetDataToDefaults
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'prompts' | 'assets' | 'tools' | 'users' | 'transactions' | 'tier-matrix' | 'analytics'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [trxFilter, setTrxFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);

  // Course Modal States
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    subtitle: '',
    thumbnail: '',
    bannerImage: '',
    category: 'AI Video & Visual',
    level: 'Menengah' as 'Pemula' | 'Menengah' | 'Lanjutan',
    instructorName: 'Rian Antigravity',
    instructorRole: 'Lead AI Creative Director',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    description: '',
    episodes: [] as Episode[],
    resources: [] as ResourceItem[]
  });

  // Episode Sub-form State
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpDuration, setNewEpDuration] = useState('15:00');
  const [newEpVideoUrl, setNewEpVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [newEpDescription, setNewEpDescription] = useState('');
  const [newEpTopics, setNewEpTopics] = useState('Prompt Karakter, Parameter AI, Motion Video');
  const [newEpArticle, setNewEpArticle] = useState('');
  const [showEpArticleInput, setShowEpArticleInput] = useState(false);

  // Resource Sub-form State
  const [newResTitle, setNewResTitle] = useState('');
  const [newResType, setNewResType] = useState('PDF');
  const [newResSize, setNewResSize] = useState('2.5 MB');
  const [newResUrl, setNewResUrl] = useState('');

  // Prompt Modal States
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [isCustomAiModel, setIsCustomAiModel] = useState(false);
  const [customAiModelInput, setCustomAiModelInput] = useState('');
  const [promptForm, setPromptForm] = useState({
    title: '',
    thumbnail: '',
    category: 'UGC' as PromptPack['category'],
    aiModel: 'Omni Flash' as PromptPack['aiModel'],
    difficulty: 'Mudah' as PromptPack['difficulty'],
    aspectRatio: '16:9' as PromptPack['aspectRatio'],
    promptText: '',
    negativePrompt: '',
    cameraSettings: '',
    lighting: '',
    motion: '',
    environment: '',
    voice: '',
    tipsString: '',
    tagsString: 'AI, UGC, Ads',
    author: 'FIKSI Team',
    isPremium: false
  });

  const existingCustomModels = useMemo(() => {
    const knownSet = new Set(PRESET_AI_MODELS);
    const customList = prompts
      .map(p => p.aiModel)
      .filter(m => m && !knownSet.has(m));
    return Array.from(new Set(customList));
  }, [prompts]);

  // Asset Modal States
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({
    title: '',
    thumbnail: '',
    format: 'PSD',
    size: '45.0 MB',
    category: 'Templates',
    tagsString: 'PSD, Template, Graphic',
    fileUrl: '#',
    isPremium: true
  });

  // External Tool Modal States
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    url: '',
    category: 'Image Gen' as ExternalTool['category'],
    pricingType: 'Freemium' as ExternalTool['pricingType'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: '',
    tagsString: 'AI, Creative, Tool',
    isPremium: false,
    isFeatured: false
  });

  // Reset/Pre-fill Handlers
  const handleOpenAddTool = () => {
    setEditingToolId(null);
    setToolForm({
      name: '',
      url: '',
      category: 'Image Gen',
      pricingType: 'Freemium',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      description: 'Platform software AI untuk mempercepat produksi kreatif.',
      tagsString: 'AI, Creative, Generator',
      isPremium: false,
      isFeatured: false
    });
    setToolModalOpen(true);
  };

  const handleOpenEditTool = (tool: ExternalTool) => {
    setEditingToolId(tool.id);
    setToolForm({
      name: tool.name,
      url: tool.url,
      category: tool.category,
      pricingType: tool.pricingType,
      thumbnail: tool.thumbnail,
      description: tool.description,
      tagsString: tool.tags ? tool.tags.join(', ') : '',
      isPremium: !!tool.isPremium,
      isFeatured: !!tool.isFeatured
    });
    setToolModalOpen(true);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.name.trim() || !toolForm.url.trim()) {
      showToast('warning', 'Nama & URL Wajib', 'Silakan isi nama dan URL website tool.');
      return;
    }

    const tags = toolForm.tagsString.split(',').map(t => t.trim()).filter(Boolean);
    const toolPayload = {
      name: toolForm.name,
      url: toolForm.url,
      category: toolForm.category,
      pricingType: toolForm.pricingType,
      thumbnail: toolForm.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      description: toolForm.description,
      tags,
      isPremium: toolForm.isPremium,
      isFeatured: toolForm.isFeatured
    };

    if (editingToolId) {
      updateExternalTool(editingToolId, toolPayload);
    } else {
      addExternalTool(toolPayload);
    }
    setToolModalOpen(false);
  };

  const handleOpenAddCourse = () => {
    setEditingCourseId(null);
    setCourseForm({
      title: '',
      subtitle: '',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      category: 'AI Video & Visual',
      level: 'Menengah',
      instructorName: currentUser?.name || 'Rian Antigravity',
      instructorRole: 'Lead AI Creative Director',
      instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      description: 'Deskripsi lengkap kursus dan kurikulum materi AI.',
      episodes: [
        {
          id: 'ep-1',
          title: 'Episode 1: Pengenalan & Workspace Setup',
          duration: '12:30',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'Pengenalan materi dasar dan instalasi tools AI.',
          keyTopics: ['Setup Dasar', 'Arsitektur AI', 'Prompt Dasar']
        }
      ],
      resources: [
        { title: 'Cheatsheet PDF', type: 'PDF', size: '2.5 MB', downloadUrl: '#' }
      ]
    });
    setCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      subtitle: course.subtitle,
      thumbnail: course.thumbnail,
      bannerImage: course.bannerImage,
      category: course.category,
      level: course.level,
      instructorName: course.instructor.name,
      instructorRole: course.instructor.role,
      instructorAvatar: course.instructor.avatar,
      description: course.description,
      episodes: course.episodes || [],
      resources: course.resources || []
    });
    setCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      showToast('warning', 'Judul Wajib', 'Silakan isi judul kursus.');
      return;
    }

    const coursePayload = {
      title: courseForm.title,
      subtitle: courseForm.subtitle,
      thumbnail: courseForm.thumbnail,
      bannerImage: courseForm.bannerImage || courseForm.thumbnail,
      category: courseForm.category,
      level: courseForm.level,
      progressPercentage: 0,
      totalEpisodes: courseForm.episodes.length,
      completedEpisodes: 0,
      instructor: {
        name: courseForm.instructorName,
        avatar: courseForm.instructorAvatar,
        role: courseForm.instructorRole
      },
      episodes: courseForm.episodes,
      resources: courseForm.resources,
      description: courseForm.description,
      isPublished: true
    };

    if (editingCourseId) {
      updateCourse(editingCourseId, coursePayload);
    } else {
      addCourse(coursePayload);
    }

    setCourseModalOpen(false);
  };

  const handleAddEpisodeToForm = () => {
    if (!newEpTitle.trim()) {
      showToast('warning', 'Judul Wajib', 'Silakan masukkan judul episode.');
      return;
    }
    const topics = newEpTopics.split(',').map(t => t.trim()).filter(Boolean);
    const ep: Episode = {
      id: `ep-${Date.now()}`,
      title: newEpTitle.trim(),
      duration: newEpDuration.trim() || '15:00',
      completed: false,
      videoUrl: newEpVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: newEpDescription.trim() || 'Materi video pembelajaran komprehensif.',
      keyTopics: topics.length > 0 ? topics : ['Materi Utama', 'Praktik Langsung'],
      articleContent: newEpArticle.trim() || undefined
    };
    setCourseForm(prev => ({ ...prev, episodes: [...prev.episodes, ep] }));
    setNewEpTitle('');
    setNewEpDescription('');
    setNewEpArticle('');
    setShowEpArticleInput(false);
    showToast('success', 'Episode Ditambahkan', `"${ep.title}" ditambahkan ke draft kursus.`);
  };

  const handleAddResourceToForm = () => {
    if (!newResTitle.trim()) {
      showToast('warning', 'Judul Resource Wajib', 'Silakan masukkan nama resource/file.');
      return;
    }
    const res: ResourceItem = {
      title: newResTitle.trim(),
      type: newResType,
      size: newResSize.trim() || '1.0 MB',
      downloadUrl: newResUrl.trim() || '#'
    };
    setCourseForm(prev => ({ ...prev, resources: [...prev.resources, res] }));
    setNewResTitle('');
    setNewResUrl('');
    showToast('success', 'Resource Ditambahkan', `"${res.title}" siap diunduh oleh member.`);
  };

  const handleRemoveResourceFromForm = (idx: number) => {
    setCourseForm(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== idx)
    }));
    showToast('info', 'Resource Dihapus', 'File resource telah dihapus dari kursus.');
  };

  // Prompt Handlers
  const handleOpenAddPrompt = () => {
    setEditingPromptId(null);
    setIsCustomAiModel(false);
    setCustomAiModelInput('');
    setPromptForm({
      title: '',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      category: 'Character',
      aiModel: 'Omni Flash',
      difficulty: 'Mudah',
      aspectRatio: '16:9',
      promptText: '',
      negativePrompt: 'blurry, distorted, ugly, low-res',
      cameraSettings: '85mm f/1.4, ISO 100',
      lighting: 'Volumetric Soft Studio Lighting',
      motion: 'Subtle cinematic slow zoom',
      environment: 'Modern Studio Backdrop',
      voice: 'Indonesian Female Warm Tone',
      tipsString: 'Gunakan seed konsisten, Tingkatkan resolution ke 4K',
      tagsString: 'Character, Realism, 8K',
      author: currentUser?.name || 'Admin FIKSI',
      isPremium: false
    });
    setPromptModalOpen(true);
  };

  const handleOpenEditPrompt = (prompt: PromptPack) => {
    setEditingPromptId(prompt.id);
    const isPreset = PRESET_AI_MODELS.includes(prompt.aiModel);
    setIsCustomAiModel(!isPreset && Boolean(prompt.aiModel));
    setCustomAiModelInput(!isPreset ? prompt.aiModel : '');
    setPromptForm({
      title: prompt.title,
      thumbnail: prompt.thumbnail,
      category: prompt.category,
      aiModel: prompt.aiModel,
      difficulty: prompt.difficulty,
      aspectRatio: prompt.aspectRatio,
      promptText: prompt.promptText,
      negativePrompt: prompt.negativePrompt || '',
      cameraSettings: prompt.cameraSettings || '',
      lighting: prompt.lighting || '',
      motion: prompt.motion || '',
      environment: prompt.environment || '',
      voice: prompt.voice || '',
      tipsString: (prompt.tips || []).join(', '),
      tagsString: prompt.tags.join(', '),
      author: prompt.author,
      isPremium: !!prompt.isPremium
    });
    setPromptModalOpen(true);
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title.trim() || !promptForm.promptText.trim()) {
      showToast('warning', 'Data Belum Lengkap', 'Judul dan Formula Prompt wajib diisi.');
      return;
    }

    const selectedOrCustomModel = isCustomAiModel
      ? (customAiModelInput.trim() || 'Custom AI')
      : (promptForm.aiModel || 'Omni Flash');

    const tags = promptForm.tagsString.split(',').map(t => t.trim()).filter(Boolean);
    const tips = promptForm.tipsString.split(',').map(t => t.trim()).filter(Boolean);

    const promptPayload = {
      title: promptForm.title,
      thumbnail: promptForm.thumbnail,
      category: promptForm.category,
      aiModel: selectedOrCustomModel,
      usageCount: editingPromptId ? undefined : 0,
      difficulty: promptForm.difficulty,
      aspectRatio: promptForm.aspectRatio,
      tags,
      promptText: promptForm.promptText,
      negativePrompt: promptForm.negativePrompt,
      cameraSettings: promptForm.cameraSettings,
      lighting: promptForm.lighting,
      motion: promptForm.motion,
      environment: promptForm.environment,
      voice: promptForm.voice,
      tips: tips.length > 0 ? tips : undefined,
      author: promptForm.author,
      isPremium: promptForm.isPremium,
      isPublished: true
    };

    if (editingPromptId) {
      updatePrompt(editingPromptId, promptPayload as Partial<PromptPack>);
    } else {
      addPrompt(promptPayload as Omit<PromptPack, 'id'>);
    }
    setPromptModalOpen(false);
  };

  // Asset Handlers
  const handleOpenAddAsset = () => {
    setEditingAssetId(null);
    setAssetForm({
      title: '',
      thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31216994c4?auto=format&fit=crop&w=600&q=80',
      format: 'PSD',
      size: '48.5 MB',
      category: 'Templates',
      tagsString: 'PSD, Grid, Storyboard',
      fileUrl: '#',
      isPremium: true
    });
    setAssetModalOpen(true);
  };

  const handleOpenEditAsset = (asset: DownloadAsset) => {
    setEditingAssetId(asset.id);
    setAssetForm({
      title: asset.title,
      thumbnail: asset.thumbnail,
      format: asset.format,
      size: asset.size,
      category: asset.category,
      tagsString: asset.tags.join(', '),
      fileUrl: asset.fileUrl,
      isPremium: asset.isPremium
    });
    setAssetModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetForm.title.trim()) {
      showToast('warning', 'Judul Wajib', 'Silakan isi judul asset.');
      return;
    }

    const tags = assetForm.tagsString.split(',').map(t => t.trim()).filter(Boolean);
    const assetPayload = {
      title: assetForm.title,
      thumbnail: assetForm.thumbnail,
      format: assetForm.format,
      size: assetForm.size,
      category: assetForm.category,
      tags,
      fileUrl: assetForm.fileUrl,
      isPremium: assetForm.isPremium,
      isPublished: true,
      downloadsCount: 0
    };

    if (editingAssetId) {
      updateAsset(editingAssetId, assetPayload);
    } else {
      addAsset(assetPayload);
    }
    setAssetModalOpen(false);
  };

  // Filtered lists
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPrompts = prompts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAssets = assets.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTools = externalTools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const pendingTrxCount = paymentTransactions.filter(t => t.status === 'Pending').length;
  const approvedTrxCount = paymentTransactions.filter(t => t.status === 'Approved').length;
  const totalTrxRevenue = paymentTransactions
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const filteredTransactions = paymentTransactions.filter(t => {
    const matchesSearch = (t.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.qrisRef || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.planName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = trxFilter === 'all' ? true : t.status === trxFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Admin Portal Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-accent-purple/20 via-accent-blue/10 to-transparent border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center text-white shadow-xl shadow-accent-purple/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">CMS ADMINISTRATOR PORTAL</Badge>
              <span className="text-xs text-slate-400 font-mono">Real-time Public Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Admin Content & Member Tier Management
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Login sebagai: <strong className="text-accent-cyan">{currentUser?.name}</strong> ({currentUser?.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetDataToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
            title="Kembalikan data contoh awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          {activeTab === 'courses' && (
            <GradientButton size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddCourse}>
              Tambah Kursus
            </GradientButton>
          )}

          {activeTab === 'prompts' && (
            <GradientButton id="admin-btn-add-prompt" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddPrompt}>
              Tambah Prompt
            </GradientButton>
          )}

          {activeTab === 'assets' && (
            <GradientButton id="admin-btn-add-asset" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddAsset}>
              Tambah Asset
            </GradientButton>
          )}

          {activeTab === 'tools' && (
            <GradientButton id="admin-btn-add-tool" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddTool}>
              Tambah Tool
            </GradientButton>
          )}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-accent-cyan" />
            Total Kursus Live
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{courses.length} Kursus</span>
            <span className="text-[10px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full font-bold">Public</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-pink" />
            Formula Prompt
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{prompts.length} Prompt</span>
            <span className="text-[10px] text-accent-pink bg-accent-pink/10 px-2 py-0.5 rounded-full font-bold">Live Feed</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <FolderDown className="w-4 h-4 text-accent-purple" />
            Asset Downloadable
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{assets.length} Files</span>
            <span className="text-[10px] text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full font-bold">PSD/LUT/PNG</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-400" />
            Transaksi QRIS Masuk
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{paymentTransactions.length} Transaksi</span>
            {pendingTrxCount > 0 ? (
              <span className="text-[10px] text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full font-black animate-pulse">
                {pendingTrxCount} Pending
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">Semua Aman</span>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'courses' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Masterclass ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'prompts' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Prompts ({prompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'assets' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>Assets ({assets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tools' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>AI Tools ({externalTools.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'users' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Atur Tier Member ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 relative ${
              activeTab === 'transactions' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Pembayaran QRIS ({paymentTransactions.length})</span>
            {pendingTrxCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                {pendingTrxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tier-matrix')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tier-matrix' ? 'bg-gradient-accent text-white shadow-md' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Matriks Akses Free vs Pro</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari konten di CMS..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
          />
        </div>
      </div>

      {/* TAB CONTENT: COURSES CMS */}
      {activeTab === 'courses' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <GlassCard key={c.id} hoverable className="p-4 flex flex-col justify-between gap-4 group">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <Badge variant="cyan" size="sm">{c.level}</Badge>
                      <Badge variant="dark" size="sm">{c.category}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-white line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                    <span>{c.episodes?.length || c.totalEpisodes || 0} Episode Materi</span>
                    <span>Instruktur: <strong className="text-white">{c.instructor.name}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    onClick={() => navigateTo('course-detail', c.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-accent-blue/20 hover:text-accent-cyan text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Publik</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditCourse(c)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Kursus"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus kursus "${c.title}"?`)) {
                          deleteCourse(c.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Hapus Kursus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROMPTS CMS */}
      {activeTab === 'prompts' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p) => (
              <GlassCard key={p.id} hoverable className="p-4 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                      <Badge variant="purple" size="sm">{p.aiModel}</Badge>
                      <Badge variant="dark" size="sm">{p.aspectRatio}</Badge>
                    </div>

                    {p.isPremium && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="pro" size="sm" icon={<Crown className="w-3 h-3" />}>
                          Pro VIP
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-white/[0.02] p-2 rounded-xl">
                      {p.promptText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-slate-400">By: <strong className="text-slate-200">{p.author}</strong></span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updatePrompt(p.id, { isPremium: !p.isPremium });
                        showToast('success', 'Akses Diperbarui', `Prompt "${p.title}" diubah ke ${!p.isPremium ? 'Pro VIP' : 'Free Member'}.`);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        p.isPremium 
                          ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/30 hover:bg-accent-purple/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                      title="Klik untuk ubah tier akses"
                    >
                      {p.isPremium ? '👑 Pro VIP' : '🟢 Free'}
                    </button>

                    <button
                      onClick={() => handleOpenEditPrompt(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Prompt"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus prompt "${p.title}"?`)) {
                          deletePrompt(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Hapus Prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ASSETS CMS */}
      {activeTab === 'assets' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAssets.map((a) => (
              <GlassCard key={a.id} hoverable className="p-4 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <Badge variant="purple" size="sm">{a.format}</Badge>
                      {a.isPremium && <Badge variant="pro" size="sm">PRO</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{a.title}</h3>
                    <span className="text-[11px] text-slate-400">Ukuran: {a.size} • {a.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleOpenEditAsset(a)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Edit Asset"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus aset "${a.title}"?`)) {
                        deleteAsset(a.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Hapus Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: KELOLA TOOLS EKSTERNAL */}
      {activeTab === 'tools' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Tools AI Eksternal ({filteredTools.length})</h3>
                <p className="text-[11px] text-slate-400">Kelola tautan website tools AI, kategori, model harga, dan hak akses tier member.</p>
              </div>
            </div>

            <GradientButton size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAddTool}>
              + Tambah Tool Baru
            </GradientButton>
          </div>

          {filteredTools.length === 0 ? (
            <GlassCard className="p-8 text-center text-slate-400 text-xs">
              Belum ada tool eksternal ditemukan. Tekan tombol Tambah Tool Baru untuk menerbitkan.
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <GlassCard key={tool.id} hoverable className="p-4 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#060816]">
                      <img src={tool.thumbnail} alt={tool.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                        <Badge variant="cyan" size="sm">{tool.category}</Badge>
                        <Badge variant="dark" size="sm">{tool.pricingType}</Badge>
                      </div>

                      {tool.isPremium && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="pro" size="sm">Pro VIP</Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{tool.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tool.tags && tool.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-accent-cyan hover:bg-accent-cyan/10 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Buka Website Tool"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateExternalTool(tool.id, { isPremium: !tool.isPremium });
                          showToast('success', 'Akses Diperbarui', `Tool "${tool.name}" diubah ke ${!tool.isPremium ? 'Pro VIP' : 'Free Member'}.`);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          tool.isPremium 
                            ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/30 hover:bg-accent-purple/30' 
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                        title="Klik untuk ubah tier akses"
                      >
                        {tool.isPremium ? '👑 Pro VIP' : '🟢 Free'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditTool(tool)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Edit Tool"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus tool "${tool.name}" dari direktori?`)) {
                            deleteExternalTool(tool.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Hapus Tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ATUR TIER MEMBER (USERS CMS) */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Crown className="w-4 h-4 text-violet-400" />
              <span>Admin dapat mengatur Role, Masa Berlaku (*Valid Until*), dan Status setiap member secara *real-time*.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isRefreshingUsers}
                onClick={async () => {
                  setIsRefreshingUsers(true);
                  await refreshUsers();
                  setIsRefreshingUsers(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all disabled:opacity-50 hover:border-violet-500/50 shadow-sm"
                title="Sinkronkan data user langsung dari MongoDB Atlas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingUsers ? 'animate-spin' : ''}`} />
                <span>{isRefreshingUsers ? 'Menyinkronkan...' : 'Refresh Database User'}</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">Total: {filteredUsers.length} Member</span>
            </div>
          </div>

          <GlassCard className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">User & Profil</th>
                  <th className="pb-3">Email Akun</th>
                  <th className="pb-3">Tier Role</th>
                  <th className="pb-3">Masa Berlaku</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Quick Upgrade</th>
                  <th className="pb-3 text-right">Ubah Tier / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredUsers.map(u => (
                  <tr key={u.id || u.email} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10" />
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">Join: {u.joinedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5">
                      <Badge variant={u.role === 'Admin' ? 'purple' : u.role === 'Pro Member' ? 'pro' : 'outline'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={u.validUntil || 'Free Tier'}
                        onChange={(e) => updateUserTier(u.id || u.email, u.role, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-[#060816] border border-white/10 text-[11px] font-medium text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="Free Tier" className="bg-[#101827]">Free Tier</option>
                        <option value="1 Tahun (17 Agu 2027)" className="bg-[#101827]">1 Tahun (17 Agu 2027)</option>
                        <option value="6 Bulan" className="bg-[#101827]">6 Bulan</option>
                        <option value="1 Bulan" className="bg-[#101827]">1 Bulan</option>
                        <option value="Lifetime VIP" className="bg-[#101827]">Lifetime VIP</option>
                      </select>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={u.status || 'Aktif'}
                        onChange={(e) => updateUserTier(u.id || u.email, u.role, u.validUntil, e.target.value)}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${
                          u.status === 'Suspended' 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        <option value="Aktif" className="bg-[#101827] text-emerald-400">Aktif</option>
                        <option value="Review" className="bg-[#101827] text-amber-400">Review</option>
                        <option value="Suspended" className="bg-[#101827] text-rose-400">Suspended</option>
                      </select>
                    </td>
                    <td className="py-3.5">
                      {u.role !== 'Admin' && (
                        <div className="flex items-center gap-1.5">
                          {u.role !== 'Pro Member' ? (
                            <button
                              type="button"
                              onClick={() => updateUserTier(u.id || u.email, 'Pro Member', 'Lifetime VIP', 'Aktif')}
                              className="px-2 py-1 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 hover:from-accent-purple/30 hover:to-accent-cyan/30 text-accent-cyan border border-accent-cyan/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                              title="Upgrade instan ke Pro Member Lifetime"
                            >
                              <Crown className="w-3 h-3" />
                              <span>Set Pro VIP</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateUserTier(u.id || u.email, 'Free Member', 'Free Tier', 'Aktif')}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-medium transition-all"
                              title="Turunkan ke Free Tier"
                            >
                              <span>Set Free</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value as UserRole;
                            updateUserTier(u.id || u.email, newRole, newRole === 'Admin' ? 'Lifetime VIP' : newRole === 'Pro Member' ? '1 Tahun' : 'Free Tier');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#060816] border border-white/10 text-xs font-bold text-accent-cyan focus:outline-none cursor-pointer"
                        >
                          <option value="Admin" className="bg-[#101827]">Admin</option>
                          <option value="Pro Member" className="bg-[#101827]">Pro Member</option>
                          <option value="Free Member" className="bg-[#101827]">Free Member</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus akun pengguna "${u.name}"?`)) {
                              deleteUser(u.id || u.email);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: KELOLA TRANSAKSI & PEMBAYARAN QRIS */}
      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-5">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Transaksi Pembayaran QRIS</h3>
                <p className="text-[11px] text-slate-400">Verifikasi bukti transfer dan setujui upgrade tier member.</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060816] border border-white/10 text-xs">
              {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTrxFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    trxFilter === filter
                      ? 'bg-gradient-accent text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? `Semua (${paymentTransactions.length})` : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <GlassCard className="p-6 overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-2 text-slate-400">
                <QrCode className="w-10 h-10 text-slate-600 mb-1" />
                <p className="text-sm font-bold text-white">Tidak ada transaksi ditemukan</p>
                <p className="text-xs">Belum ada transaksi QRIS dengan filter yang dipilih.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3">Member & Akun</th>
                    <th className="pb-3">Paket Upgrade</th>
                    <th className="pb-3">Nominal Tagihan</th>
                    <th className="pb-3">Kode Ref QRIS</th>
                    <th className="pb-3">Waktu & Catatan</th>
                    <th className="pb-3">Bukti Bayar</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Verifikasi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xs">{trx.userName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{trx.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-accent-cyan block">{trx.planName}</span>
                        <span className="text-[10px] text-slate-400">Metode: QRIS Instant</span>
                      </td>
                      <td className="py-4 font-mono font-bold text-white text-sm">
                        {trx.formattedAmount}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-lg bg-[#060816] border border-white/10 font-mono text-[11px] text-slate-200">
                          {trx.qrisRef}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-slate-300 font-medium">{trx.createdAt}</span>
                          <span className="text-slate-500 text-[10px]">{trx.notes || 'Transfer QRIS'}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {trx.proofImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewProofUrl(trx.proofImage || null)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-accent-cyan border border-white/10 text-[11px] font-semibold transition-all group"
                          >
                            <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Lihat Bukti</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Tanpa screenshot</span>
                        )}
                      </td>
                      <td className="py-4">
                        {trx.status === 'Pending' && (
                          <Badge variant="amber" icon={<Clock className="w-3 h-3" />} size="sm">
                            Pending Approval
                          </Badge>
                        )}
                        {trx.status === 'Approved' && (
                          <Badge variant="green" icon={<CheckCircle2 className="w-3 h-3" />} size="sm">
                            Disetujui (Pro Aktif)
                          </Badge>
                        )}
                        {trx.status === 'Rejected' && (
                          <Badge variant="outline" icon={<XCircle className="w-3 h-3 text-rose-400" />} size="sm">
                            Ditolak
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {trx.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => approveQRISPayment(trx.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all active:scale-95"
                              title="Setujui dan otomatis upgrade member ke Pro"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui & Upgrade</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt('Alasan penolakan (opsional):', 'Bukti transfer tidak valid');
                                if (reason !== null) {
                                  rejectQRISPayment(trx.id, reason);
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Tolak Pembayaran"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Selesai diproses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: MATRIKS & MANAJEMEN AKSES FREE VS PRO TIER */}
      {activeTab === 'tier-matrix' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-accent-purple/20 via-accent-cyan/10 to-transparent border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center text-white shadow-xl shadow-accent-purple/30">
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white">Matriks Hak Akses Free Tier vs Pro Tier</h3>
                <p className="text-xs text-slate-300">
                  Kelola kemudahan akses konten secara instan dengan 1-klik toggle di bawah.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                {prompts.filter(p => !p.isPremium).length} Prompts Free
              </Badge>
              <Badge variant="purple" size="sm">
                {prompts.filter(p => p.isPremium).length} Prompts Pro
              </Badge>
            </div>
          </div>

          {/* Feature Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free Tier Features */}
            <GlassCard className="p-5 flex flex-col gap-4 border-slate-700/50">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400" />
                  <h4 className="text-base font-bold text-white">Free Member (Akun Dasar)</h4>
                </div>
                <Badge variant="outline" size="sm">Gratis Rp 0</Badge>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Akses episode pengenalan kursus (Overview / Intro)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Copy prompt formula yang bertanda <strong>[Free Access]</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download creative assets bertanda <strong>[Free]</strong></span>
                </li>
                <li className="flex items-center gap-2.5 opacity-60">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="line-through text-slate-400">Kustomisasi parameter lanjutan AI</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-60">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="line-through text-slate-400">Komunitas VIP Discord & 1-on-1 Mentoring</span>
                </li>
              </ul>
            </GlassCard>

            {/* Pro Tier Features */}
            <GlassCard glow className="p-5 flex flex-col gap-4 border-accent-cyan/40">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-accent-cyan" />
                  <h4 className="text-base font-bold text-white">Pro Member & VIP Creator</h4>
                </div>
                <Badge variant="pro" size="sm">Akses Tanpa Batas</Badge>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Akses 100% video materi seluruh Masterclass & Update</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Download & Copy seluruh 100+ formula prompt komersial</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Download semua aset grafis, PSD, LUT, dan 3D Pack</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Kustomisasi parameter generator tanpa terkunci</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Komunitas VIP Discord, Direct Mentoring & Commercial License</span>
                </li>
              </ul>
            </GlassCard>
          </div>

          {/* Quick 1-Click Access Toggles for Prompt Library */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">1-Klik Atur Akses Prompt Library</h4>
                <p className="text-xs text-slate-400">Klik tombol tier pada prompt untuk mengubah akses antara Free vs Pro secara instan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {prompts.map((p) => {
                const isPro = p.isPremium;
                return (
                  <div 
                    key={p.id} 
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white truncate">{p.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.aiModel} • {p.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updatePrompt(p.id, { isPremium: !isPro });
                        showToast('success', 'Akses Diperbarui', `Prompt "${p.title}" diubah menjadi ${!isPro ? 'Pro VIP' : 'Free Member'}.`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                        isPro 
                          ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/40 hover:bg-accent-purple/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                    >
                      {isPro ? <Crown className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      <span>{isPro ? '👑 Pro VIP' : '🟢 Free'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick 1-Click Access Toggles for Creative Assets */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">1-Klik Atur Akses Creative Assets</h4>
                <p className="text-xs text-slate-400">Klik tombol tier pada asset untuk mengatur izin download bagi Free Member vs Pro.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {assets.map((a) => {
                const isPro = a.isPremium;
                return (
                  <div 
                    key={a.id} 
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={a.thumbnail} alt={a.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white truncate">{a.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{a.format} • {a.size}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateAsset(a.id, { isPremium: !isPro });
                        showToast('success', 'Akses Diperbarui', `Asset "${a.title}" diubah menjadi ${!isPro ? 'Pro VIP' : 'Free Member'}.`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                        isPro 
                          ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/40 hover:bg-accent-purple/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                    >
                      {isPro ? <Crown className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      <span>{isPro ? '👑 Pro VIP' : '🟢 Free'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick 1-Click Access Toggles for AI Tools */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">1-Klik Atur Akses Direktori Tools AI</h4>
                <p className="text-xs text-slate-400">Tentukan tool AI mana yang dapat diakses publik atau dibatasi khusus Pro VIP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {externalTools.map((t) => {
                const isPro = t.isPremium;
                return (
                  <div 
                    key={t.id} 
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={t.thumbnail} alt={t.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white truncate">{t.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.category} • {t.pricingType}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateExternalTool(t.id, { isPremium: !isPro });
                        showToast('success', 'Akses Diperbarui', `Tool "${t.name}" diubah menjadi ${!isPro ? 'Pro VIP' : 'Free Member'}.`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                        isPro 
                          ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/40 hover:bg-accent-purple/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                    >
                      {isPro ? <Crown className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      <span>{isPro ? '👑 Pro VIP' : '🟢 Free'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>
      )}

      {/* MODAL: PROOF IMAGE PREVIEW */}
      <Modal isOpen={!!previewProofUrl} onClose={() => setPreviewProofUrl(null)} maxWidth="md">
        <div className="flex flex-col gap-4 p-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent-cyan" />
              <span>Bukti Pembayaran QRIS</span>
            </h3>
            <button
              onClick={() => setPreviewProofUrl(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center max-h-96">
            {previewProofUrl && (
              <img
                src={previewProofUrl}
                alt="Bukti Transfer QRIS"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="flex justify-end pt-1">
            <GradientButton size="sm" onClick={() => setPreviewProofUrl(null)}>
              Tutup Preview
            </GradientButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: ADD / EDIT COURSE */}
      <Modal isOpen={courseModalOpen} onClose={() => setCourseModalOpen(false)} maxWidth="2xl">
        <form onSubmit={handleSaveCourse} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white">
              {editingCourseId ? 'Edit Kursus Masterclass' : 'Tambah Kursus Masterclass Baru'}
            </h3>
            <span className="text-xs text-accent-cyan font-semibold">CMS Kursus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Judul Kursus *</label>
              <input
                type="text"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="cth. Midjourney v6 Masterclass"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori</label>
              <input
                type="text"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                placeholder="AI Video & Visual"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Sub-judul / Tagline Singkat</label>
            <input
              type="text"
              value={courseForm.subtitle}
              onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
              placeholder="Kuasai pembuatan visual sinematik dengan AI"
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Level</label>
              <select
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjutan">Lanjutan</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Nama Instruktur</label>
              <input
                type="text"
                value={courseForm.instructorName}
                onChange={(e) => setCourseForm({ ...courseForm, instructorName: e.target.value })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">URL Gambar Thumbnail</label>
            <input
              type="text"
              value={courseForm.thumbnail}
              onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Lengkap Kursus</label>
            <textarea
              rows={3}
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          {/* Episode List & Article Editor in Modal */}
          <div className="p-4 rounded-2xl bg-[#060816] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent-cyan" />
                <span>Daftar Episode Video ({courseForm.episodes.length})</span>
              </span>
              <span className="text-[11px] text-slate-400">Termasuk Video & Artikel Modul</span>
            </div>

            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
              {courseForm.episodes.length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-white/[0.02] text-xs text-slate-400">
                  Belum ada episode. Tambahkan episode baru di bawah.
                </div>
              ) : (
                courseForm.episodes.map((ep, i) => (
                  <div key={ep.id || i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-accent-cyan font-bold shrink-0">#{i + 1}</span>
                      <span className="font-semibold truncate">{ep.title}</span>
                      <span className="text-slate-400 text-[10px] shrink-0 font-mono">({ep.duration})</span>
                      {ep.articleContent && (
                        <span className="text-[9px] bg-accent-purple/30 text-accent-pink px-1.5 py-0.2 rounded font-bold shrink-0">
                          📖 Ada Artikel
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCourseForm(prev => ({ ...prev, episodes: prev.episodes.filter((_, idx) => idx !== i) }))}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Hapus episode"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new episode inline form */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10 bg-white/[0.01] p-2.5 rounded-xl">
              <span className="text-[11px] font-bold text-slate-300">+ Tambah Episode Video Baru</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Judul Episode Baru (cth: Episode 1: Workflow Dasar)"
                  value={newEpTitle}
                  onChange={(e) => setNewEpTitle(e.target.value)}
                  className="sm:col-span-8 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
                <input
                  type="text"
                  placeholder="Durasi (12:30)"
                  value={newEpDuration}
                  onChange={(e) => setNewEpDuration(e.target.value)}
                  className="sm:col-span-4 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="URL Video (Google Drive / YouTube / MP4 direct link)"
                  value={newEpVideoUrl}
                  onChange={(e) => setNewEpVideoUrl(e.target.value)}
                  className="sm:col-span-12 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Deskripsi Singkat Episode..."
                  value={newEpDescription}
                  onChange={(e) => setNewEpDescription(e.target.value)}
                  className="sm:col-span-7 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Topik (pisahkan koma: Prompt, Seed, Motion)"
                  value={newEpTopics}
                  onChange={(e) => setNewEpTopics(e.target.value)}
                  className="sm:col-span-5 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Episode Article / Study Guide Markdown Editor Toggle */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowEpArticleInput(!showEpArticleInput)}
                  className="text-[11px] text-accent-cyan hover:underline font-semibold flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showEpArticleInput ? 'Tutup Editor Artikel' : '📝 Tulis / Edit Artikel Isi Video (Markdown)'}</span>
                </button>

                {showEpArticleInput && (
                  <button
                    type="button"
                    onClick={() => setNewEpArticle(DEFAULT_EPISODE_ARTICLE_TEMPLATE)}
                    className="text-[10px] text-accent-pink hover:text-white font-bold flex items-center gap-1 bg-accent-purple/20 px-2 py-0.5 rounded-md"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Gunakan Template Artikel</span>
                  </button>
                )}
              </div>

              {showEpArticleInput && (
                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={6}
                    value={newEpArticle}
                    onChange={(e) => setNewEpArticle(e.target.value)}
                    placeholder="Tulis artikel rangkuman langkah-langkah isi video di sini (Mendukung format Markdown: # Heading, ### Langkah 1, > Tips, ```prompt dsb.)..."
                    className="w-full p-3 rounded-xl bg-[#030611] border border-accent-cyan/30 text-xs text-slate-200 font-mono focus:outline-none focus:border-accent-cyan leading-relaxed resize-y"
                  />
                  <span className="text-[10px] text-slate-400">
                    💡 Artikel ini akan otomatis muncul di bawah video pembelajaran bagi seluruh member.
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddEpisodeToForm}
                  className="py-2 px-4 rounded-xl bg-gradient-accent text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                  + Tambahkan Episode ke Kursus
                </button>
              </div>
            </div>
          </div>

          {/* Resources & Downloadable Attachments Section in Modal */}
          <div className="p-4 rounded-2xl bg-[#060816] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-accent-cyan" />
                <span>Resources & File Lampiran Kursus ({courseForm.resources?.length || 0})</span>
              </span>
              <span className="text-[11px] text-slate-400">PDF, Template ZIP, Notion, & Link Drive</span>
            </div>

            {/* List existing resources */}
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {(!courseForm.resources || courseForm.resources.length === 0) ? (
                <div className="p-3 text-center rounded-xl bg-white/[0.02] text-xs text-slate-400">
                  Belum ada file resource tambahan. Tambahkan di bawah.
                </div>
              ) : (
                courseForm.resources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-accent-cyan shrink-0" />
                      <span className="font-bold truncate">{res.title}</span>
                      <span className="text-slate-400 text-[10px] shrink-0 font-mono bg-white/5 px-2 py-0.5 rounded">
                        {res.type} • {res.size}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveResourceFromForm(i)}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Hapus resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new resource sub-form */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10 bg-white/[0.01] p-2.5 rounded-xl">
              <span className="text-[11px] font-bold text-slate-300">+ Tambah File Lampiran / Resource</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Nama Resource (cth: Cheatsheet Prompt PDF / LUT Pack)"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  className="sm:col-span-6 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value)}
                  className="sm:col-span-3 p-2 rounded-xl bg-[#101827] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="PDF">PDF</option>
                  <option value="ZIP">ZIP Pack</option>
                  <option value="Notion">Notion Docs</option>
                  <option value="Figma">Figma File</option>
                  <option value="PSD">Photoshop PSD</option>
                  <option value="JSON">JSON Preset</option>
                  <option value="Drive">Google Drive</option>
                  <option value="Link">Web Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Ukuran (2.5 MB)"
                  value={newResSize}
                  onChange={(e) => setNewResSize(e.target.value)}
                  className="sm:col-span-3 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="URL Download / Link Akses (Drive / Notion / Cloud Link)"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  className="sm:col-span-9 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddResourceToForm}
                  className="sm:col-span-3 py-2 px-3 rounded-xl bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 text-xs font-bold hover:bg-accent-cyan/30 transition-colors"
                >
                  + Resource
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCourseModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
            >
              Batal
            </button>
            <GradientButton size="sm" type="submit">
              {editingCourseId ? 'Simpan Perubahan' : 'Terbitkan Kursus'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT PROMPT */}
      <Modal isOpen={promptModalOpen} onClose={() => setPromptModalOpen(false)} maxWidth="2xl">
        <form onSubmit={handleSavePrompt} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white">
              {editingPromptId ? 'Edit Prompt Formula' : 'Tambah Formula Prompt Baru'}
            </h3>
            <span className="text-xs text-accent-purple font-semibold">CMS Prompt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Judul Prompt *</label>
              <input
                type="text"
                required
                value={promptForm.title}
                onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                placeholder="cth. Cinematic Commercial Shot"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>AI Model</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isCustomAiModel;
                    setIsCustomAiModel(nextMode);
                    if (nextMode) {
                      setCustomAiModelInput(promptForm.aiModel || '');
                    }
                  }}
                  className="text-[11px] text-accent-cyan hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-accent-cyan/10"
                >
                  {isCustomAiModel ? '📋 Pilih dari Daftar' : '✍️ Isi Model Sendiri'}
                </button>
              </div>

              {isCustomAiModel ? (
                <div className="relative flex flex-col gap-1">
                  <input
                    type="text"
                    required
                    value={customAiModelInput}
                    onChange={(e) => {
                      setCustomAiModelInput(e.target.value);
                      setPromptForm({ ...promptForm, aiModel: e.target.value });
                    }}
                    placeholder="Ketik nama model kustom (cth: Stable Cascade, Kling 1.5, HunyuanVideo)"
                    className="w-full p-3 rounded-2xl bg-[#060816] border border-accent-cyan/50 text-xs text-accent-cyan font-bold placeholder-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30"
                  />
                  <span className="text-[10px] text-slate-400">💡 Model ini akan otomatis tersimpan & muncul pada filter.</span>
                </div>
              ) : (
                <select
                  value={promptForm.aiModel}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomAiModel(true);
                      setCustomAiModelInput('');
                    } else {
                      setPromptForm({ ...promptForm, aiModel: e.target.value as any });
                    }
                  }}
                  className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
                >
                  <optgroup label="🎨 Image Generation Models">
                    <option value="Omni Flash">Omni Flash</option>
                    <option value="Nano Banana">Nano Banana</option>
                    <option value="Midjourney v6">Midjourney v6</option>
                    <option value="Midjourney v5.2">Midjourney v5.2</option>
                    <option value="Flux.1 Pro">Flux.1 Pro</option>
                    <option value="Flux.1 Schnell">Flux.1 Schnell</option>
                    <option value="Flux.1 Dev">Flux.1 Dev</option>
                    <option value="Stable Diffusion 3.5">Stable Diffusion 3.5</option>
                    <option value="SDXL Turbo">SDXL Turbo</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                    <option value="Ideogram 2.0">Ideogram 2.0</option>
                    <option value="Leonardo AI">Leonardo AI</option>
                    <option value="Recraft V3">Recraft V3</option>
                  </optgroup>
                  <optgroup label="🎬 Video Generation Models">
                    <option value="Kling AI">Kling AI</option>
                    <option value="Kling 1.5">Kling 1.5</option>
                    <option value="Luma Dream Machine">Luma Dream Machine</option>
                    <option value="Runway Gen-3">Runway Gen-3</option>
                    <option value="Hailuo / Minimax">Hailuo / Minimax</option>
                    <option value="OpenAI Sora">OpenAI Sora</option>
                    <option value="Pika 2.0">Pika 2.0</option>
                    <option value="Veed AI">Veed AI</option>
                    <option value="Viggle AI">Viggle AI</option>
                  </optgroup>
                  <optgroup label="🧠 LLM & Multimodal Models">
                    <option value="ChatGPT / GPT-4o">ChatGPT / GPT-4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                    <option value="DeepSeek R1">DeepSeek R1</option>
                  </optgroup>
                  {existingCustomModels.length > 0 && (
                    <optgroup label="⚡ Model Lain di Database">
                      {existingCustomModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </optgroup>
                  )}
                  <option value="__custom__" className="text-accent-cyan font-bold">
                    ✍️ + Isi Model Sendiri (Kustom)...
                  </option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori</label>
              <select
                value={promptForm.category}
                onChange={(e) => setPromptForm({ ...promptForm, category: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Character">Character</option>
                <option value="UGC">UGC</option>
                <option value="Product">Product</option>
                <option value="Storyboard">Storyboard</option>
                <option value="Lighting">Lighting</option>
                <option value="Camera">Camera</option>
                <option value="Motion">Motion</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Tingkat Kesulitan</label>
              <select
                value={promptForm.difficulty}
                onChange={(e) => setPromptForm({ ...promptForm, difficulty: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Ahli">Ahli</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
              <select
                value={promptForm.aspectRatio}
                onChange={(e) => setPromptForm({ ...promptForm, aspectRatio: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Reels/TikTok)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:5">4:5 (Portrait)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Formula Prompt Utama *</label>
            <textarea
              rows={3}
              required
              value={promptForm.promptText}
              onChange={(e) => setPromptForm({ ...promptForm, promptText: e.target.value })}
              placeholder="Cinematic portrait of young woman holding a skincare product, 8k resolution, photorealistic..."
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-accent-purple resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Negative Prompt</label>
            <input
              type="text"
              value={promptForm.negativePrompt}
              onChange={(e) => setPromptForm({ ...promptForm, negativePrompt: e.target.value })}
              placeholder="blurry, distorted, bad hands, low resolution"
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-accent-purple"
            />
          </div>

          {/* Parameter Settings (Bagian Bawah Prompt) */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Parameter Detail (Bagian Bawah Prompt Card)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Camera Settings</label>
                <input
                  type="text"
                  value={promptForm.cameraSettings}
                  onChange={(e) => setPromptForm({ ...promptForm, cameraSettings: e.target.value })}
                  placeholder="85mm f/1.4, ISO 100, Eye AF"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Lighting Mood</label>
                <input
                  type="text"
                  value={promptForm.lighting}
                  onChange={(e) => setPromptForm({ ...promptForm, lighting: e.target.value })}
                  placeholder="Volumetric Soft Studio Lighting"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Motion Dynamics</label>
                <input
                  type="text"
                  value={promptForm.motion}
                  onChange={(e) => setPromptForm({ ...promptForm, motion: e.target.value })}
                  placeholder="Subtle cinematic slow zoom"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Environment & Scene</label>
                <input
                  type="text"
                  value={promptForm.environment}
                  onChange={(e) => setPromptForm({ ...promptForm, environment: e.target.value })}
                  placeholder="Modern Studio Backdrop"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Voice / Audio (Opsional)</label>
                <input
                  type="text"
                  value={promptForm.voice}
                  onChange={(e) => setPromptForm({ ...promptForm, voice: e.target.value })}
                  placeholder="Indonesian Female Warm Tone"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-pink"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Tips Ekstra (Pisahkan koma)</label>
                <input
                  type="text"
                  value={promptForm.tipsString}
                  onChange={(e) => setPromptForm({ ...promptForm, tipsString: e.target.value })}
                  placeholder="Gunakan seed yang sama, Naikkan quality"
                  className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Tags (Pisahkan koma)</label>
              <input
                type="text"
                value={promptForm.tagsString}
                onChange={(e) => setPromptForm({ ...promptForm, tagsString: e.target.value })}
                placeholder="Skincare, TikTok, Ads, Realism"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Thumbnail URL</label>
              <input
                type="text"
                value={promptForm.thumbnail}
                onChange={(e) => setPromptForm({ ...promptForm, thumbnail: e.target.value })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Batasi Khusus Pro Member (VIP Exclusive)</span>
              <span className="text-[11px] text-slate-400">Hanya Pro Member yang dapat melihat dan menyalin formula lengkap</span>
            </div>
            <input
              type="checkbox"
              checked={promptForm.isPremium}
              onChange={(e) => setPromptForm({ ...promptForm, isPremium: e.target.checked })}
              className="w-5 h-5 accent-accent-purple rounded cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setPromptModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
            >
              Batal
            </button>
            <GradientButton size="sm" type="submit">
              {editingPromptId ? 'Simpan Perubahan' : 'Terbitkan Prompt'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT ASSET */}
      <Modal isOpen={assetModalOpen} onClose={() => setAssetModalOpen(false)} maxWidth="md">
        <form onSubmit={handleSaveAsset} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white">
              {editingAssetId ? 'Edit Creative Asset' : 'Tambah Asset Baru'}
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">CMS Asset</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Asset *</label>
            <input
              type="text"
              required
              value={assetForm.title}
              onChange={(e) => setAssetForm({ ...assetForm, title: e.target.value })}
              placeholder="cth. Cinematic LUTs Pack v2"
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Format</label>
              <select
                value={assetForm.format}
                onChange={(e) => setAssetForm({ ...assetForm, format: e.target.value })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="PSD">PSD</option>
                <option value="PNG">PNG</option>
                <option value="LUT">LUT</option>
                <option value="Templates">Templates</option>
                <option value="Mockups">Mockups</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Ukuran File</label>
              <input
                type="text"
                value={assetForm.size}
                onChange={(e) => setAssetForm({ ...assetForm, size: e.target.value })}
                placeholder="24.5 MB"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Thumbnail URL</label>
            <input
              type="text"
              value={assetForm.thumbnail}
              onChange={(e) => setAssetForm({ ...assetForm, thumbnail: e.target.value })}
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
            <input
              type="checkbox"
              id="isPremiumCheck"
              checked={assetForm.isPremium}
              onChange={(e) => setAssetForm({ ...assetForm, isPremium: e.target.checked })}
              className="accent-accent-cyan w-4 h-4"
            />
            <label htmlFor="isPremiumCheck" className="text-xs text-slate-200 font-semibold cursor-pointer">
              Khusus Member Pro (Exclusive VIP Asset)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAssetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
            >
              Batal
            </button>
            <GradientButton size="sm" type="submit">
              {editingAssetId ? 'Simpan Perubahan' : 'Terbitkan Asset'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT EXTERNAL TOOL */}
      <Modal isOpen={toolModalOpen} onClose={() => setToolModalOpen(false)} maxWidth="2xl">
        <form onSubmit={handleSaveTool} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingToolId ? 'Edit Tool AI Eksternal' : 'Tambah Tool AI Eksternal Baru'}
                </h3>
                <span className="text-[11px] text-accent-cyan font-semibold">Direktori Tools CMS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Nama Tool AI *</label>
              <input
                type="text"
                required
                value={toolForm.name}
                onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                placeholder="cth. Midjourney v6.1 / Kling AI"
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">URL Website / Web App Tool *</label>
              <input
                type="url"
                required
                value={toolForm.url}
                onChange={(e) => setToolForm({ ...toolForm, url: e.target.value })}
                placeholder="https://..."
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori</label>
              <select
                value={toolForm.category}
                onChange={(e) => setToolForm({ ...toolForm, category: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Image Gen" className="bg-[#101827]">Image Gen</option>
                <option value="Video AI" className="bg-[#101827]">Video AI</option>
                <option value="Audio & Voice" className="bg-[#101827]">Audio & Voice</option>
                <option value="LLM & Writing" className="bg-[#101827]">LLM & Writing</option>
                <option value="Productivity" className="bg-[#101827]">Productivity</option>
                <option value="Automation" className="bg-[#101827]">Automation</option>
                <option value="3D & VFX" className="bg-[#101827]">3D & VFX</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Model Harga</label>
              <select
                value={toolForm.pricingType}
                onChange={(e) => setToolForm({ ...toolForm, pricingType: e.target.value as any })}
                className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Free" className="bg-[#101827]">Free (Gratis Penuh)</option>
                <option value="Freemium" className="bg-[#101827]">Freemium (Ada Free Tier)</option>
                <option value="Paid" className="bg-[#101827]">Paid (Berbayar)</option>
                <option value="Free Trial" className="bg-[#101827]">Free Trial (Uji Coba)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">URL Thumbnail / Preview Image</label>
            <input
              type="text"
              value={toolForm.thumbnail}
              onChange={(e) => setToolForm({ ...toolForm, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Deskripsi Singkat Tool</label>
            <textarea
              rows={2}
              value={toolForm.description}
              onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
              placeholder="Jelaskan keunggulan dan fitur utama tool AI ini..."
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Tags (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={toolForm.tagsString}
              onChange={(e) => setToolForm({ ...toolForm, tagsString: e.target.value })}
              placeholder="Midjourney, Photorealistic, Video AI"
              className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Batasi Khusus Pro Member</span>
              <span className="text-[11px] text-slate-400">Hanya Pro Member yang dapat mengakses tool ini</span>
            </div>
            <input
              type="checkbox"
              checked={toolForm.isPremium}
              onChange={(e) => setToolForm({ ...toolForm, isPremium: e.target.checked })}
              className="w-5 h-5 accent-accent-cyan rounded cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setToolModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
            >
              Batal
            </button>
            <GradientButton size="sm" type="submit">
              {editingToolId ? 'Simpan Perubahan' : 'Terbitkan Tool'}
            </GradientButton>
          </div>
        </form>
      </Modal>

    </div>
  );
};
