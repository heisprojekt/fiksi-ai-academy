export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'courses' 
  | 'course-detail' 
  | 'prompts' 
  | 'assets' 
  | 'profile' 
  | 'admin' 
  | 'blog'
  | 'community';

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

export interface Course {
  id: string;
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
  resources: { title: string; type: string; size: string; downloadUrl: string }[];
}

export interface PromptPack {
  id: string;
  title: string;
  thumbnail: string;
  category: 'Character' | 'UGC' | 'Product' | 'Storyboard' | 'Lighting' | 'Camera' | 'Motion' | 'Lainnya';
  aiModel: 'Omni Flash' | 'Nano Banana' | 'Midjourney v6' | 'Flux.1 Pro' | 'Kling AI' | 'Veed AI';
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
}

export interface DownloadAsset {
  id: string;
  title: string;
  thumbnail: string;
  format: 'PSD' | 'PNG' | 'LUT' | 'Templates' | 'Mockups' | 'Icons' | 'Storyboards';
  size: string;
  category: string;
  downloadsCount: number;
  tags: string[];
  fileUrl: string;
  isPremium: boolean;
}

export interface UserProfile {
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
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}
