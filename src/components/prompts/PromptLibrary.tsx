import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PROMPTS } from '../../data/mockData';
import { PromptPack } from '../../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Copy, 
  Bookmark, 
  Eye, 
  Flame, 
  SlidersHorizontal 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { PromptDetailModal } from './PromptDetailModal';

export const PromptLibrary: React.FC = () => {
  const { copyToClipboard, bookmarks, toggleBookmark } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePromptForModal, setActivePromptForModal] = useState<PromptPack | null>(null);

  const categories = ['All', 'Character', 'UGC', 'Product', 'Storyboard', 'Lighting', 'Camera', 'Motion'];
  const aiModels = ['All', 'Omni Flash', 'Nano Banana', 'Midjourney v6', 'Flux.1 Pro', 'Kling AI'];

  const filteredPrompts = MOCK_PROMPTS.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesModel = selectedModel === 'All' || p.aiModel === selectedModel;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesModel && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Header Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="purple" icon={<Sparkles className="w-3.5 h-3.5" />}>PROMPT ENGINE</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Prompt Library</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Koleksi 500+ formula prompt terstruktur siap pakai. Disalin langsung dengan 1-klik.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-3xl bg-[#101827]/70 border border-white/[0.08] backdrop-blur-xl">
        
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

        {/* AI Model Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Model AI:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-accent-cyan font-bold focus:outline-none cursor-pointer"
          >
            {aiModels.map(m => (
              <option key={m} value={m} className="bg-[#101827] text-slate-200">{m}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-accent text-white shadow-md shadow-accent-purple/20'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PROMPT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => {
          const isBookmarked = bookmarks.includes(prompt.id);

          return (
            <GlassCard key={prompt.id} hoverable className="p-4 flex flex-col justify-between gap-4 group">
              
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
                    <Badge variant="dark" size="sm">{prompt.aspectRatio}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {(prompt.usageCount / 1000).toFixed(1)}k dipakai
                    </span>
                    <span className="text-[10px] font-bold text-accent-cyan bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {prompt.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Tags */}
              <div className="flex flex-col gap-2">
                <h3 
                  onClick={() => setActivePromptForModal(prompt)}
                  className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors cursor-pointer line-clamp-1"
                >
                  {prompt.title}
                </h3>
                
                <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
                  {prompt.promptText}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prompt.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
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
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent-pink' : ''}`} />
                </button>

                <button
                  onClick={() => setActivePromptForModal(prompt)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <GradientButton
                  size="sm"
                  className="flex-1"
                  icon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => copyToClipboard(prompt.promptText, prompt.title)}
                >
                  Copy Prompt
                </GradientButton>
              </div>

            </GlassCard>
          );
        })}
      </div>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={activePromptForModal}
        isOpen={!!activePromptForModal}
        onClose={() => setActivePromptForModal(null)}
      />

    </div>
  );
};
