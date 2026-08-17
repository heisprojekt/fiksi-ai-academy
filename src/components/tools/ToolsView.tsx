import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalTool } from '../../types';
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Plus, 
  Tag, 
  Filter,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const ToolsView: React.FC = () => {
  const { 
    externalTools, 
    userRole, 
    setIsUpgradeModalOpen, 
    navigateTo,
    showToast,
    bookmarks,
    toggleBookmark,
    trackRecentActivity
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPricing, setSelectedPricing] = useState<string>('All');

  const categories = [
    'All',
    'Image Gen',
    'Video AI',
    'Audio & Voice',
    'LLM & Writing',
    'Productivity',
    'Automation',
    '3D & VFX'
  ];

  const filteredTools = externalTools.filter(tool => {
    const matchCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchPricing = selectedPricing === 'All' || tool.pricingType === selectedPricing;
    const matchQuery = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchCategory && matchPricing && matchQuery;
  });

  const handleToolClick = (tool: ExternalTool, e: React.MouseEvent) => {
    if (tool.isPremium && userRole === 'Free Member') {
      e.preventDefault();
      setIsUpgradeModalOpen(true);
      showToast('info', 'Konten Khusus Pro Member', `Tool "${tool.name}" merupakan rekomendasi eksklusif Pro Member.`);
      return;
    }
    trackRecentActivity({
      id: tool.id,
      type: 'tool',
      title: tool.name,
      subtitle: tool.description,
      category: tool.category,
      thumbnail: tool.thumbnail,
      targetView: 'tools',
      targetId: tool.id,
      badge: tool.pricingType
    });
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/30 via-[#121420] to-[#0d0f18] border border-violet-500/25 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/25 shrink-0">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm" icon={<Zap className="w-3 h-3" />}>DIREKTORI AI TOOLS</Badge>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">• Curated by FIKSI AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Direktori Tools AI Eksternal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Kurasi software dan web app AI terbaik dunia untuk menunjang produksi video, gambar, audio, dan automasi konten kamu.
            </p>
          </div>
        </div>

        {userRole === 'Admin' && (
          <div className="relative z-10">
            <GradientButton
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigateTo('admin')}
            >
              Kelola di CMS
            </GradientButton>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 p-4 rounded-3xl bg-[#121420]/80 border border-white/[0.07] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tool, kategori, tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#08090E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>

          {/* Pricing Model Quick Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#08090E] border border-white/10 text-xs w-full sm:w-auto overflow-x-auto">
            {['All', 'Free', 'Freemium', 'Paid'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPricing(p)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedPricing === p
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'All' ? 'Semua Harga' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => {
            const count = cat === 'All' 
              ? externalTools.length 
              : externalTools.filter(t => t.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
              >
                <span>{cat === 'All' ? 'Semua Kategori' : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-violet-500/40 text-violet-200' : 'bg-white/10 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Tidak Ada Tool Ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
          <GradientButton size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedPricing('All'); }}>
            Reset Pencarian
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isLocked = tool.isPremium && userRole === 'Free Member';

            return (
              <GlassCard
                key={tool.id}
                hoverable
                className="p-5 flex flex-col justify-between gap-4 group relative overflow-hidden transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  {/* Tool Image & Badges */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#060816]">
                    <img
                      src={tool.thumbnail}
                      alt={tool.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <Badge variant="cyan" size="sm">{tool.category}</Badge>
                      <Badge 
                        variant={tool.pricingType === 'Free' ? 'green' : tool.pricingType === 'Freemium' ? 'purple' : 'dark'} 
                        size="sm"
                      >
                        {tool.pricingType}
                      </Badge>
                    </div>

                    {tool.isPremium && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="pro" size="sm" icon={<Crown className="w-3 h-3" />}>
                          Pro VIP
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Tool Title & Description */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {tool.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/[0.06] text-[10px] font-mono text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Button */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(tool.id);
                      }}
                      className={`p-2 rounded-xl border transition-all ${
                        bookmarks.includes(tool.id)
                          ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={bookmarks.includes(tool.id) ? 'Hapus Bookmark' : 'Simpan Tool'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(tool.id) ? 'fill-violet-400' : ''}`} />
                    </button>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-[11px] font-medium text-slate-300">{tool.category}</span>
                    </div>
                  </div>

                  <a
                    href={isLocked ? '#' : tool.url}
                    target={isLocked ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    onClick={(e) => handleToolClick(tool, e)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isLocked
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 hover:bg-violet-500/30'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20 hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Crown className="w-3.5 h-3.5 text-accent-pink" />
                        <span>Buka Kunci Pro</span>
                      </>
                    ) : (
                      <>
                        <span>Buka Tool</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

    </div>
  );
};
