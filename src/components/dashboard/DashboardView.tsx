import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_WEEKLY_UPDATES } from '../../data/mockData';
import { buildFullPromptFormula } from '../../types';
import { 
  Play, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Flame, 
  RefreshCw, 
  Bookmark, 
  Copy, 
  Download,
  GraduationCap
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    userRole, 
    courses, 
    prompts, 
    navigateTo, 
    copyToClipboard, 
    bookmarks, 
    toggleBookmark 
  } = useApp();
  const latestUpdate = MOCK_WEEKLY_UPDATES[0];

  const userName = currentUser?.name || 'Kreator AI';

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Header Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Halo, {userName}
            </h1>
            <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} size="sm">
              {userRole.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Selamat datang di FIKSI AI Academy. Lanjutkan perjalanan belajarmu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GradientButton
            size="sm"
            variant="secondary"
            icon={<Sparkles className="w-3.5 h-3.5 text-accent-cyan" />}
            onClick={() => navigateTo('prompts')}
          >
            Jelajahi Prompt
          </GradientButton>
        </div>
      </div>

      {/* CONTINUE LEARNING SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Continue Learning</h2>
          <button 
            onClick={() => navigateTo('courses')}
            className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.slice(0, 3).map((course) => (
            <GlassCard key={course.id} hoverable className="p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                    <span className="text-[11px] text-slate-400">{course.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Progres</span>
                  <span className="font-bold text-accent-cyan text-[11px]">{course.progressPercentage || 0}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-accent h-full transition-all duration-500" 
                    style={{ width: `${course.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigateTo('course-detail', course.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  course.progressPercentage === 100
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-white/5 text-slate-200 hover:bg-gradient-accent hover:text-white border border-white/10'
                }`}
              >
                <span>{course.progressPercentage === 100 ? 'Review Masterclass' : 'Lanjutkan Episode'}</span>
                {course.progressPercentage === 100 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* TWO COLUMN CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Prompt Terbaru & Popular */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Prompt Terbaru */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <h2 className="text-base font-bold text-white">Prompt Terbaru</h2>
              </div>
              <button 
                onClick={() => navigateTo('prompts')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Lihat Semua
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {prompts.slice(0, 3).map((prompt) => {
                const isBookmarked = bookmarks.includes(prompt.id);
                return (
                  <GlassCard key={prompt.id} hoverable className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prompt.thumbnail}
                        alt={prompt.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{prompt.title}</h4>
                          {prompt.isNew && <Badge variant="new" size="sm">NEW</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span className="text-accent-cyan font-medium">{prompt.aiModel}</span>
                          <span>•</span>
                          <span>{prompt.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleBookmark(prompt.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isBookmarked 
                            ? 'bg-accent-purple/20 border-accent-purple text-accent-pink' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-accent-pink' : ''}`} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(buildFullPromptFormula(prompt), prompt.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-blue/10 border border-accent-blue/30 text-accent-cyan hover:bg-accent-blue/20 text-xs font-semibold transition-colors"
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

          {/* Prompt Populer */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-white">Prompt Populer</h2>
              </div>
              <button 
                onClick={() => navigateTo('prompts')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
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
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{prompt.title}</h4>
                      <span className="text-[10px] text-slate-400 mt-0.5">{(prompt.usageCount / 1000).toFixed(1)}k digunakan</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(buildFullPromptFormula(prompt), prompt.title)}
                    className="w-full py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent-cyan/40 text-[11px] font-semibold text-slate-200 hover:text-accent-cyan transition-colors flex items-center justify-center gap-1.5"
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
          
          {/* Weekly Updates Widget */}
          <GlassCard glow className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-accent-cyan animate-spin-slow" />
                <h3 className="text-sm font-bold text-white">Update Mingguan</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-accent-purple/20 text-accent-pink border border-accent-purple/40">
                {latestUpdate.version}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">{latestUpdate.date}</span>
              <ul className="flex flex-col gap-2 mt-1">
                {latestUpdate.highlights.map((hl, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-[11px] leading-snug">
                    <span className="text-accent-cyan font-bold">•</span>
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
              Jelajahi Prompt & Materi Terbaru
            </GradientButton>
          </GlassCard>

          {/* Quick Learning Stats */}
          <GlassCard className="p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Statistik Belajar {userName.split(' ')[0]}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-xs text-slate-400">Streak Belajar</span>
                <span className="text-xl font-extrabold text-amber-400 mt-1">
                  {currentUser?.streakDays || 1} Hari 🔥
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-xs text-slate-400">Saved Prompts</span>
                <span className="text-xl font-extrabold text-accent-cyan mt-1">{bookmarks.length}</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
