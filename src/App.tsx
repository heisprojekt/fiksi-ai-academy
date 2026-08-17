import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { SearchModal } from './components/ui/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { UpgradeModal } from './components/payment/UpgradeModal';

// Views
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { CourseView } from './components/course/CourseView';
import { PromptLibrary } from './components/prompts/PromptLibrary';
import { AssetsView } from './components/assets/AssetsView';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BlogView } from './components/blog/BlogView';
import { ToolsView } from './components/tools/ToolsView';

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
            {renderCurrentView()}
          </main>
        </div>
      ) : (
        /* Full Width Landing & Blog Area */
        <main className="flex-1 w-full">
          {renderCurrentView()}
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
