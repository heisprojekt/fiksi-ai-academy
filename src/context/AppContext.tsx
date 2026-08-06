import React, { createContext, useContext, useState } from 'react';
import { ViewMode, UserRole, PromptPack, Course, BlogArticle, ToastMessage } from '../types';
import { MOCK_COURSES, MOCK_PROMPTS, MOCK_BLOGS, MOCK_USER } from '../data/mockData';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeCourse: Course;
  setActiveCourseId: (id: string) => void;
  selectedPrompt: PromptPack | null;
  setSelectedPrompt: (prompt: PromptPack | null) => void;
  selectedBlog: BlogArticle;
  setSelectedBlog: (blog: BlogArticle) => void;
  bookmarks: string[];
  toggleBookmark: (promptId: string) => void;
  completedEpisodes: Record<string, boolean>;
  toggleEpisodeCompletion: (courseId: string, episodeId: string) => void;
  toast: ToastMessage | null;
  showToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  hideToast: () => void;
  copyToClipboard: (text: string, label?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  navigateTo: (view: ViewMode, extraId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [userRole, setUserRole] = useState<UserRole>('Pro Member');
  const [activeCourseId, setActiveCourseIdState] = useState<string>('omni-flash-masterclass');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptPack | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle>(MOCK_BLOGS[0]);
  const [bookmarks, setBookmarks] = useState<string[]>(['prompt-1', 'prompt-4']);
  const [completedEpisodes, setCompletedEpisodes] = useState<Record<string, boolean>>({
    'omni-flash-masterclass-ep-1': true,
    'omni-flash-masterclass-ep-2': true,
    'nano-banana-starter-nb-1': true,
    'nano-banana-starter-nb-2': true,
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const activeCourse = MOCK_COURSES.find(c => c.id === activeCourseId) || MOCK_COURSES[0];

  const setActiveCourseId = (id: string) => {
    setActiveCourseIdState(id);
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

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      userRole,
      setUserRole,
      activeCourse,
      setActiveCourseId,
      selectedPrompt,
      setSelectedPrompt,
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
      navigateTo
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
