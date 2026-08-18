import React, { useState } from 'react';
import { useApp, ADMIN_EMAILS } from '../../context/AppContext';
import { ViewMode, UserRole } from '../../types';
import { 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Crown, 
  LayoutDashboard,
  GraduationCap,
  FolderDown,
  Wrench,
  BookOpen,
  ChevronDown,
  Zap,
  Flame,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';

export const Navbar: React.FC = () => {
  const { 
    theme,
    toggleTheme,
    currentView, 
    navigateTo, 
    currentUser, 
    userRole, 
    setUserRole, 
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    setIsUpgradeModalOpen,
    setAuthMode,
    logout 
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Check if current logged-in account is an authorized Admin email
  const isAdminAccount = !!currentUser && ADMIN_EMAILS.includes(currentUser.email.trim().toLowerCase());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0B0C10]/95 backdrop-blur-2xl transition-all shadow-sm dark:shadow-none">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo size="md" onClick={() => navigateTo('landing')} />

          {/* Quick Route Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="text-slate-400 dark:text-slate-500">/app</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">{currentView}</span>
          </div>
        </div>

        {/* Center: Prominent Search Bar ("di header cukup pencarian saja") */}
        <div className="flex-1 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-100/90 dark:bg-[#13151D] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/50 hover:bg-white dark:hover:bg-[#181B26] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all text-xs group shadow-inner"
            title="Cari masterclass, formula prompt, AI tools... (Tekan ⌘K)"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-slate-500 dark:text-slate-400 text-xs truncate">Cari formula prompt, tools AI, masterclass...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-white/5 text-cyan-600 dark:text-cyan-400 rounded-lg border border-slate-200 dark:border-white/10 shrink-0 shadow-sm dark:shadow-none">
              <span>⌘</span><span>K</span>
            </kbd>
          </button>
        </div>

        {/* Right Section: Theme Toggle + Admin Controls + Upgrade / Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#13151D] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all shadow-sm dark:shadow-none flex items-center justify-center"
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Admin Simulation / CMS Controls */}
          {isAdminAccount && (
            <div className="flex items-center gap-1.5">
              {/* Role Simulator Dropdown */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs shadow-sm">
                <Crown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-purple-700 dark:text-purple-300 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Admin" className="bg-white dark:bg-[#13151D] text-slate-900 dark:text-white">👑 Admin Mode</option>
                  <option value="Pro Member" className="bg-white dark:bg-[#13151D] text-cyan-600 dark:text-cyan-300">⚡ Simulasi Pro</option>
                  <option value="Free Member" className="bg-white dark:bg-[#13151D] text-slate-700 dark:text-slate-300">🔒 Simulasi Free</option>
                </select>
              </div>

              {/* Dedicated Admin Portal CMS Button */}
              {userRole === 'Admin' && (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/30'
                      : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CMS</span>
                </button>
              )}
            </div>
          )}

          {/* Upgrade to Pro Button for Non-Admin Free Members */}
          {!isAdminAccount && userRole === 'Free Member' && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-cyan-500/25 transition-all active:scale-95 group"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-cyan-200" />
              <span>Upgrade Pro</span>
            </button>
          )}

          {/* Guest vs Logged In Member Controls */}
          {userRole === 'Guest' || !currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-cyan-500/25 transition-all"
              >
                Daftar
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#13151D] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-sm dark:shadow-none"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-white/20"
                />
                <div className="hidden lg:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{currentUser.name}</span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">{userRole}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#13151D] border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-100"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate">{currentUser.email}</span>
                    <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} size="sm" className="mt-1.5">
                      {userRole}
                    </Badge>
                  </div>

                  <button
                    onClick={() => {
                      navigateTo('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Profil & Pengaturan</span>
                  </button>

                  {isAdminAccount && (
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors text-left font-bold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin CMS Portal</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-t border-slate-200 dark:border-white/5 mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
