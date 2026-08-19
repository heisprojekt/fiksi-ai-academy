import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_WEEKLY_UPDATES, MOCK_COURSES } from '../../data/mockData';
import { buildFullPromptFormula, Course, PromptPack, RecentActivityItem } from '../../types';
import { 
  Play, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Flame, 
  RefreshCw, 
  Bookmark, 
  Copy, 
  Clock,
  History,
  Zap,
  BookOpen,
  Wrench,
  FolderDown,
  Trash2,
  CheckCircle2,
  Star,
  Award,
  Target,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

// Helper for relative timestamps (e.g. "Baru saja", "5 menit lalu", "Kemarin")
const formatRelativeTime = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Kemarin';
  return `${diffDays} hari lalu`;
};

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    userRole, 
    courses, 
    prompts, 
    externalTools,
    navigateTo, 
    copyToClipboard, 
    bookmarks, 
    toggleBookmark,
    recentActivity,
    clearRecentActivity,
    trackRecentActivity,
    completedEpisodes
  } = useApp();

  const latestUpdate = MOCK_WEEKLY_UPDATES[0];
  const userName = currentUser?.name || (userRole === 'Guest' ? 'Tamu / Kreator AI' : 'Kreator AI');
  
  // A new user has no recent activities, no completed episodes, and no bookmarks
  const isNewUser = recentActivity.length === 0 && Object.keys(completedEpisodes || {}).length === 0;

  // Check if user (guest or registered) has ever started or made progress in any masterclass
  const hasStartedMasterclass = useMemo(() => {
    const hasCourseInRecent = recentActivity.some(item => item.type === 'course');
    const hasCompletedEp = Object.keys(completedEpisodes || {}).some(k => !!completedEpisodes[k]);
    const hasCourseProgress = courses.some(c => (c.progressPercentage || 0) > 0);
    return hasCourseInRecent || hasCompletedEp || hasCourseProgress;
  }, [recentActivity, completedEpisodes, courses]);

  // Courses currently in progress or completed
  const coursesInProgress = useMemo(() => {
    const active = courses.filter(c => (c.progressPercentage || 0) > 0);
    if (active.length > 0) return active;
    const courseActivityIds = recentActivity.filter(i => i.type === 'course').map(i => i.targetId || i.id);
    return courses.filter(c => courseActivityIds.includes(c.id));
  }, [courses, recentActivity]);

  // Last accessed activity item
  const lastAccessed = recentActivity[0] as RecentActivityItem | undefined;

  // Last course accessed or first course in progress
  const activeCourseProgress = useMemo(() => {
    const defaultCourse = courses[0] || MOCK_COURSES[0];
    const courseActivity = recentActivity.find(item => item.type === 'course');
    if (courseActivity) {
      const found = courses.find(c => c.id === courseActivity.targetId || c.id === courseActivity.id);
      if (found) return found;
    }
    return courses.find(c => (c.progressPercentage || 0) > 0) || defaultCourse;
  }, [recentActivity, courses]);

  // Featured starter masterclass for recommendation
  const featuredStarterMasterclass = useMemo(() => {
    const defaultCourse = courses[0] || MOCK_COURSES[0];
    return courses.find(c => c.id === 'omni-flash-masterclass') || courses.find(c => c.isPopular) || defaultCourse;
  }, [courses]);

  // Personalized prompt recommendations based on last accessed category or AI Model
  const personalizedPrompts = useMemo(() => {
    if (!lastAccessed || !lastAccessed.category) {
      return prompts.filter(p => p.isPopular).slice(0, 4);
    }
    const matching = prompts.filter(p => 
      p.category.toLowerCase().includes(lastAccessed.category!.toLowerCase()) ||
      (lastAccessed.aiModel && p.aiModel.toLowerCase() === lastAccessed.aiModel.toLowerCase())
    );
    return matching.length >= 2 ? matching.slice(0, 4) : prompts.filter(p => p.isPopular).slice(0, 4);
  }, [lastAccessed, prompts]);

  // Recommended beginner starter courses for new users or users with no masterclass started
  const beginnerStarterCourses = useMemo(() => {
    const list = courses.length > 0 ? courses : MOCK_COURSES;
    const beginners = list.filter(c => c.level === 'Pemula');
    return beginners.length > 0 ? beginners.slice(0, 3) : list.slice(0, 3);
  }, [courses]);

  // Handle clicking a recent activity item
  const handleResumeActivity = (item: RecentActivityItem) => {
    navigateTo(item.targetView, item.targetId);
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-in fade-in duration-300">

      {/* ========================================================================= */}
      {/* HEADER GREETING SECTION                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Halo, {userName}
            </h1>
            <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} size="sm">
              {userRole.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isNewUser 
              ? 'Selamat datang di FIKSI AI Academy! Berikut rekomendasi kurikulum starter untuk memulai.' 
              : !hasStartedMasterclass
                ? 'Selamat datang kembali! Kamu belum memulai masterclass video AI — yuk pelajari alur dasarnya hari ini.'
                : 'Selamat datang kembali! Lanjutkan progres belajar dan eksplorasi prompt AI terbarumu.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GradientButton
            size="sm"
            variant="secondary"
            icon={<Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />}
            onClick={() => navigateTo('prompts')}
          >
            Jelajahi Prompt
          </GradientButton>
          <GradientButton
            size="sm"
            icon={<BookOpen className="w-3.5 h-3.5" />}
            onClick={() => navigateTo('courses')}
          >
            Semua Kursus
          </GradientButton>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC HERO SECTION                                                      */}
      {/* CASE 1: NEW USER ONBOARDING ROADMAP                                       */}
      {/* CASE 2: RETURNING USER WHO HAS NOT JOINED MASTERCLASS -> MASTERCLASS RECOM */}
      {/* CASE 3: RETURNING USER WITH ONGOING MASTERCLASS -> RESUME PROGRESS        */}
      {/* ========================================================================= */}
      {isNewUser ? (
        // -------------------------------------------------------------------------
        // STATE 1: AKUN BARU - 4-STEP ONBOARDING ROADMAP
        // -------------------------------------------------------------------------
        <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/5 dark:from-cyan-950/30 dark:via-[#13151D] dark:to-[#0B0C10] border border-cyan-500/25 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  Rekomendasi Akun Baru
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Panduan 4 Langkah Mulai Cepat</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Mulai Perjalanan Kreator AI Pertamamu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Kami telah menyusun alur belajar terbaik dari fondasi pembuatan karakter, video prompt engineering, hingga penggunaan tools generator AI terkini.
              </p>
            </div>
          </div>

          {/* 4 Interactive Starter Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-2 relative z-10">
            
            {/* Step 1: Masterclass Fondasi */}
            <div 
              onClick={() => navigateTo('course-detail', 'omni-flash-masterclass')}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <Badge variant="cyan" size="sm">Masterclass</Badge>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Fondasi Karakter AI
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  Omni Flash Masterclass • Tonton episode 1 untuk dasar konsistensi wajah.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                <span>Mulai Belajar</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Step 2: Formula Prompt Viral */}
            <div 
              onClick={() => navigateTo('prompts')}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <Badge variant="purple" size="sm">Formula Prompt</Badge>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Salin Prompt Populer
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  Gunakan formula prompt teruji untuk Midjourney, Flux, dan Kling AI.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                <span>Eksplorasi Prompt</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Step 3: AI Tools Rekomendasi */}
            <div 
              onClick={() => navigateTo('tools')}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold flex items-center justify-center font-mono">
                  3
                </span>
                <Badge variant="pro" size="sm">Tools AI</Badge>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Coba Tool Generator
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  Daftar curated tools video AI, voice clone, dan upscaler terbaik.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                <span>Buka Tools</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Step 4: Asset Pack Kreatif */}
            <div 
              onClick={() => navigateTo('assets')}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold flex items-center justify-center font-mono">
                  4
                </span>
                <Badge variant="outline" size="sm">Creative Assets</Badge>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  Download Asset Pack
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  Unduh preset LUT, overlay PNG, dan storyboard template siap pakai.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 flex items-center gap-1">
                <span>Download Aset</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

          </div>
        </div>
      ) : !hasStartedMasterclass ? (
        // -------------------------------------------------------------------------
        // STATE 2: RETURNING USER WHO HAS NOT YET ENROLLED IN MASTERCLASS
        // -------------------------------------------------------------------------
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-purple-600/10 dark:from-cyan-950/40 dark:via-[#13151D] dark:to-[#0B0C10] border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={featuredStarterMasterclass?.thumbnail || MOCK_COURSES[0].thumbnail}
                  alt={featuredStarterMasterclass?.title || 'Masterclass Starter'}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-cyan-500 text-white shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono font-black text-cyan-700 dark:text-cyan-300 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    REKOMENDASI MASTERCLASS PERTAMA
                  </span>
                  <Badge variant="cyan" size="sm">{featuredStarterMasterclass?.level || 'Menengah'}</Badge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold">
                    {featuredStarterMasterclass?.episodes?.length || 5} Episode Lengkap
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Belum Pernah Ikut Masterclass? Mulai Fondasi Video AI Sekarang!
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Kuasai alur kerja pembuatan karakter konsisten, prompt sinematik, dan produksi video AI berkualitas tinggi dari instruktur <strong>{featuredStarterMasterclass?.instructor?.name || 'Rian Antigravity'}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <GradientButton
                size="md"
                icon={<Play className="w-4 h-4 fill-white" />}
                onClick={() => navigateTo('course-detail', featuredStarterMasterclass?.id || 'omni-flash-masterclass')}
              >
                Mulai Masterclass (Episode 1)
              </GradientButton>
              <GradientButton
                variant="secondary"
                size="md"
                icon={<BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                onClick={() => navigateTo('courses')}
              >
                Semua Masterclass
              </GradientButton>
            </div>
          </div>
        </div>
      ) : (
        // -------------------------------------------------------------------------
        // STATE 3: RETURNING USER WITH MASTERCLASS IN PROGRESS - RESUME LEARNING
        // -------------------------------------------------------------------------
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-blue-500/5 dark:from-violet-950/30 dark:via-[#121420] dark:to-[#0d0f18] border border-cyan-500/30 dark:border-violet-500/25 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 blur-[90px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={activeCourseProgress?.thumbnail || MOCK_COURSES[0].thumbnail}
                  alt={activeCourseProgress?.title || 'Masterclass Aktif'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-cyan-500/30 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-900 border border-white/15 text-cyan-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Lanjutkan Sesi Belajar • {activeCourseProgress?.category || 'AI Masterclass'}
                  </span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
                    {activeCourseProgress?.progressPercentage || 0}% Selesai
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeCourseProgress?.title || 'Masterclass'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {activeCourseProgress?.subtitle || `Lanjutkan tontonan kamu di materi ${activeCourseProgress?.title || 'Masterclass'}.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <GradientButton
                size="md"
                icon={<Play className="w-4 h-4 fill-white" />}
                onClick={() => navigateTo('course-detail', activeCourseProgress?.id || 'omni-flash-masterclass')}
              >
                Lanjutkan Episode
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RIWAYAT AKTIVITAS TERAKHIR (FOR RETURNING USERS)                           */}
      {/* ========================================================================= */}
      {!isNewUser && recentActivity.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Riwayat Terakhir Kamu</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({recentActivity.length} aktivitas)</span>
            </div>
            <button
              onClick={clearRecentActivity}
              className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Bersihkan riwayat sesi"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan Riwayat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {recentActivity.slice(0, 4).map((item) => (
              <GlassCard
                key={`${item.type}-${item.id}`}
                hoverable
                onClick={() => handleResumeActivity(item)}
                className="p-3.5 flex items-center gap-3 cursor-pointer group justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-white/10"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={item.type === 'course' ? 'purple' : item.type === 'prompt' ? 'cyan' : 'outline'} size="sm">
                        {item.type.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{formatRelativeTime(item.timestamp)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTINUE LEARNING OR RECOMMENDED STARTER COURSES                          */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {!hasStartedMasterclass
                ? 'Rekomendasi Masterclass Fondasi (Cocok untuk Pemula)' 
                : 'Progres Masterclass & Modul Lanjutan'}
            </h2>
          </div>
          <button 
            onClick={() => navigateTo('courses')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Semua Kursus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!hasStartedMasterclass ? (
          /* =================================================================== */
          /* CASE A: USER BELUM PERNAH MEMBUKA MASTERCLASS -> REKOMENDASI STARTER*/
          /* =================================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beginnerStarterCourses.map((course) => (
              <GlassCard key={course.id} hoverable className="p-5 flex flex-col justify-between gap-4 group">
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 justify-between">
                      <Badge variant={course.level === 'Pemula' ? 'cyan' : course.level === 'Menengah' ? 'purple' : 'pro'} size="sm">
                        {course.level}
                      </Badge>
                      <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                        {course.episodes?.length || course.totalEpisodes || 4} Episode
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {course.subtitle || course.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={course.instructor?.name || 'Mentor'}
                      className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      {course.instructor?.name || 'FIKSI Mentor'}
                    </span>
                  </div>

                  <button
                    onClick={() => navigateTo('course-detail', course.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all shrink-0 group-hover:translate-x-0.5"
                  >
                    <span>Mulai Belajar</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          /* =================================================================== */
          /* CASE B: USER MEMILIKI KURSUS YANG SEDANG BERJALAN -> PROGRES RIIL   */
          /* =================================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(coursesInProgress.length > 0 ? coursesInProgress.slice(0, 3) : courses.slice(0, 3)).map((course) => (
              <GlassCard key={course.id} hoverable className="p-5 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-white/10 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{course.category}</span>
                        <span>•</span>
                        <span className="text-cyan-600 dark:text-cyan-300 font-medium">{course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {course.completedEpisodes !== undefined && course.totalEpisodes 
                        ? `${course.completedEpisodes} dari ${course.totalEpisodes} Episode Selesai`
                        : 'Progres Masterclass'}
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-300 text-[11px]">{course.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 h-full transition-all duration-500" 
                      style={{ width: `${course.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('course-detail', course.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    course.progressPercentage === 100
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                  }`}
                >
                  <span>
                    {course.progressPercentage === 100 
                      ? 'Review Masterclass' 
                      : (course.progressPercentage || 0) > 0 
                        ? 'Lanjutkan Episode' 
                        : 'Mulai Episode 1'}
                  </span>
                  {course.progressPercentage === 100 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TWO COLUMN CONTENT: PROMPTS (PERSONALIZED / STARTER) + WIDGETS            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Prompt Rekomendasi & Popular */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Prompt Section: Rekomendasi Sesuai Minat / Starter Pack */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isNewUser 
                    ? 'Prompt Starter Pack Paling Direkomendasikan' 
                    : lastAccessed?.category 
                      ? `Rekomendasi Terkait (${lastAccessed.category})` 
                      : 'Prompt Populer Untukmu'}
                </h2>
              </div>
              <button 
                onClick={() => navigateTo('prompts')}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Lihat Semua
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(isNewUser ? prompts.slice(0, 3) : personalizedPrompts.slice(0, 3)).map((prompt) => {
                const isBookmarked = bookmarks.includes(prompt.id);
                return (
                  <GlassCard key={prompt.id} hoverable className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prompt.thumbnail}
                        alt={prompt.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-white/10"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{prompt.title}</h4>
                          {prompt.isNew && <Badge variant="new" size="sm">NEW</Badge>}
                          {prompt.isPopular && <Badge variant="amber" size="sm">HOT</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <span className="text-cyan-600 dark:text-cyan-300 font-medium">{prompt.aiModel}</span>
                          <span>•</span>
                          <span>{prompt.category}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{prompt.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleBookmark(prompt.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isBookmarked 
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-600 dark:text-cyan-300' 
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title={isBookmarked ? 'Hapus dari Simpanan' : 'Simpan Prompt'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-cyan-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(buildFullPromptFormula(prompt), prompt.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Prompt Populer & Viral */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Prompt Viral & Trending Minggu Ini</h2>
              </div>
              <button 
                onClick={() => navigateTo('prompts')}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Lihat Semua
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompts.filter(p => p.isPopular).slice(0, 4).map((prompt) => (
                <GlassCard key={prompt.id} hoverable className="p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{prompt.title}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{(prompt.usageCount / 1000).toFixed(1)}k digunakan</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(buildFullPromptFormula(prompt), prompt.title)}
                    className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Formula</span>
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Update Mingguan Widget & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Learning Stats */}
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Statistik Belajar {userName.split(' ')[0]}</span>
              </h3>
              <Badge variant="outline" size="sm">Live</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-xs text-slate-500 dark:text-slate-400">Streak Belajar</span>
                <span className="text-xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                  {currentUser?.streakDays || 1} Hari 🔥
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-xs text-slate-500 dark:text-slate-400">Saved Prompts</span>
                <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-300 mt-1">{bookmarks.length}</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-xs text-slate-500 dark:text-slate-400">Kursus Selesai</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {courses.filter(c => c.progressPercentage === 100).length}
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Aktivitas</span>
                <span className="text-xl font-extrabold text-purple-600 dark:text-purple-300 mt-1">
                  {recentActivity.length > 0 ? recentActivity.length : 1}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* AI Tools Starter / Quick Access */}
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tools AI Pilihan</h3>
              </div>
              <button 
                onClick={() => navigateTo('tools')}
                className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {externalTools.slice(0, 3).map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackRecentActivity({
                    id: tool.id,
                    type: 'tool',
                    title: tool.name,
                    subtitle: tool.description,
                    category: tool.category,
                    thumbnail: tool.thumbnail,
                    targetView: 'tools',
                    targetId: tool.id,
                    badge: tool.pricingType
                  })}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.05] hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={tool.thumbnail} alt={tool.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 truncate">{tool.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{tool.category}</span>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">{tool.pricingType}</Badge>
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Weekly Updates Widget */}
          <GlassCard glow className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Update Mingguan</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                {latestUpdate.version}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{latestUpdate.date}</span>
              <ul className="flex flex-col gap-2 mt-1">
                {latestUpdate.highlights.map((hl, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <GradientButton
              size="sm"
              variant="secondary"
              className="w-full mt-1"
              onClick={() => navigateTo('prompts')}
            >
              Jelajahi Update Terbaru
            </GradientButton>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
