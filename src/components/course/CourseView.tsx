import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Download, 
  FileText, 
  ChevronLeft, 
  Volume2, 
  Maximize, 
  Check, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  SlidersHorizontal,
  Clock,
  Bookmark
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { parseVideoUrl } from '../../utils/videoEmbed';
import { ArticleViewer } from './ArticleViewer';
import { MOCK_COURSES } from '../../data/mockData';

export const CourseView: React.FC = () => {
  const { 
    currentView,
    courses,
    activeCourse, 
    setActiveCourseId,
    completedEpisodes, 
    toggleEpisodeCompletion, 
    navigateTo, 
    showToast,
    bookmarks,
    toggleBookmark,
    userRole,
    setIsUpgradeModalOpen
  } = useApp();

  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'materi' | 'overview' | 'resources' | 'notes'>('overview');
  const [underVideoTab, setUnderVideoTab] = useState<'article' | 'notes' | 'resources'>('article');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'Omni Flash v3 butuh reference image minimal resolution 1024x1024.',
    'Gunakan seed yang sama untuk mempertahankan raut wajah di episode 3.'
  ]);

  const categories = ['All', 'AI Video & Visual', 'Commercial AI', '3D Animation', 'Character Design'];

  const currentCourse = activeCourse || courses[0] || MOCK_COURSES[0];
  const currentEpisode = currentCourse?.episodes?.[activeEpisodeIndex] || currentCourse?.episodes?.[0];
  const isEpCompleted = (currentCourse && currentEpisode) ? !!completedEpisodes[`${currentCourse.id}-${currentEpisode.id}`] : false;
  const parsedVideo = parseVideoUrl(currentEpisode?.videoUrl || '');

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes(prev => [userNote, ...prev]);
    setUserNote('');
    showToast('success', 'Catatan Disimpan', 'Catatan belajar berhasil ditambahkan ke akunmu.');
  };

  // If in 'courses' overview list mode
  if (currentView === 'courses') {
    const filteredCourses = courses.filter(c => {
      const matchCat = searchCategory === 'All' || c.category === searchCategory;
      const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    return (
      <div className="flex flex-col gap-8 py-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" icon={<BookOpen className="w-3.5 h-3.5" />}>ACADEMY COURSES</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Katalog Masterclass AI</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pelajari workflow AI profesional dari dasar hingga advance bersama mentor industri terkemuka.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-3xl bg-[#101827]/70 border border-white/[0.08] backdrop-blur-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kursus masterclass..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  searchCategory === cat
                    ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/40'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <GlassCard key={c.id} hoverable className="p-5 flex flex-col justify-between gap-4 group">
              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => navigateTo('course-detail', c.id)}
                  className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="cyan" size="sm">{c.level}</Badge>
                    <Badge variant="dark" size="sm">{c.category}</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 
                    onClick={() => navigateTo('course-detail', c.id)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {c.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.instructor.avatar}
                      alt={c.instructor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{c.instructor.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-accent-cyan font-bold">
                    {c.episodes?.length || c.totalEpisodes || 0} Episode
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => toggleBookmark(c.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    bookmarks.includes(c.id)
                      ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-pink-400'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={bookmarks.includes(c.id) ? 'Hapus Bookmark' : 'Simpan Kursus'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks.includes(c.id) ? 'fill-current text-purple-600 dark:text-pink-400' : ''}`} />
                </button>

                <GradientButton
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5 fill-white" />}
                  onClick={() => navigateTo('course-detail', c.id)}
                  className="flex-1"
                >
                  Mulai Belajar
                </GradientButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // Course Detail / Masterclass Player View
  return (
    <div className="flex flex-col gap-6 py-4">

      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('courses')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Courses</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Instruktur: <strong className="text-white">{currentCourse?.instructor?.name}</strong></span>
          <Badge variant="cyan" size="sm">{currentCourse?.level}</Badge>
        </div>
      </div>

      {/* Course Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentCourse?.title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentCourse?.subtitle}</p>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center gap-3 bg-[#101827] px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Progres Belajar</span>
            <span className="text-sm font-extrabold text-accent-cyan">{currentCourse?.progressPercentage}% Selesai</span>
          </div>
          <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden ml-2">
            <div className="bg-gradient-accent h-full" style={{ width: `${currentCourse?.progressPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* MAIN MASTERCLASS PLAYER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (4 cols): Episode Playlist Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
          <GlassCard className="p-4 flex flex-col gap-3">
            
            {/* Tabs for Playlist vs Overview */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveTab('materi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'materi' || activeTab === 'overview'
                    ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Materi ({currentCourse?.episodes?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'resources'
                    ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Resources ({currentCourse?.resources?.length || 0})
              </button>
            </div>

            {/* Episode List */}
            {activeTab !== 'resources' ? (
              <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                {currentCourse?.episodes?.map((ep, idx) => {
                  const isCurrent = idx === activeEpisodeIndex;
                  const isDone = !!completedEpisodes[`${currentCourse.id}-${ep.id}`];

                  return (
                    <button
                      key={ep.id || idx}
                      onClick={() => setActiveEpisodeIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isCurrent
                          ? 'bg-gradient-accent text-white shadow-lg shadow-accent-purple/20'
                          : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] border border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-400'}`} />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border shrink-0 ${isCurrent ? 'border-white bg-white/20' : 'border-slate-500'}`} />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate">{ep.title}</span>
                          <span className={`text-[10px] ${isCurrent ? 'text-slate-200' : 'text-slate-400'}`}>{ep.duration}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Resources Download List */
              <div className="flex flex-col gap-3">
                {currentCourse?.resources?.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-accent-cyan" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{res.title}</span>
                        <span className="text-[10px] text-slate-400">{res.type} • {res.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast('success', 'Mengunduh Resource', `${res.title} siap disimpan.`)}
                      className="p-2 text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </GlassCard>
        </div>

        {/* Right Column (8 cols): Video Player & Episode Controls */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
          
          {/* Custom Futuristic Video Player */}
          <GlassCard glow className="p-0 overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
              {parsedVideo.isIframe ? (
                <iframe
                  key={parsedVideo.embedUrl}
                  src={parsedVideo.embedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={currentEpisode?.title || 'Course Video'}
                />
              ) : (
                <>
                  <video
                    key={parsedVideo.embedUrl}
                    src={parsedVideo.embedUrl}
                    controls={true}
                    className="w-full h-full object-cover"
                    poster={currentCourse?.thumbnail}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </>
              )}

              {/* Top Source Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                <Badge variant="dark" size="sm">
                  {parsedVideo.type === 'gdrive' ? 'Google Drive Stream' : parsedVideo.type === 'youtube' ? 'YouTube HD' : 'HD 1080p'}
                </Badge>
              </div>
            </div>

            {/* Under Video Episode Info & Action Buttons */}
            <div className="p-6 flex flex-col gap-5 bg-[#101827]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded-full border border-accent-cyan/20">
                      Episode {activeEpisodeIndex + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">⏱️ {currentEpisode?.duration}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">{currentEpisode?.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{currentEpisode?.description}</p>
                </div>

                {currentEpisode && (
                  <GradientButton
                    variant={isEpCompleted ? 'secondary' : 'gradient'}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => toggleEpisodeCompletion(currentCourse.id, currentEpisode.id)}
                    className="shrink-0"
                  >
                    {isEpCompleted ? 'Sudah Selesai ✓' : 'Tandai Selesai'}
                  </GradientButton>
                )}
              </div>

              {/* Sub-Navigation Tabs Under Video */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUnderVideoTab('article')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    underVideoTab === 'article'
                      ? 'bg-gradient-accent text-white shadow-md shadow-accent-purple/20'
                      : 'text-slate-400 hover:text-white bg-white/[0.04]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Artikel & Panduan Episode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnderVideoTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    underVideoTab === 'notes'
                      ? 'bg-gradient-accent text-white shadow-md shadow-accent-purple/20'
                      : 'text-slate-400 hover:text-white bg-white/[0.04]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Catatan Pribadi ({savedNotes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnderVideoTab('resources')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    underVideoTab === 'resources'
                      ? 'bg-gradient-accent text-white shadow-md shadow-accent-purple/20'
                      : 'text-slate-400 hover:text-white bg-white/[0.04]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>File & Resource ({currentCourse?.resources?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: ARTICLE & STUDY GUIDE */}
              {underVideoTab === 'article' && (
                <div className="flex flex-col gap-4">
                  {/* Key Topics Badges */}
                  {currentEpisode?.keyTopics && currentEpisode.keyTopics.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>Fokus Pembelajaran Episode Ini:</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentEpisode.keyTopics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                            <Check className="w-3 h-3 text-accent-cyan" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Full Markdown Article */}
                  <ArticleViewer
                    content={currentEpisode?.articleContent}
                    fallbackTitle={currentEpisode?.title}
                    fallbackDescription={currentEpisode?.description}
                    fallbackTopics={currentEpisode?.keyTopics}
                  />
                </div>
              )}

              {/* TAB 2: PRIVATE NOTES */}
              {underVideoTab === 'notes' && (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent-cyan" />
                      <span>Catatan Belajar Anda</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Tersimpan lokal & sinkron otomatis</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <textarea
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="Tulis ringkasan rumus prompt, shortcut, atau poin penting dari video ini..."
                      rows={4}
                      className="w-full p-3.5 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan resize-none leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <GradientButton size="sm" onClick={handleSaveNote}>
                        Simpan Catatan
                      </GradientButton>
                    </div>
                  </div>

                  {savedNotes.length > 0 && (
                    <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                      <span className="text-xs font-bold text-slate-300">Catatan Tersimpan:</span>
                      <div className="flex flex-col gap-2">
                        {savedNotes.map((note, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-200 leading-relaxed flex items-start justify-between gap-3 group">
                            <p className="flex-1 italic">"{note}"</p>
                            <button
                              type="button"
                              onClick={() => {
                                setSavedNotes(prev => prev.filter((_, idx) => idx !== i));
                                showToast('info', 'Catatan Dihapus', 'Catatan telah dihapus.');
                              }}
                              className="text-slate-500 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Hapus
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DOWNLOADABLE RESOURCES */}
              {underVideoTab === 'resources' && (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-accent-cyan" />
                      <span>File Lampiran & Asset Praktik</span>
                    </h4>
                    <span className="text-xs text-slate-400">Termasuk PDF, Template, & LUT</span>
                  </div>

                  {(!currentCourse?.resources || currentCourse.resources.length === 0) ? (
                    <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-400">
                      Belum ada file resource tambahan untuk kursus ini.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentCourse.resources.map((res, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-between gap-3 transition-all group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-white truncate">{res.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{res.type} • {res.size}</span>
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => showToast('success', 'Mengunduh Resource', `${res.title} siap diunduh.`)}
                            className="p-2.5 rounded-xl bg-accent-cyan/20 hover:bg-accent-cyan text-accent-cyan hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                            title="Unduh File Resource"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Unduh</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
