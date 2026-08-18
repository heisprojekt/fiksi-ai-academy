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
  Flame,
  Search,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  FileCode2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, bookmarks, userRole, setIsUpgradeModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'pages' | 'components'>('pages');
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

  const componentsPages = [
    { id: 'courses' as ViewMode, label: '/modules', icon: Layers },
    { id: 'prompts' as ViewMode, label: '/templates', icon: Sparkles },
    { id: 'assets' as ViewMode, label: '/downloads', icon: FolderDown },
    { id: 'profile' as ViewMode, label: '/settings', icon: Settings },
  ];

  if (userRole === 'Admin') {
    mainPages.push({ id: 'admin' as ViewMode, label: '/admin-cms', icon: ShieldCheck, badge: 'ADMIN' });
  }

  const currentList = activeTab === 'pages' ? mainPages : componentsPages;
  const filteredList = filterQuery 
    ? currentList.filter(item => item.label.toLowerCase().includes(filterQuery.toLowerCase()))
    : currentList;

  return (
    <aside className={`shrink-0 hidden md:block py-5 transition-all duration-300 ${isCollapsed ? 'w-18 pr-2' : 'w-64 pr-5'}`}>
      <div className="sticky top-20 flex flex-col gap-3">

        {/* Studio Sidebar Container */}
        <div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-[#12141C] border border-white/[0.08] backdrop-blur-xl shadow-xl shadow-black/40">
          
          {/* Header Segmented Pill Control: [ Pages | Components ] (from Reference Image) */}
          {!isCollapsed ? (
            <div className="flex flex-col gap-2 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center p-0.5 rounded-xl bg-[#0D0E14] border border-white/[0.06] w-full">
                  <button
                    onClick={() => setActiveTab('pages')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'pages'
                        ? 'bg-[#1E212D] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pages
                  </button>
                  <button
                    onClick={() => setActiveTab('components')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'components'
                        ? 'bg-[#1E212D] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Components
                  </button>
                </div>
                <button
                  onClick={toggleCollapse}
                  className="ml-1.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  title="Lipat Sidebar"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Search Input (like the Reference Image) */}
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3 h-3 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter pages..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-[11px] rounded-lg bg-[#0B0C10] border border-white/[0.06] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center pb-2 border-b border-white/[0.06]">
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg text-orange-400 hover:bg-white/[0.06] transition-colors"
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
                      ? 'bg-[#FF4D00] text-white shadow-md shadow-orange-500/30 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                    <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'
                    }`} />
                    {!isCollapsed && (
                      <span className="font-mono tracking-tight text-[12px]">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-slate-400 group-hover:bg-orange-500/20 group-hover:text-orange-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-0.5 border-t border-white/[0.06]" />

          {/* Settings Link */}
          <button
            onClick={() => navigateTo('profile')}
            title="/settings"
            className={`w-full flex items-center rounded-xl text-xs font-bold transition-all group ${
              isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
            } ${
              currentView === 'profile'
                ? 'bg-[#FF4D00] text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Settings className={`w-3.5 h-3.5 ${currentView === 'profile' ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`} />
              {!isCollapsed && <span className="font-mono text-[12px]">/settings</span>}
            </div>
            {!isCollapsed && <ChevronRight className="w-3 h-3 opacity-40" />}
          </button>
        </div>

        {/* Bottom Studio Member / Guest Card (from Reference Image Bottom Left) */}
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-[#0E1017] border border-white/[0.06] flex items-center justify-between text-xs shadow-md">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-mono">
                {userRole === 'Pro Member' ? 'PRO VIP ACCOUNT' : userRole === 'Admin' ? 'ADMIN ACCESS' : 'GUEST CREATOR'}
              </span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                {userRole === 'Pro Member' ? 'Unlimited Access' : 'Free Sandbox'}
              </span>
            </div>
            {userRole === 'Free Member' ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#FF4D00] hover:bg-[#FF5E19] text-white text-[11px] font-black shadow-sm transition-all"
              >
                Upgrade
              </button>
            ) : (
              <Flame className="w-4 h-4 text-orange-400 fill-current" />
            )}
          </div>
        ) : null}

      </div>
    </aside>
  );
};
