import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_ASSETS } from '../../data/mockData';
import { DownloadAsset } from '../../types';
import { 
  FolderDown, 
  Search, 
  Download, 
  FileCode, 
  Image, 
  Palette, 
  Layout, 
  Box, 
  Check, 
  Crown,
  Bookmark
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const AssetsView: React.FC = () => {
  const { assets, showToast, userRole, bookmarks, toggleBookmark } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formats = ['All', 'PSD', 'PNG', 'LUT', 'Templates', 'Mockups'];

  const filteredAssets = assets.filter(asset => {
    const matchesFormat = selectedFormat === 'All' || asset.format === selectedFormat;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFormat && matchesSearch;
  });

  const handleDownload = (asset: DownloadAsset) => {
    if (asset.isPremium && userRole === 'Free Member') {
      showToast('warning', 'Akses Terbatas Pro', 'Upgrade ke Pro Member untuk mengunduh aset premium ini.');
      return;
    }

    setDownloadingId(asset.id);
    setTimeout(() => {
      setDownloadingId(null);
      showToast('success', 'Berhasil Diunduh!', `${asset.title} (${asset.size}) telah disimpan.`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" icon={<FolderDown className="w-3.5 h-3.5" />}>CREATIVE ASSETS</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Download Assets & Resources</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Unduh aset grafik PSD, PNG overlay transparan, LUTs color grading, dan template storyboard 4K.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-3xl bg-[#101827]/70 border border-white/[0.08] backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari PSD, PNG, LUT, atau mockup..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {formats.map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/40'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => {
          const isDownloading = downloadingId === asset.id;

          return (
            <GlassCard key={asset.id} hoverable className="p-4 flex flex-col justify-between gap-4">
              
              {/* Thumbnail Image Box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={asset.thumbnail}
                  alt={asset.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <Badge variant="purple" size="sm">{asset.format}</Badge>
                  {asset.isPremium && <Badge variant="pro" size="sm">PRO</Badge>}
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-white line-clamp-1">{asset.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ukuran: <strong className="text-white">{asset.size}</strong></span>
                  <span>{(asset.downloadsCount).toLocaleString()} downloads</span>
                </div>
              </div>

              {/* Download Action Button & Bookmark */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => toggleBookmark(asset.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    bookmarks.includes(asset.id)
                      ? 'bg-accent-purple/20 border-accent-purple text-accent-pink'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title={bookmarks.includes(asset.id) ? 'Hapus Bookmark' : 'Simpan Aset'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks.includes(asset.id) ? 'fill-accent-pink' : ''}`} />
                </button>

                <GradientButton
                  size="sm"
                  variant={asset.isPremium && userRole === 'Free Member' ? 'secondary' : 'gradient'}
                  icon={isDownloading ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  onClick={() => handleDownload(asset)}
                  disabled={isDownloading}
                  className="flex-1"
                >
                  {isDownloading ? 'Mengunduh...' : 'Download File'}
                </GradientButton>
              </div>

            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
