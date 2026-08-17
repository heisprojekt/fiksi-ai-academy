import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PromptPack, Course, DownloadAsset, ExternalTool, buildFullPromptFormula } from '../../types';
import { 
  Bookmark, 
  Sparkles, 
  GraduationCap, 
  FolderDown, 
  Wrench, 
  Search, 
  Trash2, 
  Copy, 
  Eye, 
  Play, 
  Download, 
  ArrowUpRight, 
  Crown, 
  Lock, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { PromptDetailModal } from '../prompts/PromptDetailModal';

export const BookmarksView: React.FC = () => {
  const { 
    bookmarks, 
    toggleBookmark, 
    prompts, 
    courses, 
    assets, 
    externalTools, 
    copyToClipboard, 
    incrementPromptUsage, 
    userRole, 
    setIsUpgradeModalOpen, 
    showToast, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'prompts' | 'courses' | 'assets' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePromptForModal, setActivePromptForModal] = useState<PromptPack | null>(null);

  // Filter bookmarked items by ID
  const bookmarkedPrompts = prompts.filter(p => bookmarks.includes(p.id));
  const bookmarkedCourses = courses.filter(c => bookmarks.includes(c.id));
  const bookmarkedAssets = assets.filter(a => bookmarks.includes(a.id));
  const bookmarkedTools = externalTools.filter(t => bookmarks.includes(t.id));

  const totalBookmarksCount = bookmarkedPrompts.length + bookmarkedCourses.length + bookmarkedAssets.length + bookmarkedTools.length;

  // Filter based on search query
  const filteredPrompts = bookmarkedPrompts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCourses = bookmarkedCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = bookmarkedAssets.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = bookmarkedTools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatUsageBadge = (count?: number) => {
    if (!count || count <= 0) return '0 dipakai';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k dipakai`;
    return `${count} dipakai`;
  };

  const handleCopyPrompt = (prompt: PromptPack) => {
    const isLocked = prompt.isPremium && (userRole === 'Free Member' || userRole === 'Guest');
    if (isLocked) {
      setIsUpgradeModalOpen(true);
      showToast('info', 'Eksklusif Pro VIP', `Formula prompt "${prompt.title}" khusus untuk Pro Member. Upgrade akun untuk menyalin.`);
      return;
    }
    copyToClipboard(buildFullPromptFormula(prompt), prompt.title);
    incrementPromptUsage(prompt.id);
  };

  const hasAnyItems = (activeTab === 'all' && (filteredPrompts.length > 0 || filteredCourses.length > 0 || filteredAssets.length > 0 || filteredTools.length > 0)) ||
                     (activeTab === 'prompts' && filteredPrompts.length > 0) ||
                     (activeTab === 'courses' && filteredCourses.length > 0) ||
                     (activeTab === 'assets' && filteredAssets.length > 0) ||
                     (activeTab === 'tools' && filteredTools.length > 0);

  return (
    <div className="flex flex-col gap-8 py-4 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple" icon={<Bookmark className="w-3.5 h-3.5 fill-accent-pink" />}>
              SAVED COLLECTION
            </Badge>
            <span className="text-xs text-slate-400 font-mono">• {totalBookmarksCount} Item Tersimpan</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Koleksi Bookmark</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Akses cepat ke semua formula prompt, kursus, aset kreatif, dan AI tools yang telah kamu simpan.
          </p>
        </div>

        {totalBookmarksCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (confirm('Yakin ingin mengosongkan semua bookmark yang tersimpan?')) {
                  bookmarks.forEach(id => toggleBookmark(id));
                  showToast('info', 'Bookmark Dikosongkan', 'Semua item bookmark telah dihapus.');
                }
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs text-slate-300 hover:text-rose-400 font-semibold flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Semua</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-3xl bg-[#101827]/70 border border-white/[0.08] backdrop-blur-xl">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam koleksi bookmark..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple/60"
          />
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-[#060816] rounded-2xl border border-white/10">
          {[
            { id: 'all', label: 'Semua', count: totalBookmarksCount },
            { id: 'prompts', label: 'Prompts', count: bookmarkedPrompts.length },
            { id: 'courses', label: 'Courses', count: bookmarkedCourses.length },
            { id: 'assets', label: 'Assets', count: bookmarkedAssets.length },
            { id: 'tools', label: 'AI Tools', count: bookmarkedTools.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-accent text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Empty State */}
      {!hasAnyItems ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-accent-pink shadow-lg shadow-accent-purple/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-lg font-bold text-white">
              {totalBookmarksCount === 0 ? 'Belum Ada Item yang Disimpan' : 'Tidak Ada Hasil yang Cocok'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {totalBookmarksCount === 0 
                ? 'Simpan prompt favorit, materi kursus, aset desain, atau AI tools dengan mengklik ikon bookmark agar mudah diakses kembali kapan saja.'
                : 'Coba sesuaikan kata kunci pencarian atau ganti filter kategori bookmark.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <GradientButton size="sm" icon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => navigateTo('prompts')}>
              Jelajahi Prompt Library
            </GradientButton>
            <button
              onClick={() => navigateTo('courses')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              Lihat Courses
            </button>
            <button
              onClick={() => navigateTo('tools')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              AI Tools
            </button>
          </div>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-8">

          {/* SECTION: PROMPTS */}
          {(activeTab === 'all' || activeTab === 'prompts') && filteredPrompts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-purple" />
                  <span>Formula Prompt Tersimpan ({filteredPrompts.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map(prompt => {
                  const isProPrompt = !!prompt.isPremium;
                  const isLockedForUser = isProPrompt && (userRole === 'Free Member' || userRole === 'Guest');

                  return (
                    <GlassCard key={prompt.id} hoverable className="p-4 flex flex-col justify-between gap-4 group relative overflow-hidden transition-all duration-300">
                      
                      {/* Thumbnail Header */}
                      <div 
                        onClick={() => setActivePromptForModal(prompt)}
                        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/10 group-hover:border-accent-cyan/40 transition-colors"
                      >
                        <img
                          src={prompt.thumbnail}
                          alt={prompt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060816] via-transparent to-black/30 p-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <Badge variant="purple" size="sm">{prompt.aiModel}</Badge>
                            {isProPrompt ? (
                              <Badge variant="pro" size="sm" icon={<Crown className="w-3 h-3" />}>Pro VIP</Badge>
                            ) : (
                              <Badge variant="green" size="sm">Free</Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                              {formatUsageBadge(prompt.usageCount)}
                            </span>
                            <span className="text-[10px] font-bold text-accent-cyan bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                              {prompt.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Prompt Text */}
                      <div className="flex flex-col gap-2">
                        <h3 
                          onClick={() => setActivePromptForModal(prompt)}
                          className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors cursor-pointer line-clamp-1"
                        >
                          {prompt.title}
                        </h3>

                        <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                          <p className={`text-xs text-slate-400 font-mono bg-white/[0.02] p-2.5 line-clamp-2 ${isLockedForUser ? 'blur-[2.5px] select-none opacity-60' : ''}`}>
                            {prompt.promptText}
                          </p>
                          {isLockedForUser && (
                            <div 
                              onClick={() => setActivePromptForModal(prompt)}
                              className="absolute inset-0 flex items-center justify-center bg-[#060816]/70 backdrop-blur-[2px] cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-accent-pink flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-purple/20 border border-accent-purple/40">
                                <Lock className="w-3 h-3" />
                                <span>Formula Khusus Pro VIP</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prompt.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => toggleBookmark(prompt.id)}
                          className="p-2.5 rounded-xl bg-accent-purple/20 border border-accent-purple text-accent-pink transition-colors"
                          title="Hapus dari Bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-accent-pink" />
                        </button>

                        <button
                          onClick={() => setActivePromptForModal(prompt)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Lihat Detail & Parameter"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isLockedForUser ? (
                          <button
                            onClick={() => handleCopyPrompt(prompt)}
                            className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-accent-purple/30 to-accent-pink/30 hover:from-accent-purple/40 hover:to-accent-pink/40 border border-accent-purple/50 text-accent-pink text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <Crown className="w-3.5 h-3.5 text-accent-pink" />
                            <span>Buka Kunci Pro</span>
                          </button>
                        ) : (
                          <GradientButton
                            size="sm"
                            className="flex-1"
                            icon={<Copy className="w-3.5 h-3.5" />}
                            onClick={() => handleCopyPrompt(prompt)}
                          >
                            Copy Formula
                          </GradientButton>
                        )}
                      </div>

                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: COURSES */}
          {(activeTab === 'all' || activeTab === 'courses') && filteredCourses.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent-cyan" />
                  <span>Kursus Masterclass Tersimpan ({filteredCourses.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <GlassCard key={course.id} hoverable className="p-4 flex flex-col justify-between gap-4 group">
                    <div className="flex flex-col gap-3">
                      <div 
                        onClick={() => navigateTo('course-detail', course.id)}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <Badge variant="cyan" size="sm">{course.level}</Badge>
                          <Badge variant="dark" size="sm">{course.category}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 
                          onClick={() => navigateTo('course-detail', course.id)}
                          className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors cursor-pointer line-clamp-1"
                        >
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {course.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-[11px] text-slate-300 font-medium">{course.instructor.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-accent-cyan font-bold">
                          {course.episodes?.length || course.totalEpisodes || 0} Episode
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => toggleBookmark(course.id)}
                        className="p-2.5 rounded-xl bg-accent-purple/20 border border-accent-purple text-accent-pink transition-colors"
                        title="Hapus dari Bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-accent-pink" />
                      </button>

                      <GradientButton
                        size="sm"
                        icon={<Play className="w-3.5 h-3.5 fill-white" />}
                        onClick={() => navigateTo('course-detail', course.id)}
                        className="flex-1"
                      >
                        Lanjut Belajar
                      </GradientButton>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ASSETS */}
          {(activeTab === 'all' || activeTab === 'assets') && filteredAssets.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <FolderDown className="w-4 h-4 text-emerald-400" />
                  <span>Creative Assets Tersimpan ({filteredAssets.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map(asset => (
                  <GlassCard key={asset.id} hoverable className="p-4 flex flex-col justify-between gap-4 group">
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src={asset.thumbnail}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <Badge variant="cyan" size="sm">{asset.format}</Badge>
                          <Badge variant="dark" size="sm">{asset.size}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {asset.title}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">{asset.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => toggleBookmark(asset.id)}
                        className="p-2.5 rounded-xl bg-accent-purple/20 border border-accent-purple text-accent-pink transition-colors"
                        title="Hapus dari Bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-accent-pink" />
                      </button>

                      <GradientButton
                        size="sm"
                        icon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => navigateTo('assets')}
                        className="flex-1"
                      >
                        Buka Asset
                      </GradientButton>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: AI TOOLS */}
          {(activeTab === 'all' || activeTab === 'tools') && filteredTools.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-accent-cyan" />
                  <span>AI Tools Tersimpan ({filteredTools.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <GlassCard key={tool.id} hoverable className="p-4 flex flex-col justify-between gap-4 group">
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src={tool.thumbnail}
                          alt={tool.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <Badge variant="cyan" size="sm">{tool.category}</Badge>
                          <Badge variant="purple" size="sm">{tool.pricingType}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-1">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => toggleBookmark(tool.id)}
                        className="p-2.5 rounded-xl bg-accent-purple/20 border border-accent-purple text-accent-pink transition-colors"
                        title="Hapus dari Bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-accent-pink" />
                      </button>

                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-accent text-white shadow-sm shadow-accent-purple/20 hover:opacity-90 active:scale-95 transition-all"
                      >
                        <span>Buka Tool</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={activePromptForModal}
        isOpen={!!activePromptForModal}
        onClose={() => setActivePromptForModal(null)}
      />

    </div>
  );
};
