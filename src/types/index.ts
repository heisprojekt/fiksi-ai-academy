export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'courses' 
  | 'course-detail' 
  | 'prompts' 
  | 'assets' 
  | 'tools'
  | 'profile' 
  | 'admin' 
  | 'blog'
  | 'community'
  | 'bookmarks'
  | 'downloads'
  | 'updates';

export interface ExternalTool {
  id: string;
  name: string;
  description: string;
  category: 'Image Gen' | 'Video AI' | 'Audio & Voice' | 'LLM & Writing' | 'Productivity' | 'Automation' | '3D & VFX';
  url: string;
  thumbnail: string;
  pricingType: 'Free' | 'Freemium' | 'Paid' | 'Free Trial';
  isPremium?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export type UserRole = 'Guest' | 'Free Member' | 'Pro Member' | 'Admin';

export interface Episode {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  description: string;
  keyTopics: string[];
}

export interface ResourceItem {
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
}

export interface Course {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  bannerImage: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  progressPercentage: number;
  totalEpisodes: number;
  completedEpisodes: number;
  instructor: {
    name: string;
    avatar: string;
    role: string;
  };
  episodes: Episode[];
  description: string;
  resources: ResourceItem[];
  isPublished?: boolean;
}

export interface PromptPack {
  id: string;
  title: string;
  thumbnail: string;
  category: 'Karakter AI' | 'Make Up & Skin' | 'Outfit & Fashion' | 'Hijab & Modest' | 'Body Type' | 'Pose & Ekspresi' | 'Lighting & Mood' | 'Angle Kamera' | 'Background & Scene' | 'AI Realism & UGC' | 'Video Prompt' | 'Visual Style' | 'Konsistensi AI' | 'Character' | 'UGC' | 'Product' | 'Storyboard' | 'Lighting' | 'Camera' | 'Motion' | string;
  subCategory?: string;
  aiModel: 'Omni Flash' | 'Nano Banana' | 'Midjourney v6' | 'Flux.1 Pro' | 'Kling AI' | 'Veed AI' | string;
  usageCount: number;
  isNew?: boolean;
  isPopular?: boolean;
  difficulty: 'Mudah' | 'Sedang' | 'Ahli';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  tags: string[];
  promptText: string;
  negativePrompt?: string;
  cameraSettings?: string;
  lighting?: string;
  motion?: string;
  voice?: string;
  environment?: string;
  tips?: string[];
  author: string;
  isPremium?: boolean;
  isPublished?: boolean;
}

export interface DownloadAsset {
  id: string;
  title: string;
  thumbnail: string;
  format: 'PSD' | 'PNG' | 'LUT' | 'Templates' | 'Mockups' | 'Icons' | 'Storyboards' | string;
  size: string;
  category: string;
  downloadsCount: number;
  tags: string[];
  fileUrl: string;
  isPremium: boolean;
  isPublished?: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedDate: string;
  validUntil: string;
  coursesCompleted: number;
  savedPrompts: number;
  totalDownloads: number;
  streakDays: number;
  status?: string;
}

export interface QRISPaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: 'pro-monthly' | 'pro-annual' | 'pro-lifetime' | string;
  planName: string;
  amount: number;
  formattedAmount: string;
  qrisRef: string;
  paymentMethod: 'QRIS';
  proofImage?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  notes?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  excerpt: string;
  content: string;
  tags: string[];
  tableOfContents: { id: string; title: string }[];
  isPublished?: boolean;
}

export interface WeeklyUpdateItem {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
}

export const buildFullPromptFormula = (prompt: PromptPack): string => {
  const sections: string[] = [];

  // 1. Main Prompt Text
  let mainText = (prompt.promptText || '').trim();
  if (prompt.aspectRatio && !mainText.includes('--ar')) {
    mainText += ` --ar ${prompt.aspectRatio}`;
  }
  sections.push(`[PROMPT TEXT FORMULA]\n${mainText}`);

  // 2. Negative Prompt
  if (prompt.negativePrompt && prompt.negativePrompt.trim()) {
    sections.push(`[NEGATIVE PROMPT]\n${prompt.negativePrompt.trim()}`);
  }

  // 3. Technical Parameters (Camera, Lighting, Motion, Environment, Voice)
  const params: string[] = [];
  if (prompt.cameraSettings?.trim()) params.push(`Camera: ${prompt.cameraSettings.trim()}`);
  if (prompt.lighting?.trim()) params.push(`Lighting: ${prompt.lighting.trim()}`);
  if (prompt.motion?.trim()) params.push(`Motion: ${prompt.motion.trim()}`);
  if (prompt.environment?.trim()) params.push(`Environment: ${prompt.environment.trim()}`);
  if (prompt.voice?.trim()) params.push(`Voice: ${prompt.voice.trim()}`);

  if (params.length > 0) {
    sections.push(`[PARAMETERS & SETTINGS]\n${params.join('\n')}`);
  }

  // 4. Tips & Guidelines
  if (prompt.tips && prompt.tips.length > 0) {
    sections.push(`[TIPS]\n${prompt.tips.map(t => `- ${t}`).join('\n')}`);
  }

  return sections.join('\n\n');
};
