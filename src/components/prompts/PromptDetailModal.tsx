import React from 'react';
import { PromptPack } from '../../types';
import { Modal } from '../ui/Modal';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { 
  Copy, 
  Bookmark, 
  Camera, 
  Sun, 
  Video, 
  Mic, 
  Compass, 
  Download, 
  Check, 
  Sparkles,
  Share2
} from 'lucide-react';

interface PromptDetailModalProps {
  prompt: PromptPack | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
}) => {
  const { copyToClipboard, bookmarks, toggleBookmark, showToast } = useApp();

  if (!prompt) return null;

  const isBookmarked = bookmarks.includes(prompt.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="flex flex-col gap-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={prompt.thumbnail}
              alt={prompt.title}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-accent-purple/40 shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{prompt.title}</h2>
                <Badge variant="cyan">{prompt.category}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Model AI: <strong className="text-accent-cyan font-semibold">{prompt.aiModel}</strong></span>
                <span>•</span>
                <span>Aspect Ratio: <strong className="text-white font-semibold">{prompt.aspectRatio}</strong></span>
                <span>•</span>
                <span>Digunakan: <strong className="text-white font-semibold">{(prompt.usageCount / 1000).toFixed(1)}k kali</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleBookmark(prompt.id)}
              className={`p-2.5 rounded-2xl border transition-all ${
                isBookmarked 
                  ? 'bg-accent-purple/20 border-accent-purple text-accent-pink' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent-pink' : ''}`} />
            </button>
            <GradientButton
              size="sm"
              icon={<Copy className="w-4 h-4" />}
              onClick={() => copyToClipboard(prompt.promptText, 'Prompt Formula')}
            >
              Copy Full Formula
            </GradientButton>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Text Formula</span>
            </span>
            <button
              onClick={() => copyToClipboard(prompt.promptText, 'Main Prompt')}
              className="text-xs text-slate-400 hover:text-accent-cyan flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-[#060816] border border-white/10 font-mono text-xs text-slate-200 leading-relaxed select-all">
            {prompt.promptText}
          </div>
        </div>

        {/* Negative Prompt Box */}
        {prompt.negativePrompt && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Negative Prompt
              </span>
              <button
                onClick={() => copyToClipboard(prompt.negativePrompt || '', 'Negative Prompt')}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#060816] border border-rose-500/20 font-mono text-xs text-rose-200/80 leading-relaxed select-all">
              {prompt.negativePrompt}
            </div>
          </div>
        )}

        {/* Parameter Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {prompt.cameraSettings && (
            <GlassCard className="p-3.5 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-accent-cyan" />
                Camera
              </span>
              <span className="text-xs text-white leading-snug">{prompt.cameraSettings}</span>
            </GlassCard>
          )}

          {prompt.lighting && (
            <GlassCard className="p-3.5 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Lighting
              </span>
              <span className="text-xs text-white leading-snug">{prompt.lighting}</span>
            </GlassCard>
          )}

          {prompt.motion && (
            <GlassCard className="p-3.5 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-accent-purple" />
                Motion
              </span>
              <span className="text-xs text-white leading-snug">{prompt.motion}</span>
            </GlassCard>
          )}

          {prompt.environment && (
            <GlassCard className="p-3.5 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Environment
              </span>
              <span className="text-xs text-white leading-snug">{prompt.environment}</span>
            </GlassCard>
          )}

        </div>

        {/* Tips & Tags Footer */}
        {prompt.tips && (
          <div className="p-4 rounded-2xl bg-accent-purple/10 border border-accent-purple/30 flex flex-col gap-2">
            <span className="text-xs font-bold text-accent-pink">💡 Tips Ekstra Dari Kreator:</span>
            <ul className="flex flex-col gap-1">
              {prompt.tips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-accent-cyan">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </Modal>
  );
};
