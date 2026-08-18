import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Users, 
  Download, 
  ChevronDown, 
  Star,
  Video,
  Copy,
  FolderDown,
  Wand2
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const LandingView: React.FC = () => {
  const { navigateTo, userRole, setUserRole, setIsAuthModalOpen, setAuthMode } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      title: 'Premium Prompt Library',
      description: 'Akses 500+ formula prompt teruji untuk Omni Flash, Nano Banana, Midjourney, dan Flux.1 dengan sekali klik.',
      icon: Sparkles,
      color: 'from-accent-cyan to-accent-blue'
    },
    {
      title: 'Masterclass AI Video',
      description: 'Tutorial komprehensif cara membuat video iklan UGC, animasi 3D, dan sinematik film berstandar studio.',
      icon: Video,
      color: 'from-accent-blue to-accent-purple'
    },
    {
      title: 'Downloadable Asset Hub',
      description: 'Download aset overlay PNG, preset LUT warna, template Photoshop, dan storyboard grid tanpa biaya tambahan.',
      icon: FolderDown,
      color: 'from-accent-purple to-accent-pink'
    },
    {
      title: 'Character Consistency Builder',
      description: 'Teknik rahasia menjaga konsistensi karakter manusia di berbagai scene dan ekspresi secara presisi.',
      icon: Wand2,
      color: 'from-accent-pink to-accent-cyan'
    },
    {
      title: 'Update Konten Mingguan',
      description: 'Setiap minggu selalu ada penambahan 30+ prompt pack baru, episode masterclass terbaru, dan patch v1.8.',
      icon: Zap,
      color: 'from-emerald-400 to-accent-cyan'
    },
    {
      title: 'Komunitas Kreator AI',
      description: 'Diskusi eksklusif, review hasil karya, dan networking bersama 12,000+ kreator konten AI aktif di Indonesia.',
      icon: Users,
      color: 'from-accent-cyan to-accent-purple'
    }
  ];

  const stats = [
    { label: 'Prompt Packs Premium', value: '500+' },
    { label: 'Kreator Aktif', value: '12,400+' },
    { label: 'Masterclass & Modul', value: '48+' },
    { label: 'Aset Di-download', value: '95,000+' }
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Content Creator (1.2M Followers)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      comment: 'FIKSI AI Academy mengubah cara saya bikin konten iklan. Dulu produksi video butuh 3 hari, sekarang dengan Omni Flash masterclass dan prompt library bisa selesai dalam 1 jam saja!',
      rating: 5
    },
    {
      name: 'Diana Putri',
      role: 'Agency Founder',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      comment: 'Investasi terbaik tahun ini! Prompt UGC product review sangat akurat dan menghemat budget shoot tim kami hingga 80%.',
      rating: 5
    },
    {
      name: 'Reza Rahardian',
      role: 'Motion Designer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      comment: 'Tutorial Seedance 3D animation benar-benar mind-blowing. Visualnya sangat mahal dan siap pakai untuk project klien internasional.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'Apakah FIKSI AI Academy cocok untuk pemula yang belum pernah pakai AI?',
      a: 'Sangat cocok! Kami menyusun kurikulum dari tingkat dasar (pengenalan prompt & tool setup) hingga tingkat masterclass sinematik.'
    },
    {
      q: 'Model AI apa saja yang dipelajari di platform ini?',
      a: 'Kami fokus pada model terkini seperti Omni Flash v3, Nano Banana, Seedance 3D, Midjourney v6.1, Flux.1 Pro, Kling AI, dan Veed AI.'
    },
    {
      q: 'Apakah prompt dan aset bisa digunakan untuk komersial?',
      a: 'Ya, seluruh prompt formula dan aset yang kamu download di FIKSI AI Academy bebas digunakan untuk keperluan komersial maupun pribadi tanpa royalty fee.'
    },
    {
      q: 'Bagaimana cara mengakses update konten mingguan?',
      a: 'Sebagai Pro Member, kamu akan otomatis mendapatkan akses ke seluruh prompt baru dan tutorial baru setiap minggunya di tab Updates.'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-24 py-8">

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 w-full">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-gradient-hero blur-[140px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-5 flex flex-col items-start gap-6 text-left z-10">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Next-Gen AI Creator Studio</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]"
            >
              Belajar <span className="text-gradient">AI.</span><br />
              Buat Konten.<br />
              Dapat <span className="text-gradient">Hasil.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl"
            >
              Studio belajar AI terintegrasi dengan 500+ formula prompt teruji, video masterclass sinematik, dan aset siap pakai untuk kreator modern.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                onClick={() => {
                  if (userRole === 'Guest') {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  } else {
                    navigateTo('dashboard');
                  }
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Mulai Eksplorasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('course-detail', 'omni-flash-masterclass')}
                className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Lihat Masterclass</span>
              </button>
            </motion.div>

            {/* Feature Highlights Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/[0.08] w-full text-slate-300 text-xs font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>48+ Modul</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>500+ Prompt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Update Rutin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Akses Selamanya</span>
              </div>
            </motion.div>

          </div>

          {/* Right Resource & Prompt Library Studio Canvas Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative z-10"
          >
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-purple-500/15 to-transparent shadow-[0_20px_80px_-15px_rgba(6,182,212,0.25)]">
              <div className="rounded-[22px] bg-[#0E1017] flex flex-col overflow-hidden border border-white/[0.08] text-slate-100">
                
                {/* macOS Window Chrome Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#13151D] border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0C10] border border-white/[0.06] text-[11px] font-mono text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>fiksi-resource-library.v2</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">500+ Curated Prompts</span>
                    <button
                      onClick={() => navigateTo('prompts')}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-cyan-500/25 transition-all"
                    >
                      Buka Resource
                    </button>
                  </div>
                </div>

                {/* Studio Resource Screenshot Container */}
                <div className="relative aspect-[16/10] bg-[#0B0C10] overflow-hidden group cursor-pointer" onClick={() => navigateTo('prompts')}>
                  <img
                    src="/resource-preview.jpg"
                    alt="FIKSI AI Resource & Prompt Library Studio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Top-to-Bottom Lighting Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Floating Action Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-[#0B0C10]/85 backdrop-blur-md border border-white/10 z-10 shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white">Direktori Resource & Formula Prompt</span>
                        <span className="text-[10px] text-slate-400">Midjourney v6 • Flux.1 • Kling AI • UGC Ads</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('prompts');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors"
                    >
                      Jelajahi Sekarang →
                    </button>
                  </div>
                </div>

                {/* Bottom Canvas Status Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#13151D] border-t border-white/[0.08] text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300 font-semibold">deployed:</span>
                    <span className="text-cyan-400 font-bold">fiksiai.my.id</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-slate-500">MongoDB Atlas: Connected</span>
                    <span className="text-slate-300 font-bold">100% Zoom</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <GlassCard className="p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-gradient">{st.value}</span>
                <span className="text-xs sm:text-sm font-medium text-slate-400">{st.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* FEATURE GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <Badge variant="purple">FITUR UNGGULAN</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Segala Hal Yang Kamu Butuhkan Untuk Kuasai AI
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Ekosistem belajar terpadu dengan alat bantu terlengkap untuk meningkatkan produktivitas konten digitalmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} hoverable className="p-6 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-[#101827] rounded-[14px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 text-accent-cyan" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-3">
          <Badge variant="cyan">TESTIMONIAL</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Dipercaya Oleh 12,000+ Kreator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tm, idx) => (
            <GlassCard key={idx} className="p-6 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(tm.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{tm.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={tm.avatar}
                  alt={tm.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-accent-purple/40"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{tm.name}</span>
                  <span className="text-[11px] text-slate-400">{tm.role}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <Badge variant="pro">PILIHAN KEANGGOTAAN</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Mulai Belajar Hari Ini
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Pilih paket keanggotaan yang sesuai dengan kebutuhan kreasi AI-mu. Tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Tier */}
          <GlassCard className="p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Access</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Rp 0</span>
                <span className="text-xs text-slate-400">/ selamanya</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Akses terbatas untuk mencoba modul dasar dan prompt sample gratis.
              </p>

              <ul className="flex flex-col gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Akses 3 Episode Modul Dasar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10 Prompt Sample Gratis</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span className="w-4 h-4 text-center">✕</span>
                  <span>Akses Asset Download PNG/PSD</span>
                </li>
              </ul>
            </div>

            <GradientButton
              variant="secondary"
              className="w-full"
              onClick={() => {
                setUserRole('Free Member');
                navigateTo('dashboard');
              }}
            >
              Coba Gratis
            </GradientButton>
          </GlassCard>

          {/* Pro Member - Glowing Hero Pricing Card */}
          <GlassCard glow className="p-8 flex flex-col justify-between gap-6 relative border-accent-purple">
            <div className="absolute top-4 right-4">
              <Badge variant="pro">PALING POPULER</Badge>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-pink">Pro Member</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Rp 199k</span>
                <span className="text-xs text-slate-400">/ bulan</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Akses penuh tanpa batas ke seluruh fitur, masterclass, prompt pack, dan aset download.
              </p>

              <ul className="flex flex-col gap-3 pt-4 border-t border-white/10 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span className="font-semibold text-white">Akses 48+ Masterclass & Video Tutorial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span className="font-semibold text-white">500+ Prompt Pack Premium (1-Klik Copy)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Download Unlimited PSD, PNG, & LUTs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Update Prompt & Modul Setiap Minggu</span>
                </li>
              </ul>
            </div>

            <GradientButton
              size="lg"
              className="w-full"
              onClick={() => {
                setUserRole('Pro Member');
                navigateTo('dashboard');
              }}
            >
              Berlangganan Pro
            </GradientButton>
          </GlassCard>

          {/* Lifetime Access */}
          <GlassCard className="p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifetime Pass</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Rp 1.499k</span>
                <span className="text-xs text-slate-400">/ sekali bayar</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bayar sekali untuk akses seumur hidup ke semua update di masa depan.
              </p>

              <ul className="flex flex-col gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Semua Fitur Pro Member Selamanya</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Grup VIP Telegram Discord Direct Mentor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Early Access Model AI Beta Test</span>
                </li>
              </ul>
            </div>

            <GradientButton
              variant="outline"
              className="w-full"
              onClick={() => {
                setUserRole('Pro Member');
                navigateTo('dashboard');
              }}
            >
              Beli Lifetime
            </GradientButton>
          </GlassCard>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <Badge variant="cyan">FAQ</Badge>
          <h2 className="text-3xl font-bold text-white">Pertanyaan Sering Diajukan</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <GlassCard key={idx} className="p-5 cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-accent-cyan' : ''}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-slate-400 mt-3 leading-relaxed pt-3 border-t border-white/10">
                  {faq.a}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

    </div>
  );
};
