import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  FolderDown, 
  Download, 
  Bookmark, 
  Users, 
  RefreshCw, 
  Settings, 
  ShieldCheck, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, bookmarks, userRole } = useApp();

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: 'Courses', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: 'Prompt Library', icon: Sparkles },
    { id: 'assets' as ViewMode, label: 'Assets', icon: FolderDown },
    { id: 'downloads' as ViewMode, label: 'Downloads', icon: Download },
    { id: 'bookmarks' as ViewMode, label: 'Bookmarks', icon: Bookmark, badge: bookmarks.length },
    { id: 'community' as ViewMode, label: 'Community', icon: Users },
    { id: 'updates' as ViewMode, label: 'Updates', icon: RefreshCw, badge: 'v1.8' },
  ];

  if (userRole === 'Admin') {
    navItems.push({ id: 'admin' as ViewMode, label: 'Admin Panel', icon: ShieldCheck, badge: 'ADMIN' });
  }

  return (
    <aside className="w-64 shrink-0 hidden md:block py-6 pr-6">
      <div className="sticky top-28 flex flex-col gap-6">

        {/* Sidebar Nav Items */}
        <div className="flex flex-col gap-1.5 p-2 rounded-3xl bg-[#101827]/40 border border-white/[0.06] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'course-detail');

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-accent text-white shadow-lg shadow-accent-purple/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-accent-cyan'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-slate-300 group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-1 border-t border-white/[0.06]" />

          {/* Profile Settings Link */}
          <button
            onClick={() => navigateTo('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all group ${
              currentView === 'profile'
                ? 'bg-gradient-accent text-white shadow-lg shadow-accent-purple/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${currentView === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-accent-cyan'}`} />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        </div>

        {/* Upgrade Banner Card */}
        {userRole !== 'Pro Member' && (
          <GlassCard glow className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center text-white shadow-md shadow-accent-purple/30">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                Akses VIP
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Upgrade to Pro</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Akses semua konten premium, prompt pack eksklusif, & asset 3D tanpa batas.
              </p>
            </div>

            <GradientButton
              size="sm"
              className="w-full mt-1"
              onClick={() => navigateTo('profile')}
            >
              Upgrade Sekarang
            </GradientButton>
          </GlassCard>
        )}

      </div>
    </aside>
  );
};
