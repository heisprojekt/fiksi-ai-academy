import React, { useState, useEffect } from 'react';
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
  Share2,
  Edit3,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Crown,
  Lock,
  ArrowUpRight
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
  const { 
    copyToClipboard, 
    bookmarks, 
    toggleBookmark, 
    updatePrompt, 
    showToast, 
    userRole, 
    setIsUpgradeModalOpen,
    incrementPromptUsage
  } = useApp();

  // Local state for interactive parameter editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedPromptText, setEditedPromptText] = useState('');
  const [editedNegativePrompt, setEditedNegativePrompt] = useState('');
  const [editedCamera, setEditedCamera] = useState('');
  const [editedLighting, setEditedLighting] = useState('');
  const [editedMotion, setEditedMotion] = useState('');
  const [editedEnvironment, setEditedEnvironment] = useState('');
  const [editedVoice, setEditedVoice] = useState('');
  const [editedAspectRatio, setEditedAspectRatio] = useState('16:9');

  // Sync state whenever active prompt changes
  useEffect(() => {
    if (prompt) {
      setEditedPromptText(prompt.promptText || '');
      setEditedNegativePrompt(prompt.negativePrompt || '');
      setEditedCamera(prompt.cameraSettings || '');
      setEditedLighting(prompt.lighting || '');
      setEditedMotion(prompt.motion || '');
      setEditedEnvironment(prompt.environment || '');
      setEditedVoice(prompt.voice || '');
      setEditedAspectRatio(prompt.aspectRatio || '16:9');
      setIsEditing(false);
    }
  }, [prompt, userRole]);

  if (!prompt) return null;

  const isBookmarked = bookmarks.includes(prompt.id);
  const isProPrompt = !!prompt.isPremium;
  const isLocked = isProPrompt && (userRole === 'Free Member' || userRole === 'Guest');

  // Format usage count safely without NaN
  const formatUsageCount = (count?: number) => {
    if (typeof count !== 'number' || isNaN(count) || count <= 0) {
      return '0 dipakai';
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k dipakai`;
    }
    return `${count} dipakai`;
  };

  // Generate the FULL comprehensive formula combining all parts of the card
  const getFullFormulaString = () => {
    const lines: string[] = [];

    // Main Prompt
    let mainText = editedPromptText.trim() || prompt.promptText;
    const ar = editedAspectRatio || prompt.aspectRatio;
    if (ar && !mainText.includes('--ar')) {
      mainText += ` --ar ${ar}`;
    }
    lines.push(`[PROMPT TEXT FORMULA]\n${mainText}`);

    // Negative Prompt
    const neg = isEditing ? editedNegativePrompt : (prompt.negativePrompt || '');
    if (neg.trim()) {
      lines.push(`[NEGATIVE PROMPT]\n${neg.trim()}`);
    }

    // Parameters (Camera, Lighting, Motion, Environment, Voice)
    const params: string[] = [];
    const cam = isEditing ? editedCamera : (prompt.cameraSettings || '');
    const light = isEditing ? editedLighting : (prompt.lighting || '');
    const mot = isEditing ? editedMotion : (prompt.motion || '');
    const env = isEditing ? editedEnvironment : (prompt.environment || '');
    const voice = isEditing ? editedVoice : (prompt.voice || '');

    if (cam.trim()) params.push(`Camera: ${cam.trim()}`);
    if (light.trim()) params.push(`Lighting: ${light.trim()}`);
    if (mot.trim()) params.push(`Motion: ${mot.trim()}`);
    if (env.trim()) params.push(`Environment: ${env.trim()}`);
    if (voice.trim()) params.push(`Voice: ${voice.trim()}`);

    if (params.length > 0) {
      lines.push(`[PARAMETERS & SETTINGS]\n${params.join('\n')}`);
    }

    // Tips
    if (prompt.tips && prompt.tips.length > 0) {
      lines.push(`[TIPS]\n${prompt.tips.map(t => `- ${t}`).join('\n')}`);
    }

    return lines.join('\n\n');
  };

  const canEdit = userRole === 'Admin';
  const isEditActive = isEditing && canEdit && !isLocked;

  const handleCopyFullFormula = () => {
    if (isLocked) {
      setIsUpgradeModalOpen(true);
      showToast('info', 'Eksklusif Pro Member', `Prompt "${prompt.title}" khusus untuk Pro Member. Silakan upgrade untuk menyalin.`);
      return;
    }
    const fullText = getFullFormulaString();
    copyToClipboard(fullText, 'Full Formula (Prompt + Parameter Lengkap)');
    incrementPromptUsage(prompt.id);
  };

  const handleCopyMainText = () => {
    if (isLocked) {
      setIsUpgradeModalOpen(true);
      showToast('info', 'Eksklusif Pro Member', 'Formula teks prompt ini dikunci untuk Free Member.');
      return;
    }
    copyToClipboard(editedPromptText, 'Main Prompt');
    incrementPromptUsage(prompt.id);
  };

  const handleSaveParameters = () => {
    if (!canEdit) {
      showToast('warning', 'Akses Dibatasi', 'Sebagai Member, parameter bersifat read-only dan tidak dapat diubah.');
      return;
    }

    updatePrompt(prompt.id, {
      promptText: editedPromptText,
      negativePrompt: editedNegativePrompt,
      cameraSettings: editedCamera,
      lighting: editedLighting,
      motion: editedMotion,
      environment: editedEnvironment,
      voice: editedVoice,
      aspectRatio: editedAspectRatio as any
    });
    setIsEditing(false);
    showToast('success', 'Parameter Disimpan', 'Bagian bawah parameter prompt berhasil diperbarui oleh Admin.');
  };

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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">{prompt.title}</h2>
                <Badge variant="cyan">{prompt.category}</Badge>
                {prompt.subCategory && prompt.subCategory !== prompt.category && (
                  <Badge variant="purple">{prompt.subCategory}</Badge>
                )}
                {isProPrompt ? (
                  <Badge variant="pro" icon={<Crown className="w-3 h-3" />}>
                    Pro VIP
                  </Badge>
                ) : (
                  <Badge variant="green">Free</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span>Model AI: <strong className="text-accent-cyan font-semibold">{prompt.aiModel}</strong></span>
                <span>•</span>
                <span>Aspect Ratio: <strong className="text-white font-semibold">{editedAspectRatio}</strong></span>
                <span>•</span>
                <span>Digunakan: <strong className="text-white font-semibold">{formatUsageCount(prompt.usageCount)}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Toggle Edit Parameters Button - ONLY FOR ADMIN */}
            {userRole === 'Admin' && !isLocked && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isEditing
                    ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Tutup Editor' : 'Ganti Parameter (Admin)'}</span>
              </button>
            )}

            <button
              onClick={() => toggleBookmark(prompt.id)}
              className={`p-2.5 rounded-2xl border transition-all ${
                isBookmarked 
                  ? 'bg-accent-purple/20 border-accent-purple text-accent-pink' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
              title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent-pink' : ''}`} />
            </button>

            {isLocked ? (
              <button
                onClick={() => {
                  setIsUpgradeModalOpen(true);
                  showToast('info', 'Eksklusif Pro VIP', `Upgrade akun ke Pro Member untuk menyalin formula "${prompt.title}".`);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-accent-purple/20 hover:opacity-95 active:scale-95 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Buka Kunci Pro</span>
              </button>
            ) : (
              <GradientButton
                size="sm"
                icon={<Copy className="w-4 h-4" />}
                onClick={handleCopyFullFormula}
              >
                Copy Full Formula
              </GradientButton>
            )}
          </div>
        </div>

        {/* LOCKED BANNER FOR FREE MEMBERS VIEWING PRO PROMPT */}
        {isLocked && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-accent-purple/25 via-accent-pink/15 to-transparent border border-accent-purple/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent-purple/30">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-accent-pink uppercase tracking-wider">Formula Eksklusif Pro Member</span>
                  <span className="text-[10px] bg-accent-purple/30 text-accent-pink px-2 py-0.2 rounded-full font-mono font-bold">VIP ONLY</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 max-w-xl">
                  Formula prompt sinematik, negative prompt, dan pengaturan lighting/kamera ini dikunci khusus Pro Member.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsUpgradeModalOpen(true);
                showToast('info', 'Upgrade Akun', 'Pilih paket Pro Member untuk membuka semua prompt VIP.');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-accent text-white text-xs font-extrabold shrink-0 flex items-center gap-1.5 shadow-md shadow-accent-purple/30 hover:opacity-95 active:scale-95 transition-all w-full sm:w-auto justify-center"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Buka Kunci Akses (QRIS)</span>
            </button>
          </div>
        )}

        {/* Prompt Text Formula Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Text Formula</span>
            </span>
            <button
              onClick={handleCopyMainText}
              className={`text-xs flex items-center gap-1 transition-colors ${
                isLocked ? 'text-accent-pink hover:underline' : 'text-slate-400 hover:text-accent-cyan'
              }`}
            >
              {isLocked ? <Crown className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{isLocked ? 'Buka Kunci Teks' : 'Copy Teks Saja'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            {isEditActive ? (
              <textarea
                rows={3}
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#060816] font-mono text-xs text-white leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <div className={`p-4 bg-[#060816] font-mono text-xs text-slate-200 leading-relaxed ${isLocked ? 'blur-[4px] select-none opacity-50' : 'select-all'}`}>
                {editedPromptText}
              </div>
            )}

            {isLocked && (
              <div 
                onClick={() => {
                  setIsUpgradeModalOpen(true);
                  showToast('info', 'Eksklusif Pro VIP', 'Upgrade ke Pro Member untuk menyalin dan melihat teks formula lengkap.');
                }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#060816]/75 backdrop-blur-[2px] cursor-pointer hover:bg-[#060816]/65 transition-colors p-4 text-center"
              >
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-accent-purple/30 border border-accent-purple/50 text-accent-pink text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Formula Teks Terkunci (Pro VIP)</span>
                </div>
                <span className="text-[11px] text-slate-300">Klik di sini untuk upgrade via QRIS dan buka seluruh formula</span>
              </div>
            )}
          </div>
        </div>

        {/* Negative Prompt Box */}
        {(editedNegativePrompt || isEditActive) && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Negative Prompt
              </span>
              <button
                onClick={() => {
                  if (isLocked) {
                    setIsUpgradeModalOpen(true);
                    return;
                  }
                  copyToClipboard(editedNegativePrompt, 'Negative Prompt');
                }}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                {isLocked ? <Lock className="w-3 h-3 text-rose-400" /> : <Copy className="w-3 h-3" />}
                <span>{isLocked ? 'Terkunci' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-rose-500/20">
              {isEditActive ? (
                <input
                  type="text"
                  value={editedNegativePrompt}
                  onChange={(e) => setEditedNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, bad hands, low resolution"
                  className="w-full p-3 rounded-2xl bg-[#060816] font-mono text-xs text-rose-200 focus:outline-none"
                />
              ) : (
                <div className={`p-3.5 bg-[#060816] font-mono text-xs text-rose-200/80 leading-relaxed ${isLocked ? 'blur-[3px] select-none opacity-40' : 'select-all'}`}>
                  {editedNegativePrompt}
                </div>
              )}

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#060816]/70 backdrop-blur-[1px]">
                  <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    <span>Negative Prompt Khusus Pro Member</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parameter Details Section Header */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Parameter Detail (Pengaturan Visual AI)
            </span>
          </div>
          {isEditActive && (
            <span className="text-[11px] text-amber-400 font-semibold animate-pulse">
              Mode Edit Admin Aktif - Ubah nilai di bawah & klik Simpan
            </span>
          )}
        </div>

        {/* Parameter Details Grid (Camera, Lighting, Motion, Environment, Aspect Ratio, Voice) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative ${isLocked ? 'opacity-70' : ''}`}>
          
          {/* CAMERA */}
          <GlassCard className={`p-3.5 flex flex-col gap-1.5 transition-all ${isEditActive ? 'border-accent-cyan/40 bg-accent-cyan/[0.03]' : ''}`}>
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-accent-cyan" />
              Camera Settings
            </span>
            {isEditActive ? (
              <input
                type="text"
                value={editedCamera}
                onChange={(e) => setEditedCamera(e.target.value)}
                placeholder="85mm f/1.4, ISO 100"
                className="p-2 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            ) : (
              <span className={`text-xs text-white leading-snug ${isLocked ? 'blur-[1.5px]' : ''}`}>{editedCamera || '-'}</span>
            )}
          </GlassCard>

          {/* LIGHTING */}
          <GlassCard className={`p-3.5 flex flex-col gap-1.5 transition-all ${isEditActive ? 'border-amber-400/40 bg-amber-400/[0.03]' : ''}`}>
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Lighting Mood
            </span>
            {isEditActive ? (
              <input
                type="text"
                value={editedLighting}
                onChange={(e) => setEditedLighting(e.target.value)}
                placeholder="Soft Morning Window Light"
                className="p-2 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            ) : (
              <span className={`text-xs text-white leading-snug ${isLocked ? 'blur-[1.5px]' : ''}`}>{editedLighting || '-'}</span>
            )}
          </GlassCard>

          {/* MOTION */}
          <GlassCard className={`p-3.5 flex flex-col gap-1.5 transition-all ${isEditActive ? 'border-accent-purple/40 bg-accent-purple/[0.03]' : ''}`}>
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-accent-purple" />
              Motion & Camera Movement
            </span>
            {isEditActive ? (
              <input
                type="text"
                value={editedMotion}
                onChange={(e) => setEditedMotion(e.target.value)}
                placeholder="Slow Zoom In 0.2x"
                className="p-2 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
            ) : (
              <span className={`text-xs text-white leading-snug ${isLocked ? 'blur-[1.5px]' : ''}`}>{editedMotion || '-'}</span>
            )}
          </GlassCard>

          {/* ENVIRONMENT */}
          <GlassCard className={`p-3.5 flex flex-col gap-1.5 transition-all ${isEditActive ? 'border-emerald-400/40 bg-emerald-400/[0.03]' : ''}`}>
            <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Environment & Scene
            </span>
            {isEditActive ? (
              <input
                type="text"
                value={editedEnvironment}
                onChange={(e) => setEditedEnvironment(e.target.value)}
                placeholder="Minimalist Bathroom"
                className="p-2 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            ) : (
              <span className={`text-xs text-white leading-snug ${isLocked ? 'blur-[1.5px]' : ''}`}>{editedEnvironment || '-'}</span>
            )}
          </GlassCard>

        </div>

        {/* Extra Fields (Voice & Aspect Ratio) */}
        {isEditActive && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-accent-pink" />
                <span>Voice / Audio Prompt (Opsional)</span>
              </label>
              <input
                type="text"
                value={editedVoice}
                onChange={(e) => setEditedVoice(e.target.value)}
                placeholder="Indonesian Female Energetic Warm Tone"
                className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
              <select
                value={editedAspectRatio}
                onChange={(e) => setEditedAspectRatio(e.target.value)}
                className="p-2.5 rounded-xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="16:9" className="bg-[#101827]">16:9 (Landscape / YouTube)</option>
                <option value="9:16" className="bg-[#101827]">9:16 (Portrait / Reels / TikTok)</option>
                <option value="1:1" className="bg-[#101827]">1:1 (Square / Feed)</option>
                <option value="4:5" className="bg-[#101827]">4:5 (Instagram Portrait)</option>
              </select>
            </div>
          </div>
        )}

        {/* Edit Actions Bottom Bar */}
        {isEditActive && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setEditedPromptText(prompt.promptText || '');
                setEditedNegativePrompt(prompt.negativePrompt || '');
                setEditedCamera(prompt.cameraSettings || '');
                setEditedLighting(prompt.lighting || '');
                setEditedMotion(prompt.motion || '');
                setEditedEnvironment(prompt.environment || '');
                setEditedVoice(prompt.voice || '');
                setEditedAspectRatio(prompt.aspectRatio || '16:9');
                setIsEditing(false);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <GradientButton
              size="sm"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSaveParameters}
            >
              Simpan Perubahan Parameter
            </GradientButton>
          </div>
        )}

        {/* Tips Footer */}
        {prompt.tips && prompt.tips.length > 0 && !isEditActive && (
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
