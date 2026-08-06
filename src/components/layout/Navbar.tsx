import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode, UserRole } from '../../types';
import { 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  ShieldCheck, 
  BookOpen, 
  FolderDown, 
  Layers, 
  Newspaper,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    navigateTo, 
    userRole, 
    setUserRole, 
    setIsSearchModalOpen,
    bookmarks 
  } = useApp();

  const isDashboardView = ['dashboard', 'courses', 'course-detail', 'prompts', 'assets', 'profile', 'admin'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060816]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Logo size="md" onClick={() => navigateTo('landing')} />

        {/* Center Nav Links (Landing / General) */}
        {!isDashboardView ? (
          <nav className="hidden md:flex items-center gap-1 bg-[#101827]/60 p-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentView === 'landing' 
                  ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => navigateTo('courses')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-all"
            >
              Kursus
            </button>
            <button
              onClick={() => navigateTo('prompts')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-all"
            >
              Prompt Library
            </button>
            <button
              onClick={() => navigateTo('assets')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-all"
            >
              Assets
            </button>
            <button
              onClick={() => navigateTo('blog')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-all"
            >
              Blog
            </button>
          </nav>
        ) : (
          /* Dashboard Top Search Bar */
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#101827]/70 border border-white/[0.08] text-slate-400 hover:border-white/20 hover:bg-[#172238]/60 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Cari kursus, prompt formula, atau aset 3D...</span>
              </div>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-white/10 text-slate-300 rounded-md border border-white/10">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right Section / Controls */}
        <div className="flex items-center gap-3">

          {/* Quick Role Switcher Simulation */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-accent-cyan font-bold focus:outline-none cursor-pointer"
            >
              <option value="Guest" className="bg-[#101827] text-slate-200">Guest / Public</option>
              <option value="Free Member" className="bg-[#101827] text-slate-200">Free Member</option>
              <option value="Pro Member" className="bg-[#101827] text-slate-200">Pro Member</option>
              <option value="Admin" className="bg-[#101827] text-slate-200">Admin Portal</option>
            </select>
          </div>

          {/* Search Icon Trigger for Mobile */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden p-2.5 rounded-2xl bg-[#101827] border border-white/10 text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dashboard Notifications */}
          {userRole !== 'Guest' && (
            <button className="relative p-2.5 rounded-2xl bg-[#101827] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-cyan" />
            </button>
          )}

          {/* CTA / User Profile Switch */}
          {userRole === 'Guest' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserRole('Pro Member')}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </button>
              <GradientButton
                size="sm"
                onClick={() => {
                  setUserRole('Pro Member');
                  navigateTo('dashboard');
                }}
              >
                Mulai Berlangganan
              </GradientButton>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigateTo('dashboard')}
                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isDashboardView 
                    ? 'bg-accent-blue/15 text-accent-cyan border border-accent-blue/30' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigateTo('profile')}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl bg-[#101827] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Heisy Avatar"
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-accent-purple/50 group-hover:scale-105 transition-transform"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">Heisy</span>
                  <span className="text-[10px] text-accent-cyan font-medium">{userRole}</span>
                </div>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
