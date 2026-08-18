import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  History, 
  KeyRound, 
  CheckCircle2, 
  Crown, 
  Flame, 
  Bookmark, 
  Download, 
  GraduationCap,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const ProfileView: React.FC = () => {
  const { 
    theme,
    setTheme,
    currentUser, 
    userRole, 
    setUserRole, 
    showToast, 
    bookmarks,
    logout,
    navigateTo,
    setIsUpgradeModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'security' | 'notifications'>('account');
  const [name, setName] = useState(currentUser?.name || 'Kreator AI');
  const [email, setEmail] = useState(currentUser?.email || 'kreator@fiksi.ai');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profil Diperbarui', 'Informasi akun kamu berhasil disimpan.');
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto w-full">

      {/* Profile Header Card */}
      <GlassCard glow className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-accent-purple/50 shadow-xl"
          />
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{name}</h1>
              <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'} icon={<Crown className="w-3.5 h-3.5" />}>
                {userRole}
              </Badge>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email}</span>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>Bergabung sejak: <strong className="text-slate-900 dark:text-white">{currentUser?.joinedDate || '01 Jan 2025'}</strong></span>
              <span>•</span>
              <span>Berakhir pada: <strong className="text-cyan-600 dark:text-accent-cyan">{currentUser?.validUntil || 'Lifetime VIP'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'Admin' && (
            <GradientButton
              size="sm"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => navigateTo('admin')}
            >
              Buka Admin CMS
            </GradientButton>
          )}

          {userRole === 'Free Member' && (
            <GradientButton
              size="sm"
              icon={<Crown className="w-4 h-4" />}
              onClick={() => setIsUpgradeModalOpen(true)}
            >
              Upgrade ke Pro via QRIS
            </GradientButton>
          )}

          <GradientButton
            variant="secondary"
            size="sm"
            onClick={logout}
            icon={<LogOut className="w-4 h-4 text-rose-400" />}
          >
            Keluar
          </GradientButton>
        </div>
      </GlassCard>

      {/* Stats Counters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentUser?.coursesCompleted || 12}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-accent-cyan" />
            Courses Selesai
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-cyan-600 dark:text-accent-cyan">{bookmarks.length || 156}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-cyan-600 dark:text-accent-cyan" />
            Prompt Disimpan
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-purple-600 dark:text-accent-purple">{currentUser?.totalDownloads || 32}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-purple-600 dark:text-accent-purple" />
            Downloads
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-amber-500 dark:text-amber-400">{currentUser?.streakDays || 24} Hari</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Streak Belajar
          </span>
        </GlassCard>
      </div>

      {/* Settings Navigation & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Settings Sidebar Tabs */}
        <div className="md:col-span-4 flex flex-col gap-2 p-2 rounded-3xl bg-slate-100/80 dark:bg-[#101827]/40 border border-slate-200 dark:border-white/[0.06] shadow-sm dark:shadow-none">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'account' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Pengaturan Akun</span>
          </button>
          
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'billing' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Riwayat Pembelian & Metode</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'notifications' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifikasi</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'security' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Keamanan & Password</span>
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-8">
          <GlassCard className="p-6">
            {activeTab === 'account' && (
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Informasi Akun</h3>
                
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0B0C10] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Utama</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0B0C10] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/60"
                    />
                  </div>

                  {/* Theme Mode Preference Selector */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Preferensi Tampilan (Theme Mode)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          theme === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                            : 'bg-slate-100 dark:bg-[#0B0C10] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Moon className="w-4 h-4 text-cyan-400" />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold">Dark Mode</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Obsidian studio sleek</span>
                          </div>
                        </div>
                        {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          theme === 'light'
                            ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                            : 'bg-slate-100 dark:bg-[#0B0C10] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold">Light Mode</span>
                            <span className="text-[10px] text-slate-500">Clean crisp daylight</span>
                          </div>
                        </div>
                        {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-cyan-600" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <GradientButton size="sm" type="submit">
                      Simpan Perubahan
                    </GradientButton>
                  </div>
                </form>
              )}

            {activeTab === 'billing' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white">Status Membership & Pembayaran</h3>
                  <Badge variant={userRole === 'Admin' ? 'purple' : userRole === 'Pro Member' ? 'pro' : 'outline'}>
                    {userRole}
                  </Badge>
                </div>

                {/* Free Member Upgrade Banner */}
                {userRole === 'Free Member' && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-accent-purple/20 via-accent-cyan/10 to-transparent border border-accent-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-accent-cyan/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-accent-cyan" />
                        <h4 className="text-sm font-bold text-white">Buka Akses Penuh FIKSI Pro</h4>
                      </div>
                      <p className="text-xs text-slate-300 max-w-md">
                        Dapatkan akses instan ke semua Masterclass, 100+ Prompt Formula komersial, dan VIP Discord via QRIS.
                      </p>
                    </div>
                    <GradientButton
                      size="sm"
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="shrink-0"
                    >
                      Bayar via QRIS
                    </GradientButton>
                  </div>
                )}
                
                {/* Recent Billing History */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slate-400">Riwayat Transaksi QRIS:</span>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">
                        {userRole === 'Pro Member' ? 'Langganan Pro Member (1 Tahun)' : 'Akun Dasar (Free Tier)'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {userRole === 'Pro Member' ? 'QRIS Instant • Status Lunas' : 'Pendaftaran Gratis • Bebas Biaya'}
                      </span>
                    </div>
                    <span className="font-extrabold text-emerald-400">
                      {userRole === 'Pro Member' ? 'Rp 399.000' : 'Rp 0'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Pengaturan Notifikasi</h3>
                <div className="flex flex-col gap-3 text-xs text-slate-300">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                    <span>Notifikasi Email untuk Update Mingguan</span>
                    <input type="checkbox" defaultChecked className="accent-accent-cyan w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                    <span>Notifikasi Rilis Modul Kursus Baru</span>
                    <input type="checkbox" defaultChecked className="accent-accent-cyan w-4 h-4" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Ubah Password</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="password"
                    placeholder="Password saat ini"
                    className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password baru"
                    className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none"
                  />
                  <GradientButton size="sm" className="w-fit">Update Password</GradientButton>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
