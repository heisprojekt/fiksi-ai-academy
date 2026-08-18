import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PromptPack, buildFullPromptFormula } from '../../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Copy, 
  Bookmark, 
  Eye, 
  Crown, 
  Lock, 
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { PromptDetailModal } from './PromptDetailModal';

const ITEMS_PER_PAGE = 18;

// Optimize image URL for faster loading & lower bandwidth
const getOptimizedThumbnail = (url: string): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    // Replace width and quality parameters for compact yet sharp web cards
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?auto=format&fit=crop&w=500&q=75`;
  }
  return url;
};

export const PromptLibrary: React.FC = () => {
  const { 
    prompts, 
    copyToClipboard, 
    bookmarks, 
    toggleBookmark, 
    userRole, 
    setIsUpgradeModalOpen, 
    showToast,
    incrementPromptUsage
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All'); // 'All' | 'Free' | 'Pro'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activePromptForModal, setActivePromptForModal] = useState<PromptPack | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Karakter AI',
    'Make Up & Skin',
    'Outfit & Fashion',
    'Hijab & Modest',
    'Pose & Ekspresi',
    'Body Type',
    'Lighting & Mood',
    'Angle Kamera',
    'Background & Scene',
    'AI Realism & UGC',
    'Video Prompt',
    'Visual Style',
    'Konsistensi AI'
  ];

  // AI Models extraction (memoized)
  const aiModels = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach(p => {
      if (p.aiModel && p.aiModel.trim()) {
        set.add(p.aiModel.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [prompts]);

  // Sub-categories available for current category selection
  const availableSubCategories = useMemo(() => {
    const pool = selectedCategory === 'All' 
      ? prompts 
      : prompts.filter(p => p.category === selectedCategory);
    const set = new Set<string>();
    pool.forEach(p => {
      if (p.subCategory && p.subCategory.trim()) {
        set.add(p.subCategory.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [prompts, selectedCategory]);

  const formatUsageBadge = (count?: number) => {
    if (!count || count <= 0) return '0 dipakai';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k dipakai`;
    return `${count} dipakai`;
  };

  // Reset page to 1 whenever any filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, selectedModel, selectedTier, searchQuery]);

  // Memoized Filtered Prompts calculation
  const filteredPrompts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return prompts.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSubCat = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;
      const matchesModel = selectedModel === 'All' || p.aiModel === selectedModel;
      const matchesTier = selectedTier === 'All' 
        ? true 
        : selectedTier === 'Pro' 
          ? !!p.isPremium 
          : !p.isPremium;

      if (!matchesCat || !matchesSubCat || !matchesModel || !matchesTier) {
        return false;
      }

      if (!query) return true;

      return (
        p.title.toLowerCase().includes(query) ||
        p.promptText.toLowerCase().includes(query) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    });
  }, [prompts, selectedCategory, selectedSubCategory, selectedModel, selectedTier, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPrompts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrompts, validCurrentPage]);

  const handlePageChange = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('All');
  };

  // Generate pagination buttons with smart ellipsis
  const getPaginationNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= validCurrentPage - delta && i <= validCurrentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === 'number') {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  const startCount = filteredPrompts.length === 0 ? 0 : (validCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endCount = Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredPrompts.length);

  return (
    <div ref={containerRef} className="flex flex-col gap-8 py-4 animate-in fade-in duration-200">

      {/* Header Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="purple" icon={<Sparkles className="w-3.5 h-3.5" />}>PROMPT ENGINE</Badge>
          <span className="text-xs text-slate-400 font-mono">• {prompts.length}+ Formula Multi-Model & Realisme</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Prompt Library</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Koleksi formula prompt sinematik terstruktur berdasarkan grouping Notion resmi FIKSI AI. Formula Free siap disalin langsung, dan Formula Pro VIP dilengkapi parameter eksklusif.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col gap-3.5 p-4 rounded-3xl bg-[#121420]/80 border border-white/[0.07] backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari prompt, tag, atau style..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0B0C10] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Tier Filter & Model Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Access Tier Quick Filter */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0B0C10] border border-white/10 text-xs shrink-0">
              {[
                { id: 'All', label: 'Semua Tier' },
                { id: 'Free', label: 'Free' },
                { id: 'Pro', label: 'Pro VIP' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTier(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedTier === t.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* AI Model Dropdown Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-[#0B0C10] border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
              >
                {aiModels.map(m => (
                  <option key={m} value={m} className="bg-[#13151D] text-slate-200">
                    {m === 'All' ? 'Semua Model AI' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map(cat => {
            const count = cat === 'All'
              ? prompts.length
              : prompts.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-cyan-500/40 text-cyan-100' : 'bg-white/10 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Grouping Filter Pills (if more than 1 subcategory exists) */}
        {availableSubCategories.length > 2 && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06] overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Sub-Group:</span>
            </span>
            {availableSubCategories.map(sub => {
              const count = sub === 'All'
                ? (selectedCategory === 'All' ? prompts.length : prompts.filter(p => p.category === selectedCategory).length)
                : prompts.filter(p => (selectedCategory === 'All' || p.category === selectedCategory) && p.subCategory === sub).length;

              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    selectedSubCategory === sub
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm font-semibold'
                      : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.04]'
                  }`}
                >
                  <span>{sub === 'All' ? 'Semua Sub' : sub}</span>
                  <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Info Count & Pagination Top Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-white">{startCount}-{endCount}</strong> dari <strong className="text-violet-300">{filteredPrompts.length}</strong> formula prompt
        </span>
        {totalPages > 1 && (
          <span className="font-mono">
            Halaman <strong className="text-white">{validCurrentPage}</strong> dari <strong className="text-white">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* PROMPT CARDS GRID */}
      {filteredPrompts.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Tidak Ada Prompt Ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Coba sesuaikan kata kunci pencarian, filter model AI, atau pilih filter tier lain.
          </p>
          <GradientButton size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedModel('All'); setSelectedTier('All'); }}>
            Reset Filter
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPrompts.map((prompt) => {
            const isBookmarked = bookmarks.includes(prompt.id);
            const isProPrompt = !!prompt.isPremium;
            const isLockedForUser = isProPrompt && (userRole === 'Free Member' || userRole === 'Guest');
            const optimizedThumb = getOptimizedThumbnail(prompt.thumbnail);

            return (
              <GlassCard key={prompt.id} hoverable className="p-4 flex flex-col justify-between gap-4 group relative overflow-hidden transition-all duration-300">
                
                {/* Thumbnail Header with Native Lazy Loading */}
                <div 
                  onClick={() => setActivePromptForModal(prompt)}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/10 group-hover:border-violet-500/40 transition-colors bg-slate-900"
                >
                  <img
                    src={optimizedThumb}
                    alt={prompt.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-transparent to-black/30 p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" size="sm">{prompt.aiModel}</Badge>
                      
                      {isProPrompt ? (
                        <Badge variant="pro" size="sm" icon={<Crown className="w-3 h-3" />}>
                          Pro VIP
                        </Badge>
                      ) : (
                        <Badge variant="green" size="sm">
                          Free
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                        {formatUsageBadge(prompt.usageCount)}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Formula Preview */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 
                      onClick={() => setActivePromptForModal(prompt)}
                      className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                    >
                      {prompt.title}
                    </h3>
                  </div>
                  
                  {/* Prompt Text or Locked Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                    <p className={`text-xs text-slate-400 font-mono bg-white/[0.02] p-2.5 line-clamp-2 ${isLockedForUser ? 'blur-[2.5px] select-none opacity-60' : ''}`}>
                      {prompt.promptText}
                    </p>
                    {isLockedForUser && (
                      <div 
                        onClick={() => setActivePromptForModal(prompt)}
                        className="absolute inset-0 flex items-center justify-center bg-[#0B0C10]/80 backdrop-blur-[2px] cursor-pointer hover:bg-[#0B0C10]/70 transition-colors"
                      >
                        <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 shadow-sm">
                          <Lock className="w-3 h-3" />
                          <span>Formula Khusus Pro VIP</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                      {prompt.category}
                    </span>
                    {prompt.subCategory && prompt.subCategory !== prompt.category && (
                      <span className="text-[10px] font-medium text-slate-300 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                        {prompt.subCategory}
                      </span>
                    )}
                    {prompt.tags.filter(t => t !== prompt.category && t !== prompt.subCategory).slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => toggleBookmark(prompt.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isBookmarked 
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
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
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Crown className="w-3.5 h-3.5 text-purple-300" />
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
      )}

      {/* Bottom Pagination Navigation */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-2 border-t border-white/[0.06]">
          {/* First Page */}
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={validCurrentPage === 1}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Prev Page */}
          <button
            type="button"
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Number Buttons */}
          <div className="flex items-center gap-1.5">
            {getPaginationNumbers().map((num, idx) => {
              if (num === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 text-slate-600 text-xs font-mono select-none">
                    ...
                  </span>
                );
              }

              const pageNum = num as number;
              const isActive = pageNum === validCurrentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 scale-105'
                      : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={validCurrentPage === totalPages}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
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
