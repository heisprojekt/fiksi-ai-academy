import React, { useState } from 'react';
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
  Search, 
  BookOpen, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Home, 
  ChevronRight, 
  Zap 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, bookmarks, userRole, setIsUpgradeModalOpen } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

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

  const mainPages = [
    { id: 'landing' as ViewMode, label: '/home', icon: Home },
    { id: 'dashboard' as ViewMode, label: '/dashboard', icon: LayoutDashboard },
    { id: 'courses' as ViewMode, label: '/courses', icon: GraduationCap },
    { id: 'prompts' as ViewMode, label: '/prompts', icon: Sparkles },
    { id: 'assets' as ViewMode, label: '/assets', icon: FolderDown },
    { id: 'tools' as ViewMode, label: '/tools', icon: Wrench, badge: 'DIR' },
    { id: 'blog' as ViewMode, label: '/articles', icon: BookOpen },
    { id: 'bookmarks' as ViewMode, label: '/bookmarks', icon: Bookmark, badge: bookmarks.length > 0 ? String(bookmarks.length) : undefined },
  ];

  if (userRole === 'Admin') {
    mainPages.push({ id: 'admin' as ViewMode, label: '/admin-cms', icon: ShieldCheck, badge: 'ADMIN' });
  }

  const filteredList = filterQuery 
    ? mainPages.filter(item => item.label.toLowerCase().includes(filterQuery.toLowerCase()))
    : mainPages;

  return (
    <aside className={`shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#0C0E14] min-h-[calc(100vh-64px)] transition-all duration-300 ${isCollapsed ? 'w-18 px-2 py-4' : 'w-60 lg:w-64 px-3 py-4'}`}>
      <div className="flex flex-col gap-3">

        {/* Studio Sidebar Container */}
        <div className="flex flex-col gap-2 p-2 rounded-2xl bg-white/90 dark:bg-[#12141C]/80 border border-slate-200 dark:border-white/[0.06] backdrop-blur-xl shadow-sm dark:shadow-lg">
          
          {/* Header Bar with Filter & Collapse */}
          {!isCollapsed ? (
            <div className="flex flex-col gap-2 pb-2 border-b border-slate-200/80 dark:border-white/[0.06]">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span>Navigasi</span>
                </div>
                <button
                  onClick={toggleCollapse}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  title="Lipat Sidebar"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Search Input */}
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3 h-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter menu..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-[#0B0C10] border border-slate-200/80 dark:border-white/[0.06] text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center pb-2 border-b border-slate-200/80 dark:border-white/[0.06]">
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                title="Buka Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Nav List / Routes */}
          <div className="flex flex-col gap-1">
            {filteredList.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'course-detail');

              return (
                <button
                  key={item.id + item.label}
                  onClick={() => navigateTo(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all group relative ${
                    isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-md shadow-cyan-500/25 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                    <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                    }`} />
                    {!isCollapsed && (
                      <span className="font-mono tracking-tight text-[12px]">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-0.5 border-t border-slate-200/80 dark:border-white/[0.06]" />

          {/* Settings Link */}
          <button
            onClick={() => navigateTo('profile')}
            title="/settings"
            className={`w-full flex items-center rounded-xl text-xs font-bold transition-all group ${
              isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
            } ${
              currentView === 'profile'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Settings className={`w-3.5 h-3.5 ${currentView === 'profile' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'}`} />
              {!isCollapsed && <span className="font-mono text-[12px]">/settings</span>}
            </div>
            {!isCollapsed && <ChevronRight className="w-3 h-3 opacity-40" />}
          </button>
        </div>

      </div>

      {/* Bottom Studio Member / Guest Card */}
      {!isCollapsed ? (
        <div className="p-3 rounded-2xl bg-white dark:bg-[#12141C] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs shadow-sm dark:shadow-md mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              {userRole === 'Pro Member' ? 'PRO VIP ACCOUNT' : userRole === 'Admin' ? 'ADMIN ACCESS' : 'GUEST CREATOR'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {userRole === 'Pro Member' ? 'Unlimited Access' : 'Free Sandbox'}
            </span>
          </div>
          {userRole === 'Free Member' ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[11px] font-black shadow-sm transition-all"
            >
              Upgrade
            </button>
          ) : (
            <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-current" />
          )}
        </div>
      ) : null}
    </aside>
  );
};
