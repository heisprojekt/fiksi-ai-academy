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
  KeyRound,
  LayoutDashboard,
  ChevronDown
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#08090E]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Official FIKSI AI Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Logo size="md" onClick={() => navigateTo('landing')} />
        </div>

        {/* Center: Clean, Uniform Search Bar Across ALL Views */}
        <div className="flex-1 max-w-lg hidden sm:block mx-2">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121420] border border-white/[0.07] text-slate-400 hover:border-violet-500/40 hover:bg-[#161928] hover:text-slate-200 transition-all text-xs shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
              <span className="line-clamp-1">Cari kursus masterclass, formula prompt, atau aset 3D...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-white/10 text-slate-300 rounded-lg border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Search Trigger for Mobile View */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden p-2.5 rounded-2xl bg-[#121420] border border-white/10 text-slate-300 hover:text-white"
            title="Cari konten"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* ========================================================================= */}
          {/* ADMIN POWERS: ALWAYS ALLOW SIMULATION AND 1-CLICK INSTANT RESTORE         */}
          {/* ========================================================================= */}
          {isAdminAccount && (
            <div className="flex items-center gap-2">
              {/* Role Simulator Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/25 text-xs shadow-sm">
                <Crown className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-violet-300 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Admin" className="bg-[#121420] text-white">👑 Mode: Admin Portal (CMS)</option>
                  <option value="Pro Member" className="bg-[#121420] text-violet-300">⚡ Simulasi Pro Member</option>
                  <option value="Free Member" className="bg-[#121420] text-slate-300">🔒 Simulasi Free Member</option>
                </select>
              </div>

              {/* Instant "Kembali ke Admin" Button if in Simulation */}
              {userRole !== 'Admin' && (
                <button
                  type="button"
                  onClick={() => setUserRole('Admin')}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all active:scale-95 animate-pulse"
                  title="Kembalikan mode ke Admin penuh tanpa perlu relog"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kembali ke Admin</span>
                </button>
              )}

              {/* Dedicated Admin Portal CMS Button when in Admin Role */}
              {userRole === 'Admin' && (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-violet-300" />
                  <span>Admin CMS</span>
                </button>
              )}
            </div>
          )}

          {/* Upgrade to Pro Button for Non-Admin Free Members */}
          {!isAdminAccount && userRole === 'Free Member' && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/25 transition-all active:scale-95 group"
            >
              <Crown className="w-3.5 h-3.5 text-violet-200 group-hover:scale-110 transition-transform" />
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
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </button>
              <GradientButton
                size="sm"
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
              >
                Daftar Member
              </GradientButton>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#121420] border border-white/[0.07] hover:border-violet-500/30 transition-all"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20"
                />
                <div className="hidden lg:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</span>
                  <span className="text-[10px] text-violet-300 font-semibold">{userRole}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[#121420] border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
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
                    <User className="w-4 h-4 text-violet-400" />
                    <span>Profil & Pengaturan</span>
                  </button>

                  {isAdminAccount && (
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-violet-300 hover:bg-violet-500/15 transition-colors text-left font-semibold"
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
