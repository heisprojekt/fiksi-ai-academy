import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USER } from '../../data/mockData';
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
  LogOut
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const ProfileView: React.FC = () => {
  const { userRole, setUserRole, showToast, bookmarks } = useApp();
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'security' | 'notifications'>('account');
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);

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
            src={MOCK_USER.avatar}
            alt={MOCK_USER.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-accent-purple/50 shadow-xl"
          />
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <Badge variant="pro" icon={<Crown className="w-3.5 h-3.5" />}>{userRole}</Badge>
            </div>
            <span className="text-xs text-slate-400 font-mono">{email}</span>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span>Bergabung sejak: <strong className="text-white">{MOCK_USER.joinedDate}</strong></span>
              <span>•</span>
              <span>Berakhir pada: <strong className="text-accent-cyan">{MOCK_USER.validUntil}</strong></span>
            </div>
          </div>
        </div>

        <GradientButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setUserRole('Guest');
            showToast('info', 'Keluar Akun', 'Kamu telah keluar dari sesi.');
          }}
          icon={<LogOut className="w-4 h-4 text-rose-400" />}
        >
          Keluar
        </GradientButton>
      </GlassCard>

      {/* Stats Counters Section (Matching screenshot statistics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-white">12</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-accent-cyan" />
            Courses Selesai
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-accent-cyan">{bookmarks.length || 156}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-accent-cyan" />
            Prompt Disimpan
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-accent-purple">32</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-accent-purple" />
            Downloads
          </span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-1">
          <span className="text-2xl font-extrabold text-amber-400">24 Hari</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Streak Belajar
          </span>
        </GlassCard>
      </div>

      {/* Settings Navigation & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Settings Sidebar Tabs */}
        <div className="md:col-span-4 flex flex-col gap-2 p-2 rounded-3xl bg-[#101827]/40 border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'account' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Pengaturan Akun</span>
          </button>
          
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'billing' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Riwayat Pembelian & Metode</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'notifications' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifikasi</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'security' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
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
                  <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple/60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Utama</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-2xl bg-[#060816] border border-white/10 text-xs text-white focus:outline-none focus:border-accent-purple/60"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <GradientButton size="sm" type="submit">
                    Simpan Perubahan
                  </GradientButton>
                </div>
              </form>
            )}

            {activeTab === 'billing' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Riwayat Pembelian</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">Langganan Pro Member (1 Tahun)</span>
                      <span className="text-[11px] text-slate-400">12 Maret 2025 • Midtrans QRIS</span>
                    </div>
                    <span className="font-extrabold text-emerald-400">Rp 1.499.000 (Lunas)</span>
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
