import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  FolderDown, 
  Bookmark, 
  Wrench, 
  Settings, 
  ShieldCheck, 
  Crown,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, bookmarks, userRole } = useApp();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fiksi_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('fiksi_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: 'Courses', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: 'Prompt Library', icon: Sparkles },
    { id: 'assets' as ViewMode, label: 'Assets', icon: FolderDown },
    { id: 'tools' as ViewMode, label: 'AI Tools', icon: Wrench, badge: 'DIRECTORY' },
    { id: 'bookmarks' as ViewMode, label: 'Bookmarks', icon: Bookmark, badge: bookmarks.length },
  ];

  if (userRole === 'Admin') {
    navItems.push({ id: 'admin' as ViewMode, label: 'Admin Panel', icon: ShieldCheck, badge: 'ADMIN' });
  }

  return (
    <aside className={`shrink-0 hidden md:block py-6 transition-all duration-300 ${isCollapsed ? 'w-20 pr-3' : 'w-64 pr-6'}`}>
      <div className="sticky top-28 flex flex-col gap-4">

        {/* Sidebar Nav Container */}
        <div className="flex flex-col gap-1.5 p-2 rounded-3xl bg-[#121420]/70 border border-white/[0.06] backdrop-blur-xl shadow-lg shadow-black/20">
          
          {/* Header Toggle Button */}
          <div className={`flex items-center pb-2 mb-1 border-b border-white/[0.06] ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
            {!isCollapsed && (
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menu Utama
              </span>
            )}
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title={isCollapsed ? 'Buka Sidebar (Expand)' : 'Lipat Sidebar (Collapse ke Ikon)'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-violet-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Nav Items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'course-detail');

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                title={item.label}
                className={`w-full flex items-center rounded-2xl text-xs font-semibold transition-all group relative ${
                  isCollapsed ? 'justify-center py-3 px-0' : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className="relative flex items-center justify-center">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'
                    }`} />
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1.5 -right-2 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#121420]" />
                    )}
                  </div>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-slate-300 group-hover:bg-violet-500/20 group-hover:text-violet-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-1 border-t border-white/[0.06]" />

          {/* Settings Link */}
          <button
            onClick={() => navigateTo('profile')}
            title="Settings"
            className={`w-full flex items-center rounded-2xl text-xs font-semibold transition-all group ${
              isCollapsed ? 'justify-center py-3 px-0' : 'justify-between px-3.5 py-2.5'
            } ${
              currentView === 'profile'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <Settings className={`w-4 h-4 ${currentView === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'}`} />
              {!isCollapsed && <span>Settings</span>}
            </div>
            {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
          </button>
        </div>

        {/* Upgrade Banner Card */}
        {userRole !== 'Pro Member' && (
          isCollapsed ? (
            <button
              onClick={() => navigateTo('profile')}
              title="Upgrade to Pro VIP"
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/25 hover:scale-105 transition-all group"
            >
              <Crown className="w-5 h-5 animate-pulse" />
            </button>
          ) : (
            <GlassCard glow className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/25">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/30">
                  Akses VIP
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">Upgrade to Pro</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Akses prompt eksklusif & materi AI tanpa batas.
                </p>
              </div>

              <GradientButton
                size="sm"
                className="w-full text-xs py-2"
                onClick={() => navigateTo('profile')}
              >
                Upgrade VIP
              </GradientButton>
            </GlassCard>
          )
        )}

      </div>
    </aside>
  );
};
