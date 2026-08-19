import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  ViewMode, 
  UserRole, 
  PromptPack, 
  Course, 
  BlogArticle, 
  ToastMessage, 
  DownloadAsset, 
  UserProfile, 
  LoginCredentials, 
  RegisterData,
  QRISPaymentTransaction,
  ExternalTool,
  RecentActivityItem,
  ThemeMode
} from '../types';
import { 
  MOCK_COURSES, 
  MOCK_PROMPTS, 
  MOCK_ASSETS, 
  MOCK_BLOGS, 
  MOCK_USER, 
  MOCK_WEEKLY_UPDATES,
  MOCK_EXTERNAL_TOOLS 
} from '../data/mockData';
import { NOTION_PROMPTS } from '../data/notionPrompts';
import { api } from '../services/api';

export const ADMIN_EMAILS = ['heisprojekt@gmail.com', 'fiksiaiai@gmail.com'];

interface AppContextType {
  // Theme Mode
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Navigation & View
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  navigateTo: (view: ViewMode, extraId?: string) => void;

  // Auth & User
  currentUser: UserProfile | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  loginWithGoogle: (googleData?: string | { email: string; name?: string; avatar?: string }, rememberMe?: boolean) => Promise<void>;
  loginWithEmail: (creds: LoginCredentials, rememberMe?: boolean) => Promise<boolean>;
  registerWithEmail: (data: RegisterData, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;

  // Courses (CMS & Public)
  courses: Course[];
  activeCourse: Course;
  setActiveCourseId: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Prompts (CMS & Public)
  prompts: PromptPack[];
  selectedPrompt: PromptPack | null;
  setSelectedPrompt: (prompt: PromptPack | null) => void;
  addPrompt: (prompt: Omit<PromptPack, 'id'>) => PromptPack;
  updatePrompt: (id: string, updated: Partial<PromptPack>) => void;
  deletePrompt: (id: string) => void;
  incrementPromptUsage: (id: string) => void;

  // Assets (CMS & Public)
  assets: DownloadAsset[];
  addAsset: (asset: Omit<DownloadAsset, 'id'>) => DownloadAsset;
  updateAsset: (id: string, updated: Partial<DownloadAsset>) => void;
  deleteAsset: (id: string) => void;

  // External AI Tools (CMS & Directory)
  externalTools: ExternalTool[];
  addExternalTool: (tool: Omit<ExternalTool, 'id'>) => ExternalTool;
  updateExternalTool: (id: string, updated: Partial<ExternalTool>) => void;
  deleteExternalTool: (id: string) => void;

  // Users (CMS Management)
  usersList: UserProfile[];
  updateUserRole: (emailOrId: string, newRole: UserRole) => void;
  updateUserTier: (emailOrId: string, newRole: UserRole, validUntil?: string, status?: string) => void;
  deleteUser: (emailOrId: string) => void;

  // QRIS Payment & Upgrade Modal
  paymentTransactions: QRISPaymentTransaction[];
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  createQRISPayment: (plan: { id: string; name: string; amount: number; formattedAmount: string }, proofImage?: string, customQrisRef?: string) => Promise<QRISPaymentTransaction>;
  approveQRISPayment: (transactionId: string) => Promise<void>;
  rejectQRISPayment: (transactionId: string, reason?: string) => Promise<void>;

  // Refresh Users from DB
  refreshUsers: () => Promise<void>;

  // Blogs & Updates
  selectedBlog: BlogArticle;
  setSelectedBlog: (blog: BlogArticle) => void;

  // User Interaction & Recent History
  bookmarks: string[];
  toggleBookmark: (promptId: string) => void;
  completedEpisodes: Record<string, boolean>;
  toggleEpisodeCompletion: (courseId: string, episodeId: string) => void;
  recentActivity: RecentActivityItem[];
  trackRecentActivity: (item: Omit<RecentActivityItem, 'timestamp'>) => void;
  clearRecentActivity: () => void;

  // Toast & Utilities
  toast: ToastMessage | null;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  hideToast: () => void;
  copyToClipboard: (text: string, label?: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Reset to default
  resetDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'fiksi_academy_courses',
  PROMPTS: 'fiksi_academy_prompts',
  ASSETS: 'fiksi_academy_assets',
  TOOLS: 'fiksi_academy_tools',
  USERS: 'fiksi_academy_users',
  CURRENT_USER: 'fiksi_academy_current_user',
  BOOKMARKS: 'fiksi_academy_bookmarks',
  COMPLETED_EPISODES: 'fiksi_academy_completed_episodes',
  TRANSACTIONS: 'fiksi_academy_transactions',
  RECENT_ACTIVITY: 'fiksi_academy_recent_activity',
  THEME: 'fiksi_academy_theme',
};

const INITIAL_TRANSACTIONS: QRISPaymentTransaction[] = [
  {
    id: 'trx-101',
    userId: 'u-5',
    userName: 'Diana Putri',
    userEmail: 'diana.agency@gmail.com',
    planId: 'pro-annual',
    planName: 'Pro Member Tahunan (1 Tahun Akses)',
    amount: 399000,
    formattedAmount: 'Rp 399.000',
    qrisRef: 'QRIS-871923',
    paymentMethod: 'QRIS',
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    status: 'Pending',
    createdAt: '10 Menit lalu',
    notes: 'Transfer via BCA QRIS'
  },
  {
    id: 'trx-102',
    userId: 'u-4',
    userName: 'Budi Santoso',
    userEmail: 'budi.creators@gmail.com',
    planId: 'pro-lifetime',
    planName: 'Pro Member Lifetime VIP',
    amount: 699000,
    formattedAmount: 'Rp 699.000',
    qrisRef: 'QRIS-652391',
    paymentMethod: 'QRIS',
    proofImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80',
    status: 'Approved',
    createdAt: 'Kemarin, 14:20',
    notes: 'Transfer via GoPay QRIS'
  }
];

// URL Path helpers for lightweight and bookmarkable routing
const getViewFromPathname = (): { view: ViewMode; extraId?: string } => {
  if (typeof window === 'undefined') return { view: 'dashboard' };
  const path = window.location.pathname.toLowerCase();
  
  if (path === '' || path === '/' || path === '/dashboard') return { view: 'dashboard' };
  if (path === '/landing') return { view: 'landing' };
  if (path === '/courses') return { view: 'courses' };
  if (path.startsWith('/course/')) {
    const slugOrId = window.location.pathname.replace(/^\/course\//i, '').trim();
    return { view: 'course-detail', extraId: slugOrId || 'omni-flash-masterclass' };
  }
  if (path === '/prompts') return { view: 'prompts' };
  if (path === '/assets') return { view: 'assets' };
  if (path === '/tools') return { view: 'tools' };
  if (path === '/profile' || path === '/settings') return { view: 'profile' };
  if (path === '/admin') return { view: 'admin' };
  if (path === '/bookmarks') return { view: 'bookmarks' };
  if (path.startsWith('/blog')) {
    const blogId = window.location.pathname.replace(/^\/blog\/?/i, '').trim();
    return { view: 'blog', extraId: blogId || undefined };
  }
  return { view: 'dashboard' };
};

const getPathFromView = (view: ViewMode, extraId?: string): string => {
  switch (view) {
    case 'dashboard': return '/';
    case 'landing': return '/landing';
    case 'courses': return '/courses';
    case 'course-detail': return `/course/${extraId || 'omni-flash-masterclass'}`;
    case 'prompts': return '/prompts';
    case 'assets': return '/assets';
    case 'tools': return '/tools';
    case 'profile': return '/profile';
    case 'admin': return '/admin';
    case 'bookmarks': return '/bookmarks';
    case 'blog': return extraId ? `/blog/${extraId}` : '/blog';
    default: return '/';
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = getViewFromPathname();
  const [currentView, setCurrentView] = useState<ViewMode>(initialRoute.view);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  // Theme mode: 'dark' | 'light'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved as ThemeMode;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
      if (theme === 'light') {
        document.body.classList.remove('bg-[#0B0C10]', 'text-slate-100');
        document.body.classList.add('bg-[#F8FAFC]', 'text-slate-900');
      } else {
        document.body.classList.remove('bg-[#F8FAFC]', 'text-slate-900');
        document.body.classList.add('bg-[#0B0C10]', 'text-slate-100');
      }
    }
  }, [theme]);

  // Load persistent transactions or fallback
  const [paymentTransactions, setPaymentTransactions] = useState<QRISPaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Load persistent courses or fallback to MOCK_COURSES
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return MOCK_COURSES;
    } catch {
      return MOCK_COURSES;
    }
  });

  // Load persistent prompts or fallback to NOTION_PROMPTS & MOCK_PROMPTS
  const [prompts, setPrompts] = useState<PromptPack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMPTS);
      if (saved) {
        const parsed: PromptPack[] = JSON.parse(saved);
        // Ensure character thumbnails from NOTION_PROMPTS take precedence
        const updatedParsed = parsed.map(p => {
          const matchNotion = NOTION_PROMPTS.find(np => np.id === p.id || (np.title && np.title.toUpperCase() === p.title.toUpperCase()));
          if (matchNotion && matchNotion.thumbnail.includes('googleusercontent.com')) {
            return { ...p, thumbnail: matchNotion.thumbnail };
          }
          return p;
        });
        const existingIds = new Set(updatedParsed.map(p => p.id));
        const newFromNotion = NOTION_PROMPTS.filter(p => !existingIds.has(p.id));
        const newFromMock = MOCK_PROMPTS.filter(p => !existingIds.has(p.id));
        return [...updatedParsed, ...newFromNotion, ...newFromMock];
      }
      return [...NOTION_PROMPTS, ...MOCK_PROMPTS];
    } catch {
      return [...NOTION_PROMPTS, ...MOCK_PROMPTS];
    }
  });

  // Load persistent assets or fallback to MOCK_ASSETS
  const [assets, setAssets] = useState<DownloadAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      return saved ? JSON.parse(saved) : MOCK_ASSETS;
    } catch {
      return MOCK_ASSETS;
    }
  });

  // Load persistent external tools or fallback to MOCK_EXTERNAL_TOOLS
  const [externalTools, setExternalTools] = useState<ExternalTool[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOOLS);
      return saved ? JSON.parse(saved) : MOCK_EXTERNAL_TOOLS;
    } catch {
      return MOCK_EXTERNAL_TOOLS;
    }
  });

  // Initial Registered Users List
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'u-1',
        name: 'Heisprojekt Admin',
        email: 'heisprojekt@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'Admin',
        joinedDate: '01 Jan 2025',
        validUntil: 'Lifetime VIP',
        coursesCompleted: 15,
        savedPrompts: 180,
        totalDownloads: 45,
        streakDays: 42,
        status: 'Aktif'
      },
      {
        id: 'u-2',
        name: 'FIKSI AI Admin',
        email: 'fiksiaiai@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        role: 'Admin',
        joinedDate: '01 Jan 2025',
        validUntil: 'Lifetime VIP',
        coursesCompleted: 20,
        savedPrompts: 240,
        totalDownloads: 60,
        streakDays: 50,
        status: 'Aktif'
      },
      {
        id: 'u-3',
        name: 'Heisy Creator',
        email: 'heisy.creator@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'Pro Member',
        joinedDate: '12 Mar 2025',
        validUntil: '12 Mar 2026',
        coursesCompleted: 12,
        savedPrompts: 156,
        totalDownloads: 32,
        streakDays: 24,
        status: 'Aktif'
      },
      {
        id: 'u-4',
        name: 'Budi Santoso',
        email: 'budi.creators@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        role: 'Pro Member',
        joinedDate: '10 Mei 2025',
        validUntil: '10 Mei 2026',
        coursesCompleted: 8,
        savedPrompts: 64,
        totalDownloads: 18,
        streakDays: 14,
        status: 'Aktif'
      },
      {
        id: 'u-5',
        name: 'Diana Putri',
        email: 'diana.agency@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        role: 'Free Member',
        joinedDate: '01 Jun 2025',
        validUntil: 'Free Tier',
        coursesCompleted: 2,
        savedPrompts: 12,
        totalDownloads: 3,
        streakDays: 5,
        status: 'Pending'
      }
    ];
  });

  // Helper to load persistent user session (supports Remember Me via localStorage vs sessionStorage)
  const getInitialUser = (): UserProfile | null => {
    try {
      const savedLocal = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedLocal) return JSON.parse(savedLocal);
      const savedSession = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedSession) return JSON.parse(savedSession);
    } catch {
      // ignore
    }
    return null; // Fresh visit requires login
  };

  const initialUser = getInitialUser();

  // Current Logged In User (defaults to null on fresh visits)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);

  const saveUserSession = (user: UserProfile, rememberMe: boolean = true) => {
    setCurrentUser(user);
    try {
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // ignore
    }
  };

  const userRole: UserRole = currentUser ? currentUser.role : 'Guest';

  const setUserRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      try {
        if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        } else if (sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
    }
  };

  const [activeCourseId, setActiveCourseIdState] = useState<string>(initialRoute.extraId || 'omni-flash-masterclass');
  const [selectedPrompt, setSelectedPromptState] = useState<PromptPack | null>(null);

  const setSelectedPrompt = (prompt: PromptPack | null) => {
    setSelectedPromptState(prompt);
    if (prompt) {
      trackRecentActivity({
        id: prompt.id,
        type: 'prompt',
        title: prompt.title,
        category: prompt.category,
        aiModel: prompt.aiModel,
        thumbnail: prompt.thumbnail,
        targetView: 'prompts',
        targetId: prompt.id,
        badge: prompt.difficulty
      });
    }
  };

  const [selectedBlog, setSelectedBlog] = useState<BlogArticle>(MOCK_BLOGS[0]);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const userKey = initialUser ? `${STORAGE_KEYS.BOOKMARKS}_${initialUser.id}` : `${STORAGE_KEYS.BOOKMARKS}_guest`;
      const saved = localStorage.getItem(userKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Reload bookmarks on user login / switch
  useEffect(() => {
    try {
      const userKey = currentUser ? `${STORAGE_KEYS.BOOKMARKS}_${currentUser.id}` : `${STORAGE_KEYS.BOOKMARKS}_guest`;
      const saved = localStorage.getItem(userKey);
      setBookmarks(saved ? JSON.parse(saved) : (currentUser?.bookmarks || []));
    } catch {
      setBookmarks([]);
    }
  }, [currentUser?.id]);

  const [completedEpisodes, setCompletedEpisodes] = useState<Record<string, boolean>>(() => {
    try {
      const userKey = initialUser ? `${STORAGE_KEYS.COMPLETED_EPISODES}_${initialUser.id}` : `${STORAGE_KEYS.COMPLETED_EPISODES}_guest`;
      const saved = localStorage.getItem(userKey);
      if (saved) return JSON.parse(saved);
      // Fallback for legacy key if present
      const legacy = localStorage.getItem(STORAGE_KEYS.COMPLETED_EPISODES);
      if (legacy) return JSON.parse(legacy);
    } catch {
      // ignore
    }
    return {};
  });

  // Reload completed episodes on user login / switch
  useEffect(() => {
    try {
      const userKey = currentUser ? `${STORAGE_KEYS.COMPLETED_EPISODES}_${currentUser.id}` : `${STORAGE_KEYS.COMPLETED_EPISODES}_guest`;
      const saved = localStorage.getItem(userKey);
      setCompletedEpisodes(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedEpisodes({});
    }
  }, [currentUser?.id]);

  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(() => {
    try {
      const userKey = initialUser ? `${STORAGE_KEYS.RECENT_ACTIVITY}_${initialUser.id}` : `${STORAGE_KEYS.RECENT_ACTIVITY}_guest`;
      const saved = localStorage.getItem(userKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reload recent activity on user login/switch
  useEffect(() => {
    try {
      const userKey = currentUser ? `${STORAGE_KEYS.RECENT_ACTIVITY}_${currentUser.id}` : `${STORAGE_KEYS.RECENT_ACTIVITY}_guest`;
      const saved = localStorage.getItem(userKey);
      setRecentActivity(saved ? JSON.parse(saved) : []);
    } catch {
      setRecentActivity([]);
    }
  }, [currentUser?.id]);

  const trackRecentActivity = (item: Omit<RecentActivityItem, 'timestamp'>) => {
    setRecentActivity(prev => {
      const filtered = prev.filter(i => !(i.id === item.id && i.type === item.type));
      const newItem: RecentActivityItem = { ...item, timestamp: Date.now() };
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        const userKey = currentUser ? `${STORAGE_KEYS.RECENT_ACTIVITY}_${currentUser.id}` : `${STORAGE_KEYS.RECENT_ACTIVITY}_guest`;
        localStorage.setItem(userKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearRecentActivity = () => {
    setRecentActivity([]);
    try {
      const userKey = currentUser ? `${STORAGE_KEYS.RECENT_ACTIVITY}_${currentUser.id}` : `${STORAGE_KEYS.RECENT_ACTIVITY}_guest`;
      localStorage.removeItem(userKey);
    } catch {
      // ignore
    }
  };

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => !initialUser);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(externalTools));
  }, [externalTools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    const userKey = currentUser ? `${STORAGE_KEYS.BOOKMARKS}_${currentUser.id}` : `${STORAGE_KEYS.BOOKMARKS}_guest`;
    localStorage.setItem(userKey, JSON.stringify(bookmarks));
  }, [bookmarks, currentUser?.id]);

  useEffect(() => {
    const userKey = currentUser ? `${STORAGE_KEYS.COMPLETED_EPISODES}_${currentUser.id}` : `${STORAGE_KEYS.COMPLETED_EPISODES}_guest`;
    localStorage.setItem(userKey, JSON.stringify(completedEpisodes));
  }, [completedEpisodes, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  // Sync from MongoDB API on initial startup & revalidate logged-in user
  useEffect(() => {
    const syncFromMongoDB = async () => {
      try {
        const [dbCourses, dbPrompts, dbAssets, dbTools, dbUsers, dbTrxs] = await Promise.all([
          api.getCourses(),
          api.getPrompts({ limit: 1000 }),
          api.getAssets(),
          api.getTools(),
          api.getUsers(),
          api.getTransactions()
        ]);

        if (dbCourses && Array.isArray(dbCourses)) {
          if (dbCourses.length > 0) {
            setCourses(dbCourses);
            localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(dbCourses));
          } else {
            setCourses(MOCK_COURSES);
          }
        }
        if (dbPrompts && Array.isArray(dbPrompts.data) && dbPrompts.data.length > 0) {
          setPrompts(dbPrompts.data);
          localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(dbPrompts.data));
        }
        if (dbAssets && Array.isArray(dbAssets) && dbAssets.length > 0) {
          setAssets(dbAssets);
          localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(dbAssets));
        }
        if (dbTools && Array.isArray(dbTools) && dbTools.length > 0) {
          setExternalTools(dbTools);
          localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(dbTools));
        }
        if (dbTrxs && Array.isArray(dbTrxs) && dbTrxs.length > 0) {
          setPaymentTransactions(dbTrxs);
          localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(dbTrxs));
        }

        if (dbUsers && Array.isArray(dbUsers) && dbUsers.length > 0) {
          setUsersList(dbUsers);

          // IMMEDIATELY RE-SYNC CURRENT LOGGED-IN USER FROM DATABASE
          const savedSession = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
          if (savedSession) {
            try {
              const currentSaved = JSON.parse(savedSession);
              if (currentSaved && currentSaved.email) {
                const dbMatch = dbUsers.find(u => u.email.toLowerCase() === currentSaved.email.toLowerCase());
                if (dbMatch) {
                  const updatedCurrent: UserProfile = {
                    ...currentSaved,
                    id: dbMatch.id,
                    role: dbMatch.role,
                    validUntil: dbMatch.validUntil || currentSaved.validUntil,
                    status: dbMatch.status || currentSaved.status || 'Active',
                    name: dbMatch.name || currentSaved.name,
                    avatar: dbMatch.avatar || currentSaved.avatar
                  };
                  setCurrentUser(updatedCurrent);
                  if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrent));
                  } else if (sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
                    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrent));
                  }
                  console.log(`[Auth Sync] ✅ Synced currentUser from MongoDB Atlas: ${updatedCurrent.email} (Role: ${updatedCurrent.role}, ValidUntil: ${updatedCurrent.validUntil})`);
                }
              }
            } catch (err) {
              console.warn('Failed parsing current user session:', err);
            }
          }
        }
      } catch {
        // Fallback to local cache gracefully
      }
    };
    syncFromMongoDB();
  }, []);

  // Listen for window focus to re-sync user tier live if upgraded by admin
  useEffect(() => {
    const onFocusSync = async () => {
      if (!currentUser || !currentUser.email) return;
      try {
        const freshUsers = await api.getUsers();
        if (freshUsers && freshUsers.length > 0) {
          setUsersList(freshUsers);
          const matched = freshUsers.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
          if (matched && (matched.role !== currentUser.role || matched.validUntil !== currentUser.validUntil)) {
            const updated: UserProfile = {
              ...currentUser,
              id: matched.id,
              role: matched.role,
              validUntil: matched.validUntil,
              status: matched.status || currentUser.status
            };
            setCurrentUser(updated);
            if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
            } else if (sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
              sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
            }
            showToast('info', 'Status Akun Diperbarui', `Status member kamu sekarang adalah ${matched.role} (${matched.validUntil}).`);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('focus', onFocusSync);
    return () => window.removeEventListener('focus', onFocusSync);
  }, [currentUser]);

  // Dynamically compute progress for each course based on user's completedEpisodes
  const enrichedCourses = useMemo(() => {
    return courses.map(course => {
      const episodes = course.episodes || [];
      const totalEpisodes = episodes.length;
      if (totalEpisodes === 0) {
        return {
          ...course,
          totalEpisodes: 0,
          completedEpisodes: 0,
          progressPercentage: 0
        };
      }
      const completedCount = episodes.filter(ep => !!completedEpisodes[`${course.id}-${ep.id}`]).length;
      const progressPercentage = Math.round((completedCount / totalEpisodes) * 100);
      const updatedEpisodes = episodes.map(ep => ({
        ...ep,
        completed: !!completedEpisodes[`${course.id}-${ep.id}`]
      }));

      return {
        ...course,
        totalEpisodes,
        completedEpisodes: completedCount,
        progressPercentage,
        episodes: updatedEpisodes
      };
    });
  }, [courses, completedEpisodes]);

  const activeCourse = enrichedCourses.find(c => c.id === activeCourseId || c.slug === activeCourseId) || enrichedCourses[0] || MOCK_COURSES[0];

  const setActiveCourseId = (id: string) => {
    setActiveCourseIdState(id);
    setCurrentView('course-detail');
    const foundCourse = enrichedCourses.find(c => c.id === id || c.slug === id);
    if (foundCourse) {
      trackRecentActivity({
        id: foundCourse.id,
        type: 'course',
        title: foundCourse.title,
        subtitle: foundCourse.subtitle,
        category: foundCourse.category,
        thumbnail: foundCourse.thumbnail,
        targetView: 'course-detail',
        targetId: foundCourse.id,
        progressPercentage: foundCourse.progressPercentage,
        badge: foundCourse.level
      });
    }
  };

  // Auth Operations
  const loginWithGoogle = async (
    googleData?: string | { email: string; name?: string; avatar?: string },
    rememberMe: boolean = true
  ) => {
    let targetEmail = 'kreator.ai@gmail.com';
    let targetName = '';
    let targetAvatar = '';

    if (typeof googleData === 'string') {
      targetEmail = googleData;
    } else if (googleData) {
      targetEmail = googleData.email || 'kreator.ai@gmail.com';
      targetName = googleData.name || '';
      targetAvatar = googleData.avatar || '';
    }

    const emailClean = targetEmail.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailClean);
    const existing = usersList.find(u => u.email.toLowerCase() === emailClean);
    const fallbackName = targetEmail.split('@')[0];

    const loggedUser: UserProfile = existing ? {
      ...existing,
      name: targetName || existing.name,
      avatar: targetAvatar || existing.avatar,
      role: isAdmin ? 'Admin' : existing.role
    } : {
      id: `u-${Date.now()}`,
      name: targetName || (isAdmin ? 'Admin FIKSI' : fallbackName),
      email: targetEmail,
      avatar: targetAvatar || (isAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'),
      role: isAdmin ? 'Admin' : 'Free Member',
      joinedDate: 'Hari ini',
      validUntil: isAdmin ? 'Lifetime VIP' : 'Free Tier',
      coursesCompleted: 0,
      savedPrompts: 0,
      totalDownloads: 0,
      streakDays: 1,
      status: 'Active'
    };

    saveUserSession(loggedUser, rememberMe);
    if (!existing) {
      setUsersList(prev => [loggedUser, ...prev]);
    }
    setIsAuthModalOpen(false);
    showToast('success', 'Berhasil Masuk dengan Akun Google', `Selamat datang, ${loggedUser.name}! (${loggedUser.role})`);

    // IMMEDIATELY SYNC / SAVE USER TO MONGODB DATABASE
    try {
      const dbUser = await api.syncUser({
        name: loggedUser.name,
        email: loggedUser.email,
        avatar: loggedUser.avatar,
        role: isAdmin ? 'Admin' : (existing?.role || loggedUser.role),
        status: loggedUser.status,
        validUntil: isAdmin ? 'Lifetime VIP' : (existing?.validUntil || loggedUser.validUntil),
        streakDays: loggedUser.streakDays,
        bookmarks: loggedUser.bookmarks
      });

      if (dbUser) {
        const finalUser: UserProfile = {
          ...loggedUser,
          id: dbUser.id || (dbUser as any)._id,
          role: dbUser.role || loggedUser.role,
          validUntil: dbUser.validUntil || loggedUser.validUntil,
          status: dbUser.status || loggedUser.status
        };
        saveUserSession(finalUser, rememberMe);
        setUsersList(prev => {
          const others = prev.filter(u => u.email.toLowerCase() !== emailClean);
          return [finalUser, ...others];
        });
        console.log('[Auth] User successfully stored in MongoDB Atlas:', finalUser);
      }
    } catch (err) {
      console.warn('Background MongoDB user sync error:', err);
    }
  };

  const loginWithEmail = async (creds: LoginCredentials, rememberMe: boolean = true): Promise<boolean> => {
    const emailClean = creds.email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailClean);
    const existing = usersList.find(u => u.email.toLowerCase() === emailClean);

    let loggedUser: UserProfile;
    if (existing) {
      loggedUser = { ...existing, role: isAdmin ? 'Admin' : existing.role };
    } else {
      loggedUser = {
        id: `u-${Date.now()}`,
        name: isAdmin ? 'Admin FIKSI' : emailClean.split('@')[0],
        email: creds.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: isAdmin ? 'Admin' : 'Free Member',
        joinedDate: 'Hari ini',
        validUntil: isAdmin ? 'Lifetime VIP' : 'Free Tier',
        coursesCompleted: 0,
        savedPrompts: 0,
        totalDownloads: 0,
        streakDays: 1,
        status: 'Aktif'
      };
      setUsersList(prev => [loggedUser, ...prev]);
    }

    const shouldRemember = creds.rememberMe !== undefined ? creds.rememberMe : rememberMe;
    saveUserSession(loggedUser, shouldRemember);
    setIsAuthModalOpen(false);
    showToast('success', 'Login Berhasil', `Selamat datang kembali, ${loggedUser.name}! Role: ${loggedUser.role}`);

    // SYNC USER TO MONGODB DATABASE
    try {
      const dbUser = await api.syncUser({
        name: loggedUser.name,
        email: loggedUser.email,
        avatar: loggedUser.avatar,
        role: isAdmin ? 'Admin' : (existing?.role || loggedUser.role),
        status: loggedUser.status,
        validUntil: isAdmin ? 'Lifetime VIP' : (existing?.validUntil || loggedUser.validUntil),
        streakDays: loggedUser.streakDays
      });
      if (dbUser) {
        const finalUser: UserProfile = {
          ...loggedUser,
          id: dbUser.id || (dbUser as any)._id,
          role: dbUser.role || loggedUser.role,
          validUntil: dbUser.validUntil || loggedUser.validUntil,
          status: dbUser.status || loggedUser.status
        };
        saveUserSession(finalUser, shouldRemember);
        setUsersList(prev => {
          const others = prev.filter(u => u.email.toLowerCase() !== emailClean);
          return [finalUser, ...others];
        });
      }
    } catch (err) {
      console.warn('Background MongoDB user sync error:', err);
    }

    return true;
  };

  const registerWithEmail = async (data: RegisterData, rememberMe: boolean = true): Promise<boolean> => {
    const emailClean = data.email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(emailClean);

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      name: data.name || (isAdmin ? 'Admin FIKSI' : 'Kreator AI'),
      email: data.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      role: isAdmin ? 'Admin' : 'Free Member',
      joinedDate: 'Hari ini',
      validUntil: isAdmin ? 'Lifetime VIP' : 'Free Tier',
      coursesCompleted: 0,
      savedPrompts: 0,
      totalDownloads: 0,
      streakDays: 1,
      status: 'Active'
    };

    setUsersList(prev => [newUser, ...prev]);
    const shouldRemember = data.rememberMe !== undefined ? data.rememberMe : rememberMe;
    saveUserSession(newUser, shouldRemember);
    setIsAuthModalOpen(false);
    showToast('success', 'Registrasi Berhasil', `Akun ${newUser.email} terdaftar sebagai ${newUser.role}.`);

    // SYNC NEW REGISTERED USER TO MONGODB DATABASE
    try {
      const dbUser = await api.syncUser({
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        status: newUser.status,
        validUntil: newUser.validUntil,
        streakDays: newUser.streakDays
      });
      if (dbUser) {
        const finalUser = { ...newUser, id: dbUser.id || (dbUser as any)._id };
        saveUserSession(finalUser, shouldRemember);
        setUsersList(prev => {
          const others = prev.filter(u => u.email.toLowerCase() !== emailClean);
          return [finalUser, ...others];
        });
      }
    } catch (err) {
      console.warn('Background MongoDB user sync error:', err);
    }

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {
      // ignore
    }
    setCurrentView('landing');
    setIsAuthModalOpen(true);
    showToast('info', 'Logout Berhasil', 'Anda telah keluar dari sesi.');
  };

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id'>): Course => {
    const slug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCourse: Course = {
      ...courseData,
      id: slug,
      slug,
      progressPercentage: 0,
      completedEpisodes: 0,
      totalEpisodes: courseData.episodes ? courseData.episodes.length : 0,
      resources: courseData.resources || []
    };
    setCourses(prev => {
      const updated = [newCourse, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.createCourse(courseData).catch((err: any) => console.warn('Failed to create course in DB:', err));
    showToast('success', 'Kursus Ditambahkan', `"${newCourse.title}" sekarang live dan dapat diakses public.`);
    return newCourse;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(prev => {
      const list = prev.map(c => (c.id === id || (c as any).slug === id || (c as any).dbId === id) ? { ...c, ...updated } : c);
      try { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(list)); } catch {}
      return list;
    });
    api.updateCourse(id, updated).catch((err: any) => console.warn('Failed to update course in DB:', err));
    showToast('success', 'Kursus Diperbarui', 'Perubahan kursus berhasil disimpan.');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== id && (c as any).slug !== id && (c as any).dbId !== id);
      try { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.deleteCourse(id).catch((err: any) => console.warn('Failed to delete course in DB:', err));
    showToast('info', 'Kursus Dihapus', 'Kursus berhasil dihapus dari sistem & database.');
  };

  // Prompt CRUD
  const addPrompt = (promptData: Omit<PromptPack, 'id'>): PromptPack => {
    const newId = `prompt-${Date.now()}`;
    const newPrompt: PromptPack = {
      ...promptData,
      id: newId,
      usageCount: promptData.usageCount || 0,
      isNew: true,
      tags: promptData.tags || ['AI', 'Prompt']
    };
    setPrompts(prev => {
      const updated = [newPrompt, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.createPrompt(promptData).catch((err: any) => console.warn('Failed to create prompt in DB:', err));
    showToast('success', 'Prompt Ditambahkan', `"${newPrompt.title}" berhasil diterbitkan.`);
    return newPrompt;
  };

  const updatePrompt = (id: string, updated: Partial<PromptPack>) => {
    setPrompts(prev => {
      const list = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      try { localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(list)); } catch {}
      return list;
    });
    api.updatePrompt(id, updated).catch((err: any) => console.warn('Failed to update prompt in DB:', err));
    showToast('success', 'Prompt Diperbarui', 'Perubahan prompt berhasil disimpan.');
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => {
      const updated = prev.filter(p => p.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.deletePrompt(id).catch((err: any) => console.warn('Failed to delete prompt in DB:', err));
    showToast('info', 'Prompt Dihapus', 'Prompt dihapus dari katalog & database.');
  };

  const incrementPromptUsage = (id: string) => {
    setPrompts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, usageCount: (p.usageCount || 0) + 1 };
      }
      return p;
    }));
  };

  // Asset CRUD
  const addAsset = (assetData: Omit<DownloadAsset, 'id'>): DownloadAsset => {
    const newId = `asset-${Date.now()}`;
    const newAsset: DownloadAsset = {
      ...assetData,
      id: newId,
      downloadsCount: 0,
      tags: assetData.tags || ['Creative Asset']
    };
    setAssets(prev => {
      const updated = [newAsset, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.createAsset(assetData).catch((err: any) => console.warn('Failed to create asset in DB:', err));
    showToast('success', 'Aset Ditambahkan', `"${newAsset.title}" sekarang live di Assets.`);
    return newAsset;
  };

  const updateAsset = (id: string, updated: Partial<DownloadAsset>) => {
    setAssets(prev => {
      const list = prev.map(a => a.id === id ? { ...a, ...updated } : a);
      try { localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(list)); } catch {}
      return list;
    });
    api.updateAsset(id, updated).catch((err: any) => console.warn('Failed to update asset in DB:', err));
    showToast('success', 'Aset Diperbarui', 'Perubahan aset berhasil disimpan.');
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => {
      const updated = prev.filter(a => a.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.deleteAsset(id).catch((err: any) => console.warn('Failed to delete asset in DB:', err));
    showToast('info', 'Aset Dihapus', 'Aset berhasil dihapus dari katalog.');
  };

  // External AI Tools CRUD
  const addExternalTool = (toolData: Omit<ExternalTool, 'id'>): ExternalTool => {
    const newTool: ExternalTool = {
      ...toolData,
      id: `tool-${Date.now()}`,
      tags: toolData.tags || ['AI Tool']
    };
    setExternalTools(prev => {
      const updated = [newTool, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.createTool(toolData).catch((err: any) => console.warn('Failed to create tool in DB:', err));
    showToast('success', 'Tool AI Ditambahkan', `"${newTool.name}" berhasil diterbitkan ke direktori.`);
    return newTool;
  };

  const updateExternalTool = (id: string, updated: Partial<ExternalTool>) => {
    setExternalTools(prev => {
      const list = prev.map(t => t.id === id ? { ...t, ...updated } : t);
      try { localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(list)); } catch {}
      return list;
    });
    api.updateTool(id, updated).catch((err: any) => console.warn('Failed to update tool in DB:', err));
    showToast('success', 'Tool AI Diperbarui', 'Perubahan data tool berhasil disimpan.');
  };

  const deleteExternalTool = (id: string) => {
    setExternalTools(prev => {
      const updated = prev.filter(t => t.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated)); } catch {}
      return updated;
    });
    api.deleteTool(id).catch((err: any) => console.warn('Failed to delete tool in DB:', err));
    showToast('info', 'Tool Dihapus', 'Tool eksternal telah dihapus dari direktori.');
  };

  // User CMS Actions
  const updateUserRole = (emailOrId: string, newRole: UserRole) => {
    let targetUser: UserProfile | undefined;
    setUsersList(prev => prev.map(u => {
      if (u.id === emailOrId || u.email.toLowerCase() === emailOrId.toLowerCase()) {
        targetUser = { ...u, role: newRole };
        return targetUser;
      }
      return u;
    }));

    const identifier = targetUser?.id || targetUser?.email || emailOrId;
    api.updateUser(identifier, { role: newRole }).catch(err => console.warn('Failed to update role in MongoDB:', err));

    if (currentUser && (currentUser.id === emailOrId || currentUser.email.toLowerCase() === emailOrId.toLowerCase())) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    showToast('success', 'Role Diperbarui', `Role user berhasil diubah menjadi ${newRole}.`);
  };

  const updateUserTier = (emailOrId: string, newRole: UserRole, validUntil?: string, status?: string) => {
    let targetUser: UserProfile | undefined;
    const computedValidUntil = validUntil !== undefined 
      ? validUntil 
      : (newRole === 'Admin' ? 'Lifetime VIP' : newRole === 'Pro Member' ? '1 Tahun (17 Agu 2027)' : 'Free Tier');
    const computedStatus = status !== undefined ? status : 'Aktif';

    setUsersList(prev => prev.map(u => {
      if (u.id === emailOrId || u.email.toLowerCase() === emailOrId.toLowerCase()) {
        targetUser = {
          ...u,
          role: newRole,
          validUntil: computedValidUntil,
          status: computedStatus
        };
        return targetUser;
      }
      return u;
    }));

    const identifier = targetUser?.id || targetUser?.email || emailOrId;
    api.updateUser(identifier, {
      role: newRole,
      validUntil: computedValidUntil,
      status: computedStatus
    }).catch(err => console.warn('Failed to update tier in MongoDB:', err));

    if (currentUser && (currentUser.id === emailOrId || currentUser.email.toLowerCase() === emailOrId.toLowerCase())) {
      setCurrentUser(prev => prev ? {
        ...prev,
        role: newRole,
        validUntil: computedValidUntil,
        status: computedStatus
      } : null);
    }

    showToast('success', 'Tier Member Diperbarui', `Status member diubah ke ${newRole} (${computedValidUntil}).`);
  };

  const deleteUser = (emailOrId: string) => {
    const target = usersList.find(u => u.id === emailOrId || u.email.toLowerCase() === emailOrId.toLowerCase());
    setUsersList(prev => prev.filter(u => u.id !== emailOrId && u.email.toLowerCase() !== emailOrId.toLowerCase()));
    const identifier = target?.id || target?.email || emailOrId;
    api.deleteUser(identifier).catch(err => console.warn('Failed to delete user in MongoDB:', err));
    showToast('info', 'User Dihapus', 'Data pengguna berhasil dihapus.');
  };

  // QRIS Payment Checkout Operations
  const createQRISPayment = async (
    plan: { id: string; name: string; amount: number; formattedAmount: string }, 
    proofImage?: string,
    customQrisRef?: string
  ): Promise<QRISPaymentTransaction> => {
    const user = currentUser || {
      id: `u-${Date.now()}`,
      name: 'Member Baru',
      email: 'member@email.com'
    };

    const qrisRef = customQrisRef || `QRIS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTrxData: Partial<QRISPaymentTransaction> = {
      userId: user.id || `u-${Date.now()}`,
      userName: user.name,
      userEmail: user.email,
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      formattedAmount: plan.formattedAmount,
      qrisRef: qrisRef,
      paymentMethod: 'QRIS',
      proofImage: proofImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      status: 'Pending',
      notes: 'Pembayaran QRIS via E-Wallet / Mobile Banking'
    };

    let finalTransaction: QRISPaymentTransaction;
    try {
      const saved = await api.createTransaction(newTrxData);
      if (saved) {
        finalTransaction = {
          ...saved,
          createdAt: typeof saved.createdAt === 'string' ? saved.createdAt : 'Baru saja'
        };
      } else {
        finalTransaction = {
          id: `trx-${Date.now()}`,
          ...(newTrxData as any),
          createdAt: 'Baru saja'
        };
      }
    } catch (e) {
      console.warn('API createTransaction failed, using local fallback:', e);
      finalTransaction = {
        id: `trx-${Date.now()}`,
        ...(newTrxData as any),
        createdAt: 'Baru saja'
      };
    }

    setPaymentTransactions(prev => [finalTransaction, ...prev.filter(t => t.id !== finalTransaction.id)]);
    showToast('success', 'Pembayaran QRIS Terkirim', 'Transaksi kamu sedang menunggu verifikasi admin. Tier Pro akan segera aktif.');
    return finalTransaction;
  };

  const approveQRISPayment = async (transactionId: string) => {
    let targetUserEmail = '';
    let targetPlanName = '';

    setPaymentTransactions(prev => prev.map(t => {
      if (t.id === transactionId || t.qrisRef === transactionId) {
        targetUserEmail = t.userEmail;
        targetPlanName = t.planName;
        return { ...t, status: 'Approved' };
      }
      return t;
    }));

    // Update Transaction status in MongoDB Atlas
    api.updateTransaction(transactionId, { status: 'Approved' })
      .catch(err => console.warn('Failed to update transaction status in MongoDB:', err));

    if (targetUserEmail) {
      const isLifetime = targetPlanName.toLowerCase().includes('lifetime');
      const validityString = isLifetime ? 'Lifetime VIP' : '1 Tahun (17 Agu 2027)';
      
      // Update local state
      setUsersList(prev => prev.map(u => {
        if (u.email.toLowerCase() === targetUserEmail.toLowerCase()) {
          return {
            ...u,
            role: 'Pro Member',
            validUntil: validityString,
            status: 'Aktif'
          };
        }
        return u;
      }));

      // Update user in MongoDB Atlas
      api.updateUser(targetUserEmail, {
        role: 'Pro Member',
        validUntil: validityString,
        status: 'Active'
      }).catch(err => console.warn('Failed to upgrade user in MongoDB:', err));

      if (currentUser && currentUser.email.toLowerCase() === targetUserEmail.toLowerCase()) {
        setCurrentUser(prev => prev ? {
          ...prev,
          role: 'Pro Member',
          validUntil: validityString,
          status: 'Aktif'
        } : null);
      }
    }

    showToast('success', 'Pembayaran Disetujui', `User ${targetUserEmail} berhasil diupgrade ke Pro Member!`);
  };

  const rejectQRISPayment = async (transactionId: string, reason?: string) => {
    setPaymentTransactions(prev => prev.map(t => {
      if (t.id === transactionId || t.qrisRef === transactionId) {
        return { ...t, status: 'Rejected', notes: reason ? `Ditolak: ${reason}` : 'Ditolak oleh admin' };
      }
      return t;
    }));

    api.updateTransaction(transactionId, {
      status: 'Rejected',
      notes: reason ? `Ditolak: ${reason}` : 'Ditolak oleh admin'
    }).catch(err => console.warn('Failed to reject transaction in MongoDB:', err));

    showToast('info', 'Pembayaran Ditolak', 'Status transaksi diubah menjadi Ditolak.');
  };

  const toggleBookmark = (promptId: string) => {
    setBookmarks(prev => {
      const isSaved = prev.includes(promptId);
      const next = isSaved ? prev.filter(id => id !== promptId) : [...prev, promptId];
      showToast(
        isSaved ? 'info' : 'success',
        isSaved ? 'Dihapus dari Bookmark' : 'Disimpan ke Bookmark',
        isSaved ? 'Prompt telah dihapus dari koleksi kamu.' : 'Prompt telah ditambahkan ke koleksi kamu.'
      );
      return next;
    });
  };

  const toggleEpisodeCompletion = (courseId: string, episodeId: string) => {
    const key = `${courseId}-${episodeId}`;
    setCompletedEpisodes(prev => {
      const isDone = !!prev[key];
      const next = { ...prev, [key]: !isDone };
      showToast(
        !isDone ? 'success' : 'info',
        !isDone ? 'Episode Selesai!' : 'Status Diperbarui',
        !isDone ? 'Progres belajar kamu berhasil diperbarui.' : 'Status episode diubah ke belum selesai.'
      );
      return next;
    });
  };

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const hideToast = () => {
    setToast(null);
  };

  const copyToClipboard = (text: string, label: string = 'Prompt Formula') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', `${label} Berhasil Disalin!`, 'Prompt siap digunakan di AI Generator pilihanmu.');
    }).catch(() => {
      showToast('warning', 'Gagal Menyalin', 'Silakan salin secara manual.');
    });
  };

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const { view, extraId } = getViewFromPathname();
      setCurrentView(view);
      if (view === 'course-detail' && extraId) {
        setActiveCourseIdState(extraId);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const refreshUsers = async () => {
    try {
      const dbUsers = await api.getUsers();
      if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
        showToast('success', 'Database User Disinkronkan', `Berhasil memuat ${dbUsers.length} user langsung dari MongoDB Atlas.`);
      } else {
        showToast('info', 'Sinkronisasi Selesai', 'Tidak ada data user tambahan di MongoDB Atlas.');
      }
    } catch {
      showToast('warning', 'Gagal Memuat User', 'Tidak dapat terhubung ke MongoDB Atlas.');
    }
  };

  const navigateTo = (view: ViewMode, extraId?: string) => {
    setCurrentView(view);
    const newPath = getPathFromView(view, extraId);
    if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
      window.history.pushState({ view, extraId }, '', newPath);
    }

    if (view === 'course-detail' && extraId) {
      setActiveCourseId(extraId);
      const foundCourse = courses.find(c => c.id === extraId || c.slug === extraId);
      if (foundCourse) {
        trackRecentActivity({
          id: foundCourse.id,
          type: 'course',
          title: foundCourse.title,
          subtitle: foundCourse.subtitle,
          category: foundCourse.category,
          thumbnail: foundCourse.thumbnail,
          targetView: 'course-detail',
          targetId: foundCourse.id,
          progressPercentage: foundCourse.progressPercentage,
          badge: foundCourse.level
        });
      }
    }
    if (view === 'blog' && extraId) {
      const foundBlog = MOCK_BLOGS.find(b => b.id === extraId);
      if (foundBlog) {
        setSelectedBlog(foundBlog);
        trackRecentActivity({
          id: foundBlog.id,
          type: 'blog',
          title: foundBlog.title,
          category: foundBlog.category,
          thumbnail: foundBlog.coverImage,
          targetView: 'blog',
          targetId: foundBlog.id,
          badge: foundBlog.readTime
        });
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetDataToDefaults = () => {
    setCourses(MOCK_COURSES);
    setPrompts(MOCK_PROMPTS);
    setAssets(MOCK_ASSETS);
    setExternalTools(MOCK_EXTERNAL_TOOLS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.PROMPTS);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.TOOLS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_ACTIVITY);
    localStorage.removeItem(`${STORAGE_KEYS.RECENT_ACTIVITY}_guest`);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_EPISODES);
    localStorage.removeItem(`${STORAGE_KEYS.COMPLETED_EPISODES}_guest`);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(`${STORAGE_KEYS.BOOKMARKS}_guest`);
    if (currentUser?.id) {
      localStorage.removeItem(`${STORAGE_KEYS.RECENT_ACTIVITY}_${currentUser.id}`);
      localStorage.removeItem(`${STORAGE_KEYS.COMPLETED_EPISODES}_${currentUser.id}`);
      localStorage.removeItem(`${STORAGE_KEYS.BOOKMARKS}_${currentUser.id}`);
    }
    setRecentActivity([]);
    setCompletedEpisodes({});
    setBookmarks([]);
    showToast('info', 'Data Direset', 'Semua data telah dikembalikan ke standar awal.');
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      currentView,
      setCurrentView,
      navigateTo,
      currentUser,
      userRole,
      setUserRole,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
      courses: enrichedCourses,
      activeCourse,
      setActiveCourseId,
      addCourse,
      updateCourse,
      deleteCourse,
      prompts,
      selectedPrompt,
      setSelectedPrompt,
      addPrompt,
      updatePrompt,
      deletePrompt,
      incrementPromptUsage,
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
      isUpgradeModalOpen,
      setIsUpgradeModalOpen,
      createQRISPayment,
      approveQRISPayment,
      rejectQRISPayment,
      selectedBlog,
      setSelectedBlog,
      bookmarks,
      toggleBookmark,
      completedEpisodes,
      toggleEpisodeCompletion,
      recentActivity,
      trackRecentActivity,
      clearRecentActivity,
      toast,
      showToast,
      hideToast,
      copyToClipboard,
      searchQuery,
      setSearchQuery,
      isSearchModalOpen,
      setIsSearchModalOpen,
      resetDataToDefaults
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
