import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Github, Twitter, Instagram, Youtube } from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#060816] pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Glow backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent-purple/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo size="md" onClick={() => navigateTo('landing')} />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform edukasi AI generasi terbaru untuk kreator konten modern. Kuasai prompt engineering, animasi video, dan produksi visual AI tanpa batas.
            </p>

            {/* Feature badges row matching footer of screenshot */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="cyan" size="sm">⚡ Desain Futuristic</Badge>
              <Badge variant="purple" size="sm">📋 Copy Prompt 1-Klik</Badge>
              <Badge variant="outline" size="sm">📱 PWA Ready</Badge>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('courses')} className="hover:text-accent-cyan transition-colors">
                  Masterclass Kursus
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('prompts')} className="hover:text-accent-cyan transition-colors">
                  Prompt Library
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('assets')} className="hover:text-accent-cyan transition-colors">
                  Assets & Resources
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('blog')} className="hover:text-accent-cyan transition-colors">
                  Blog & Artikel
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard')} className="hover:text-accent-cyan transition-colors">
                  Member Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Models Supported</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors">Omni Flash v3</span></li>
              <li><span className="hover:text-white transition-colors">Nano Banana</span></li>
              <li><span className="hover:text-white transition-colors">Seedance 3D</span></li>
              <li><span className="hover:text-white transition-colors">Midjourney v6.1</span></li>
              <li><span className="hover:text-white transition-colors">Flux.1 Pro</span></li>
              <li><span className="hover:text-white transition-colors">Kling AI Video</span></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Update Mingguan</h4>
            <p className="text-xs text-slate-400">
              Dapatkan 10 prompt gratis dan tips AI terbaru langsung di inbox-mu.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <input
                type="email"
                placeholder="email@kreator.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#101827] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple/60"
              />
              <GradientButton size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Langganan Newsletter
              </GradientButton>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Dibuat untuk kreator modern seperti kamu. © {new Date().getFullYear()} FIKSI AI Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-slate-300 transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="hover:text-slate-300 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-slate-300 transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};
