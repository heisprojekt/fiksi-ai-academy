import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Download, 
  FileText, 
  MessageSquare, 
  Share2, 
  ChevronLeft, 
  Volume2, 
  Maximize, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { MOCK_COURSES } from '../../data/mockData';

export const CourseView: React.FC = () => {
  const { 
    activeCourse, 
    completedEpisodes, 
    toggleEpisodeCompletion, 
    navigateTo, 
    showToast 
  } = useApp();

  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'materi' | 'overview' | 'resources' | 'notes' | 'discussion'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'Omni Flash v3 butuh reference image minimal resolution 1024x1024.',
    'Gunakan seed yang sama untuk mempertahankan raut wajah di episode 3.'
  ]);

  const currentEpisode = activeCourse.episodes[activeEpisodeIndex] || activeCourse.episodes[0];
  const isEpCompleted = !!completedEpisodes[`${activeCourse.id}-${currentEpisode?.id}`];

  const getDriveEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view(\?.*)?$/, '/preview');
    }
    return url;
  };

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes(prev => [userNote, ...prev]);
    setUserNote('');
    showToast('success', 'Catatan Disimpan', 'Catatan belajar berhasil ditambahkan ke akunmu.');
  };

  return (
    <div className="flex flex-col gap-6 py-4">

      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('courses')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Courses</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Instruktur: <strong className="text-white">{activeCourse.instructor.name}</strong></span>
          <Badge variant="cyan" size="sm">{activeCourse.level}</Badge>
        </div>
      </div>

      {/* Course Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeCourse.title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{activeCourse.subtitle}</p>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center gap-3 bg-[#101827] px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Progres Belajar</span>
            <span className="text-sm font-extrabold text-accent-cyan">{activeCourse.progressPercentage}% Selesai</span>
          </div>
          <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden ml-2">
            <div className="bg-gradient-accent h-full" style={{ width: `${activeCourse.progressPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* MAIN MASTERCLASS PLAYER GRID (Matching design screenshot) */}
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
                Materi Episode
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'resources'
                    ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Resources ({activeCourse.resources.length})
              </button>
            </div>

            {/* Episode List */}
            {activeTab !== 'resources' ? (
              <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                {activeCourse.episodes.map((ep, idx) => {
                  const isCurrent = idx === activeEpisodeIndex;
                  const isDone = !!completedEpisodes[`${activeCourse.id}-${ep.id}`] || ep.completed;

                  return (
                    <button
                      key={ep.id}
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
                {activeCourse.resources.map((res, idx) => (
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
          
          {/* Custom Futuristic HTML5 Video Player */}
          <GlassCard glow className="p-0 overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-black flex items-center justify-center group">
              {currentEpisode?.videoUrl?.includes('drive.google.com') ? (
                <iframe
                  key={currentEpisode.videoUrl}
                  src={getDriveEmbedUrl(currentEpisode.videoUrl)}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={currentEpisode.title}
                />
              ) : (
                <>
                  <video
                    key={currentEpisode?.videoUrl}
                    src={currentEpisode?.videoUrl}
                    controls={false}
                    className="w-full h-full object-cover"
                    poster={activeCourse.thumbnail}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Play Overlay Button */}
                  {!isPlaying && (
                    <div 
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-gradient-accent flex items-center justify-center text-white shadow-2xl shadow-accent-purple/60 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bottom Video Controls Overlay Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                {/* Progress bar line */}
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-gradient-accent h-full w-[45%]" />
                </div>

                <div className="flex items-center justify-between text-xs text-white pt-1">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-accent-cyan">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-300">08:24 / {currentEpisode?.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 hover:text-accent-cyan cursor-pointer" />
                    <span className="text-[11px] font-mono px-1.5 py-0.5 bg-white/10 rounded">1080p 60fps</span>
                    <Maximize className="w-4 h-4 hover:text-accent-cyan cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Under Video Episode Info & Action Buttons */}
            <div className="p-6 flex flex-col gap-4 bg-[#101827]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{currentEpisode?.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{currentEpisode?.description}</p>
                </div>

                <GradientButton
                  variant={isEpCompleted ? 'secondary' : 'gradient'}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => toggleEpisodeCompletion(activeCourse.id, currentEpisode?.id)}
                  className="shrink-0"
                >
                  {isEpCompleted ? 'Sudah Selesai ✓' : 'Tandai Selesai'}
                </GradientButton>
              </div>

              {/* Key Topics List */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Topik Yang Dibahas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentEpisode?.keyTopics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </GlassCard>

          {/* Interactive Notes Section */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-cyan" />
              <span>Catatan Pribadi Episode Ini</span>
            </h4>

            <div className="flex flex-col gap-2">
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Tulis catatan penting dari episode ini..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple/60 resize-none"
              />
              <div className="flex justify-end">
                <GradientButton size="sm" onClick={handleSaveNote}>
                  Simpan Catatan
                </GradientButton>
              </div>
            </div>

            {savedNotes.length > 0 && (
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400">Catatan Tersimpan:</span>
                {savedNotes.map((note, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300">
                    "{note}"
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
