import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PromptPack, buildFullPromptFormula } from '../../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Copy, 
  Bookmark, 
  Eye, 
  Flame, 
  SlidersHorizontal,
  Crown,
  Lock,
  CheckCircle2,
  Zap,
  Layers
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { PromptDetailModal } from './PromptDetailModal';

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
  const [activePromptForModal, setActivePromptForModal] = useState<PromptPack | null>(null);

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

  const filteredPrompts = prompts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSubCat = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;
    const matchesModel = selectedModel === 'All' || p.aiModel === selectedModel;
    const matchesTier = selectedTier === 'All' 
      ? true 
      : selectedTier === 'Pro' 
        ? !!p.isPremium 
        : !p.isPremium;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSubCat && matchesModel && matchesTier && matchesSearch;
  });

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

  return (
    <div className="flex flex-col gap-8 py-4 animate-in fade-in duration-200">

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
      <div className="flex flex-col gap-3.5 p-4 rounded-3xl bg-[#101827]/70 border border-white/[0.08] backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari prompt, tag, atau style..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple/60"
            />
          </div>

          {/* Tier Filter & Model Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Access Tier Quick Filter */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#060816] border border-white/10 text-xs shrink-0">
              {[
                { id: 'All', label: 'Semua Tier' },
                { id: 'Free', label: '🟢 Free' },
                { id: 'Pro', label: '👑 Pro VIP' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTier(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedTier === t.id
                      ? 'bg-gradient-accent text-white shadow-sm'
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
                className="px-3 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-accent-cyan font-bold focus:outline-none cursor-pointer"
              >
                {aiModels.map(m => (
                  <option key={m} value={m} className="bg-[#101827] text-slate-200">
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
                    ? 'bg-accent-purple/20 text-accent-pink border border-accent-purple/40 shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-accent-purple/40 text-accent-pink' : 'bg-white/10 text-slate-400'
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
              <Layers className="w-3 h-3 text-accent-cyan" />
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
                      ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 shadow-sm font-semibold'
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
          {filteredPrompts.map((prompt) => {
            const isBookmarked = bookmarks.includes(prompt.id);
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
                      <span className="text-[10px] font-bold text-accent-cyan bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
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
                      className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors cursor-pointer line-clamp-1"
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
                        className="absolute inset-0 flex items-center justify-center bg-[#060816]/70 backdrop-blur-[2px] cursor-pointer hover:bg-[#060816]/60 transition-colors"
                      >
                        <span className="text-[11px] font-bold text-accent-pink flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-purple/20 border border-accent-purple/40">
                          <Lock className="w-3 h-3" />
                          <span>Formula Khusus Pro VIP</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-md">
                      {prompt.category}
                    </span>
                    {prompt.subCategory && prompt.subCategory !== prompt.category && (
                      <span className="text-[10px] font-medium text-accent-pink bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded-md">
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
                        ? 'bg-accent-purple/20 border-accent-purple text-accent-pink' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent-pink' : ''}`} />
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
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-accent-purple/30 to-accent-pink/30 hover:from-accent-purple/40 hover:to-accent-pink/40 border border-accent-purple/50 text-accent-pink text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
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
