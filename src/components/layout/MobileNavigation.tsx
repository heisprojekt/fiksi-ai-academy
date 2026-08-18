import React, { useState } from 'react';
import { useApp, ADMIN_EMAILS } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  Wrench, 
  FolderDown, 
  Bookmark, 
  BookOpen, 
  ShieldCheck, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Crown, 
  X, 
  Menu,
  ChevronRight,
  Zap,
  Home
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { GradientButton } from '../ui/GradientButton';

export const MobileNavigation: React.FC = () => {
  const { 
    currentView, 
    navigateTo, 
    currentUser, 
    userRole, 
    theme, 
    toggleTheme, 
    bookmarks,
    setIsAuthModalOpen,
    setIsUpgradeModalOpen,
    setAuthMode,
    logout 
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isAdminAccount = !!currentUser && ADMIN_EMAILS.includes(currentUser.email.trim().toLowerCase());

  const handleNavClick = (view: ViewMode) => {
    navigateTo(view);
    setIsDrawerOpen(false);
  };

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: 'Kursus', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: 'Prompt', icon: Sparkles },
    { id: 'tools' as ViewMode, label: 'Tools', icon: Wrench },
  ];

  const drawerMenu = [
    { id: 'landing' as ViewMode, label: 'Beranda / Landing', icon: Home },
    { id: 'dashboard' as ViewMode, label: 'Dashboard Belajar', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: 'Katalog Masterclass', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: 'Formula Prompt Library', icon: Sparkles },
    { id: 'assets' as ViewMode, label: 'Asset & Storyboard Pack', icon: FolderDown },
    { id: 'tools' as ViewMode, label: 'Direktori AI Tools', icon: Wrench },
    { id: 'bookmarks' as ViewMode, label: 'Simpanan Tersimpan', icon: Bookmark, count: bookmarks.length },
    { id: 'blog' as ViewMode, label: 'Artikel & Panduan AI', icon: BookOpen },
    { id: 'profile' as ViewMode, label: 'Profil & Pengaturan', icon: User },
  ];

  if (userRole === 'Admin') {
    drawerMenu.push({
      id: 'admin' as ViewMode,
      label: 'Admin Portal CMS',
      icon: ShieldCheck,
      badge: 'ADMIN'
    });
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. STICKY FROSTED-GLASS BOTTOM NAVIGATION BAR (MOBILE ONLY)              */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0C0E14]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/[0.08] px-2 py-1.5 shadow-2xl transition-all">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'course-detail');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* More Menu Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isDrawerOpen || currentView === 'profile' || currentView === 'bookmarks' || currentView === 'assets' || currentView === 'admin'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-500/50"
              />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.75]" />
            )}
            <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. FULL MOBILE SLIDE-OUT DRAWER / MODAL SHEET                            */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#11131C] border-t border-slate-200 dark:border-white/[0.1] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            
            {/* Drawer Handle & Header */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              <div className="w-full flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    FIKSI AI Academy Menu
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User Profile Card / Auth CTA */}
            {currentUser ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500/40 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} size="sm">
                  {userRole}
                </Badge>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Belum Masuk Akun?
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Login untuk simpan progres belajar, salin prompt, dan akses konten Pro.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <GradientButton
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Masuk Akun
                  </GradientButton>
                  <GradientButton
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Daftar Gratis
                  </GradientButton>
                </div>
              </div>
            )}

            {/* Pro Upgrade CTA Banner on Mobile Drawer */}
            {userRole === 'Free Member' && (
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsUpgradeModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-purple-600/20 border border-amber-500/40 text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Upgrade ke Pro Member
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Buka 530+ prompt & video masterclass
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Navigation Menu Links */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase px-2 mb-1">
                Semua Halaman
              </span>
              {drawerMenu.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <Badge variant="purple" size="sm">{item.badge}</Badge>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: Theme Toggle & Logout */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Mode Gelap</span>
                  </>
                )}
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold hover:bg-rose-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
