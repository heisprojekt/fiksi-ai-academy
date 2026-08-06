import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  GraduationCap, 
  FileText, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { MOCK_PROMPTS, MOCK_COURSES } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'prompts' | 'analytics'>('users');
  const [showAddModal, setShowAddModal] = useState(false);

  const mockUsers = [
    { id: 'u-1', name: 'Heisy', email: 'heisy.creator@gmail.com', role: 'Pro Member', joined: '12 Mar 2025', status: 'Aktif' },
    { id: 'u-2', name: 'Budi Santoso', email: 'budi.creators@gmail.com', role: 'Pro Member', joined: '10 Mei 2025', status: 'Aktif' },
    { id: 'u-3', name: 'Diana Putri', email: 'diana.agency@gmail.com', role: 'Free Member', joined: '01 Jun 2025', status: 'Pending' },
    { id: 'u-4', name: 'Rian Antigravity', email: 'rian@fiksi.ai', role: 'Admin', joined: '01 Jan 2025', status: 'Aktif' },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" icon={<ShieldCheck className="w-3.5 h-3.5" />}>ADMINISTRATOR PORTAL</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Admin Management & Analytics</h1>
        </div>

        <GradientButton
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setShowAddModal(true);
            showToast('info', 'Tambah Konten Baru', 'Formulir upload siap diisi.');
          }}
        >
          Tambah Konten Baru
        </GradientButton>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400">Total Pendapatan (MRR)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">Rp 184.500.000</span>
            <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">+18%</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400">Total Kreator Terdaftar</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-accent-cyan">12,420</span>
            <span className="text-[11px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full font-bold">+340 minggu ini</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400">Prompt Copy Hits</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-accent-purple">485,200</span>
            <span className="text-[11px] text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full font-bold">1-Klik</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400">Tingkat Penyelesaian Modul</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">78.4%</span>
            <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-bold">Tinggi</span>
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Kelola Users ({mockUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'prompts' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Kelola Prompts ({MOCK_PROMPTS.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'courses' ? 'bg-gradient-accent text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Kelola Courses ({MOCK_COURSES.length})
        </button>
      </div>

      {/* Table Content */}
      <GlassCard className="p-6 overflow-x-auto">
        {activeTab === 'users' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-white">{u.name}</td>
                  <td className="py-3 text-slate-400">{u.email}</td>
                  <td className="py-3">
                    <Badge variant={u.role === 'Pro Member' ? 'pro' : 'outline'} size="sm">{u.role}</Badge>
                  </td>
                  <td className="py-3">{u.joined}</td>
                  <td className="py-3">
                    <span className="text-emerald-400 font-semibold">{u.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-accent-cyan transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'prompts' && (
          <div className="flex flex-col gap-3">
            {MOCK_PROMPTS.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <span className="text-[10px] text-slate-400">{p.aiModel} • {p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-accent-cyan"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="flex flex-col gap-3">
            {MOCK_COURSES.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{c.title}</span>
                    <span className="text-[10px] text-slate-400">{c.totalEpisodes} Episode • {c.level}</span>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-accent-cyan"><Edit3 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

    </div>
  );
};
