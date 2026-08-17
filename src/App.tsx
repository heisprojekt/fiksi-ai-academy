import React, { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { SearchModal } from './components/ui/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { UpgradeModal } from './components/payment/UpgradeModal';

// Views - Code Split with lazy loading for instant tab switching & lighter initial bundle
const LandingView = lazy(() => import('./components/landing/LandingView').then(m => ({ default: m.LandingView })));
const DashboardView = lazy(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const CourseView = lazy(() => import('./components/course/CourseView').then(m => ({ default: m.CourseView })));
const PromptLibrary = lazy(() => import('./components/prompts/PromptLibrary').then(m => ({ default: m.PromptLibrary })));
const AssetsView = lazy(() => import('./components/assets/AssetsView').then(m => ({ default: m.AssetsView })));
const BookmarksView = lazy(() => import('./components/bookmarks/BookmarksView').then(m => ({ default: m.BookmarksView })));
const ProfileView = lazy(() => import('./components/profile/ProfileView').then(m => ({ default: m.ProfileView })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const BlogView = lazy(() => import('./components/blog/BlogView').then(m => ({ default: m.BlogView })));
const ToolsView = lazy(() => import('./components/tools/ToolsView').then(m => ({ default: m.ToolsView })));

const ViewLoadingFallback = () => (
  <div className="w-full min-h-[360px] flex flex-col items-center justify-center gap-3 p-8 animate-in fade-in duration-150">
    <div className="w-8 h-8 rounded-full border-2 border-accent-purple border-t-accent-cyan animate-spin" />
    <span className="text-xs text-slate-400 font-mono tracking-wider">Memuat workspace...</span>
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
    <div className="min-h-screen flex flex-col bg-[#060816] text-slate-100 selection:bg-accent-purple/30 selection:text-accent-cyan">
      
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Body */}
      {isDashboardLayout && currentView !== 'landing' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
          {/* Member Dashboard Sidebar */}
          <Sidebar />
          
          {/* Main Workspace Area */}
          <main className="flex-1 min-w-0 py-6">
            <Suspense fallback={<ViewLoadingFallback />}>
              {renderCurrentView()}
            </Suspense>
          </main>
        </div>
      ) : (
        /* Full Width Landing & Blog Area */
        <main className="flex-1 w-full">
          <Suspense fallback={<ViewLoadingFallback />}>
            {renderCurrentView()}
          </Suspense>
        </main>
      )}

      {/* Footer */}
      <Footer />

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
