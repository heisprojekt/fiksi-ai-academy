import React, { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { SearchModal } from './components/ui/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { UpgradeModal } from './components/payment/UpgradeModal';

import { MobileNavigation } from './components/layout/MobileNavigation';

import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Resilient lazy loading helper that automatically retries and handles deployment cache mismatches
function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error: any) {
      console.warn('Dynamic import chunk failed, attempting auto-retry...', error);
      // If a deployment updated chunk hashes, refresh page once to fetch latest index.html
      const hasReloaded = window.sessionStorage.getItem('chunk_reload_triggered');
      if (!hasReloaded) {
        window.sessionStorage.setItem('chunk_reload_triggered', 'true');
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });
}

// Views - Code Split with resilient lazy loading
const LandingView = lazyWithRetry(() => import('./components/landing/LandingView').then(m => ({ default: m.LandingView })));
const DashboardView = lazyWithRetry(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const CourseView = lazyWithRetry(() => import('./components/course/CourseView').then(m => ({ default: m.CourseView })));
const PromptLibrary = lazyWithRetry(() => import('./components/prompts/PromptLibrary').then(m => ({ default: m.PromptLibrary })));
const AssetsView = lazyWithRetry(() => import('./components/assets/AssetsView').then(m => ({ default: m.AssetsView })));
const BookmarksView = lazyWithRetry(() => import('./components/bookmarks/BookmarksView').then(m => ({ default: m.BookmarksView })));
const ProfileView = lazyWithRetry(() => import('./components/profile/ProfileView').then(m => ({ default: m.ProfileView })));
const AdminDashboard = lazyWithRetry(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const BlogView = lazyWithRetry(() => import('./components/blog/BlogView').then(m => ({ default: m.BlogView })));
const ToolsView = lazyWithRetry(() => import('./components/tools/ToolsView').then(m => ({ default: m.ToolsView })));

const ViewLoadingFallback = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4 p-8 animate-in fade-in duration-200">
    <div className="relative flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      <div className="absolute w-4 h-4 rounded-full bg-cyan-500/30 animate-pulse" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider">Memuat studio canvas...</span>
      <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">FIKSI AI Studio</span>
    </div>
  </div>
);

export const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const isDashboardLayout = [
    'dashboard', 
    'courses', 
    'course-detail', 
    'prompts', 
    'assets', 
    'tools',
    'bookmarks', 
    'profile', 
    'admin'
  ].includes(currentView);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'courses':
      case 'course-detail':
        return <CourseView />;
      case 'prompts':
        return <PromptLibrary />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'assets':
        return <AssetsView />;
      case 'tools':
        return <ToolsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboard />;
      case 'blog':
        return <BlogView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 relative overflow-x-hidden transition-colors duration-200">
      
      {/* Studio Canvas Ambient Glows & Grid */}
      <div className="fixed inset-0 canvas-grid pointer-events-none opacity-40 -z-10" />
      <div className="fixed top-0 right-0 w-[650px] h-[550px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[550px] h-[450px] bg-gradient-to-t from-purple-600/10 via-pink-600/5 to-transparent blur-[130px] pointer-events-none -z-10" />

      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Body */}
      {isDashboardLayout && currentView !== 'landing' ? (
        <div className="flex-1 w-full flex min-h-[calc(100vh-64px)]">
          {/* Member Dashboard Sidebar - Docked flush to the far left on desktop */}
          <Sidebar />
          
          {/* Main Workspace Area */}
          <main className="flex-1 min-w-0 px-3 sm:px-8 lg:px-12 py-4 sm:py-6 max-w-7xl mx-auto w-full pb-28 md:pb-8">
            <ErrorBoundary>
              <Suspense fallback={<ViewLoadingFallback />}>
                <div key={currentView} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {renderCurrentView()}
                </div>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      ) : (
        <main className="flex-1 pb-24 md:pb-0">
          <ErrorBoundary>
            <Suspense fallback={<ViewLoadingFallback />}>
              <div key={currentView} className="animate-in fade-in duration-300">
                {renderCurrentView()}
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      )}

      {/* Mobile Sticky Bottom Navigation & Drawer */}
      <MobileNavigation />

      {/* Footer on Landing & Public Views */}
      {(currentView === 'landing' || currentView === 'blog') && <Footer />}

      {/* Toast Notifications Overlay */}
      <Toast />

      {/* Command-K Search Modal */}
      <SearchModal />

      {/* Google & Email Authentication Modal */}
      <AuthModal />

      {/* QRIS Membership Upgrade Modal */}
      <UpgradeModal />

    </div>
  );
};
