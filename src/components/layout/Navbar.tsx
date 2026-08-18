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
  Globe
} from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';

export const Navbar: React.FC = () => {
  const { 
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

  const navTabs = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: 'Courses', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: 'Prompts', icon: Sparkles },
    { id: 'assets' as ViewMode, label: 'Assets', icon: FolderDown },
    { id: 'tools' as ViewMode, label: 'AI Tools', icon: Wrench },
    { id: 'blog' as ViewMode, label: 'Articles', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0B0C10]/95 backdrop-blur-2xl transition-all">
      {/* Top Studio Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Left Section: macOS Traffic Lights + Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          {/* macOS Traffic Lights Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm hover:opacity-80 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm hover:opacity-80 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm hover:opacity-80 transition-opacity" />
          </div>

          <Logo size="md" onClick={() => navigateTo('landing')} />

          {/* Quick Route Breadcrumb */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-white/10 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">/app</span>
            <span className="text-slate-600">/</span>
            <span className="text-orange-400 font-bold uppercase">{currentView}</span>
          </div>
        </div>

        {/* Center: Sleek Studio Route Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#13151D] border border-white/[0.08] shadow-inner">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id || (tab.id === 'courses' && currentView === 'course-detail');
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FF4D00] text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Search + Admin Powers + Launch / Upgrade Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13151D] border border-white/[0.08] text-slate-400 hover:border-orange-500/40 hover:text-slate-200 transition-all text-xs group"
            title="Cari masterclass atau prompt (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors" />
            <span className="hidden md:inline text-[11px]">Cari...</span>
            <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-slate-400 rounded border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* ========================================================================= */}
          {/* ADMIN SIMULATION / CMS CONTROLS                                           */}
          {/* ========================================================================= */}
          {isAdminAccount && (
            <div className="flex items-center gap-1.5">
              {/* Role Simulator Dropdown */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-xs shadow-sm">
                <Crown className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-orange-300 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Admin" className="bg-[#13151D] text-white">👑 Admin Mode</option>
                  <option value="Pro Member" className="bg-[#13151D] text-orange-300">⚡ Simulasi Pro</option>
                  <option value="Free Member" className="bg-[#13151D] text-slate-300">🔒 Simulasi Free</option>
                </select>
              </div>

              {/* Dedicated Admin Portal CMS Button */}
              {userRole === 'Admin' && (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-[#FF4D00] text-white shadow-md shadow-orange-500/30'
                      : 'bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin CMS</span>
                </button>
              )}
            </div>
          )}

          {/* Upgrade to Pro Button for Non-Admin Free Members */}
          {!isAdminAccount && userRole === 'Free Member' && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E63600] hover:from-[#FF661A] hover:to-[#FF3D14] text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all active:scale-95 group"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-amber-200" />
              <span>Upgrade Pro</span>
            </button>
          )}

          {/* ========================================================================= */}
          {/* GUEST VS LOGGED IN MEMBER CONTROLS                                        */}
          {/* ========================================================================= */}
          {userRole === 'Guest' || !currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF4D00] hover:bg-[#FF5F1A] text-white text-xs font-black shadow-md shadow-orange-500/25 transition-all"
              >
                Daftar
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl bg-[#13151D] border border-white/[0.08] hover:border-orange-500/30 transition-all"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                />
                <div className="hidden lg:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</span>
                  <span className="text-[10px] text-orange-400 font-bold">{userRole}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[#13151D] border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-1">
                    <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block truncate">{currentUser.email}</span>
                    <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} size="sm" className="mt-1.5">
                      {userRole}
                    </Badge>
                  </div>

                  <button
                    onClick={() => {
                      navigateTo('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    <span>Profil & Pengaturan</span>
                  </button>

                  {isAdminAccount && (
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-orange-400 hover:bg-orange-500/15 transition-colors text-left font-bold"
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
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-t border-white/5 mt-1 pt-2"
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
