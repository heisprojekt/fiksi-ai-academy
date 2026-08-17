import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ExternalTool 
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
import { api } from '../services/api';

export const ADMIN_EMAILS = ['heisprojekt@gmail.com', 'fiksiaiai@gmail.com'];

interface AppContextType {
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
  createQRISPayment: (plan: { id: string; name: string; amount: number; formattedAmount: string }, proofImage?: string) => Promise<QRISPaymentTransaction>;
  approveQRISPayment: (transactionId: string) => void;
  rejectQRISPayment: (transactionId: string, reason?: string) => void;

  // Blogs & Updates
  selectedBlog: BlogArticle;
  setSelectedBlog: (blog: BlogArticle) => void;

  // User Interaction State
  bookmarks: string[];
  toggleBookmark: (promptId: string) => void;
  completedEpisodes: Record<string, boolean>;
  toggleEpisodeCompletion: (courseId: string, episodeId: string) => void;

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

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
      return saved ? JSON.parse(saved) : MOCK_COURSES;
    } catch {
      return MOCK_COURSES;
    }
  });

  // Load persistent prompts or fallback to MOCK_PROMPTS
  const [prompts, setPrompts] = useState<PromptPack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMPTS);
      if (saved) {
        const parsed: PromptPack[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(p => p.id));
        const newFromMock = MOCK_PROMPTS.filter(p => !existingIds.has(p.id));
        return [...parsed, ...newFromMock];
      }
      return MOCK_PROMPTS;
    } catch {
      return MOCK_PROMPTS;
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

  const [activeCourseId, setActiveCourseIdState] = useState<string>('omni-flash-masterclass');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptPack | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle>(MOCK_BLOGS[0]);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : ['prompt-1', 'prompt-4'];
    } catch {
      return ['prompt-1', 'prompt-4'];
    }
  });

  const [completedEpisodes, setCompletedEpisodes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_EPISODES);
      return saved ? JSON.parse(saved) : {
        'omni-flash-masterclass-ep-1': true,
        'omni-flash-masterclass-ep-2': true,
        'nano-banana-starter-nb-1': true,
        'nano-banana-starter-nb-2': true,
      };
    } catch {
      return {};
    }
  });

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
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_EPISODES, JSON.stringify(completedEpisodes));
  }, [completedEpisodes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  // Sync from MongoDB API on initial startup
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

        if (dbCourses && dbCourses.length > 0) setCourses(dbCourses);
        if (dbPrompts && dbPrompts.data && dbPrompts.data.length > 0) setPrompts(dbPrompts.data);
        if (dbAssets && dbAssets.length > 0) setAssets(dbAssets);
        if (dbTools && dbTools.length > 0) setExternalTools(dbTools);
        if (dbUsers && dbUsers.length > 0) setUsersList(dbUsers);
        if (dbTrxs && dbTrxs.length > 0) setPaymentTransactions(dbTrxs);
      } catch {
        // Fallback to local cache gracefully
      }
    };
    syncFromMongoDB();
  }, []);

  const activeCourse = courses.find(c => c.id === activeCourseId || c.slug === activeCourseId) || courses[0] || MOCK_COURSES[0];

  const setActiveCourseId = (id: string) => {
    setActiveCourseIdState(id);
    setCurrentView('course-detail');
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
      name: targetName || (isAdmin ? `${fallbackName} (Admin)` : `${fallbackName}`),
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
      status: 'Aktif'
    };

    saveUserSession(loggedUser, rememberMe);
    if (!existing) {
      setUsersList(prev => [loggedUser, ...prev]);
    }
    setIsAuthModalOpen(false);
    showToast('success', 'Berhasil Masuk dengan Akun Google', `Selamat datang, ${loggedUser.name}! (${loggedUser.role})`);
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
      status: 'Aktif'
    };

    setUsersList(prev => [newUser, ...prev]);
    const shouldRemember = data.rememberMe !== undefined ? data.rememberMe : rememberMe;
    saveUserSession(newUser, shouldRemember);
    setIsAuthModalOpen(false);
    showToast('success', 'Registrasi Berhasil', `Akun ${newUser.email} terdaftar sebagai ${newUser.role}.`);
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
    const newId = `course-${Date.now()}`;
    const newCourse: Course = {
      ...courseData,
      id: newId,
      slug: courseData.slug || newId,
      progressPercentage: 0,
      completedEpisodes: 0,
      totalEpisodes: courseData.episodes ? courseData.episodes.length : 0,
      resources: courseData.resources || []
    };
    setCourses(prev => [newCourse, ...prev]);
    api.createCourse(courseData).catch(() => {});
    showToast('success', 'Kursus Ditambahkan', `"${newCourse.title}" sekarang live dan dapat diakses public.`);
    return newCourse;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    api.updateCourse(id, updated).catch(() => {});
    showToast('success', 'Kursus Diperbarui', 'Perubahan kursus berhasil disimpan.');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    api.deleteCourse(id).catch(() => {});
    showToast('info', 'Kursus Dihapus', 'Kursus berhasil dihapus dari sistem.');
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
    setPrompts(prev => [newPrompt, ...prev]);
    api.createPrompt(promptData).catch(() => {});
    showToast('success', 'Prompt Ditambahkan', `"${newPrompt.title}" berhasil diterbitkan.`);
    return newPrompt;
  };

  const updatePrompt = (id: string, updated: Partial<PromptPack>) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    api.updatePrompt(id, updated).catch(() => {});
    showToast('success', 'Prompt Diperbarui', 'Perubahan prompt berhasil disimpan.');
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    api.deletePrompt(id).catch(() => {});
    showToast('info', 'Prompt Dihapus', 'Prompt dihapus dari katalog.');
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
    setAssets(prev => [newAsset, ...prev]);
    showToast('success', 'Aset Ditambahkan', `"${newAsset.title}" sekarang live di Assets.`);
    return newAsset;
  };

  const updateAsset = (id: string, updated: Partial<DownloadAsset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    showToast('success', 'Aset Diperbarui', 'Perubahan aset berhasil disimpan.');
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Aset Dihapus', 'Aset berhasil dihapus dari katalog.');
  };

  // External AI Tools CRUD
  const addExternalTool = (toolData: Omit<ExternalTool, 'id'>): ExternalTool => {
    const newTool: ExternalTool = {
      ...toolData,
      id: `tool-${Date.now()}`,
      tags: toolData.tags || ['AI Tool']
    };
    setExternalTools(prev => [newTool, ...prev]);
    showToast('success', 'Tool AI Ditambahkan', `"${newTool.name}" berhasil diterbitkan ke direktori.`);
    return newTool;
  };

  const updateExternalTool = (id: string, updated: Partial<ExternalTool>) => {
    setExternalTools(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    showToast('success', 'Tool AI Diperbarui', 'Perubahan data tool berhasil disimpan.');
  };

  const deleteExternalTool = (id: string) => {
    setExternalTools(prev => prev.filter(t => t.id !== id));
    showToast('info', 'Tool Dihapus', 'Tool eksternal telah dihapus dari direktori.');
  };

  // User CMS Actions
  const updateUserRole = (emailOrId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => (u.id === emailOrId || u.email === emailOrId) ? { ...u, role: newRole } : u));
    if (currentUser && (currentUser.id === emailOrId || currentUser.email === emailOrId)) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    showToast('success', 'Role Diperbarui', `Role user berhasil diubah menjadi ${newRole}.`);
  };

  const updateUserTier = (emailOrId: string, newRole: UserRole, validUntil?: string, status?: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === emailOrId || u.email === emailOrId) {
        return {
          ...u,
          role: newRole,
          validUntil: validUntil !== undefined ? validUntil : (newRole === 'Admin' ? 'Lifetime VIP' : newRole === 'Pro Member' ? '1 Tahun' : 'Free Tier'),
          status: status !== undefined ? status : u.status || 'Aktif'
        };
      }
      return u;
    }));

    if (currentUser && (currentUser.id === emailOrId || currentUser.email === emailOrId)) {
      setCurrentUser(prev => prev ? {
        ...prev,
        role: newRole,
        validUntil: validUntil !== undefined ? validUntil : (newRole === 'Admin' ? 'Lifetime VIP' : newRole === 'Pro Member' ? '1 Tahun' : 'Free Tier'),
        status: status !== undefined ? status : prev.status || 'Aktif'
      } : null);
    }

    showToast('success', 'Tier Member Diperbarui', `Status member diubah ke ${newRole} (${validUntil || 'Aktif'}).`);
  };

  const deleteUser = (emailOrId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== emailOrId && u.email !== emailOrId));
    showToast('info', 'User Dihapus', 'Data pengguna berhasil dihapus.');
  };

  // QRIS Payment Checkout Operations
  const createQRISPayment = async (plan: { id: string; name: string; amount: number; formattedAmount: string }, proofImage?: string): Promise<QRISPaymentTransaction> => {
    const user = currentUser || {
      id: `u-${Date.now()}`,
      name: 'Member Baru',
      email: 'member@email.com'
    };

    const newTransaction: QRISPaymentTransaction = {
      id: `trx-${Date.now()}`,
      userId: user.id || `u-${Date.now()}`,
      userName: user.name,
      userEmail: user.email,
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      formattedAmount: plan.formattedAmount,
      qrisRef: `QRIS-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'QRIS',
      proofImage: proofImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      status: 'Pending',
      createdAt: 'Baru saja',
      notes: 'Pembayaran QRIS via E-Wallet / Mobile Banking'
    };

    setPaymentTransactions(prev => [newTransaction, ...prev]);
    showToast('success', 'Pembayaran QRIS Terkirim', 'Transaksi kamu sedang menunggu verifikasi admin. Tier Pro akan segera aktif.');
    return newTransaction;
  };

  const approveQRISPayment = (transactionId: string) => {
    let targetUserEmail = '';
    let targetPlanName = '';

    setPaymentTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        targetUserEmail = t.userEmail;
        targetPlanName = t.planName;
        return { ...t, status: 'Approved' };
      }
      return t;
    }));

    if (targetUserEmail) {
      const isLifetime = targetPlanName.toLowerCase().includes('lifetime');
      const validityString = isLifetime ? 'Lifetime VIP' : '1 Tahun (17 Agu 2027)';
      
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

  const rejectQRISPayment = (transactionId: string, reason?: string) => {
    setPaymentTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return { ...t, status: 'Rejected', notes: reason ? `Ditolak: ${reason}` : 'Ditolak oleh admin' };
      }
      return t;
    }));

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

  const navigateTo = (view: ViewMode, extraId?: string) => {
    setCurrentView(view);
    if (view === 'course-detail' && extraId) {
      setActiveCourseId(extraId);
    }
    if (view === 'blog' && extraId) {
      const foundBlog = MOCK_BLOGS.find(b => b.id === extraId);
      if (foundBlog) setSelectedBlog(foundBlog);
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
    showToast('info', 'Data Direset', 'Semua data telah dikembalikan ke standar awal.');
  };

  return (
    <AppContext.Provider value={{
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
      courses,
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
