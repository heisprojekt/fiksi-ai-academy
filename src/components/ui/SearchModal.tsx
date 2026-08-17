import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { MOCK_COURSES, MOCK_PROMPTS, MOCK_ASSETS } from '../../data/mockData';
import { Search, GraduationCap, Sparkles, FolderDown, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { courses, prompts, assets, isSearchModalOpen, setIsSearchModalOpen, navigateTo } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const matchedCourses = courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  const matchedPrompts = prompts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  const matchedAssets = assets.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} maxWidth="2xl">
      <div className="flex flex-col gap-4">
        
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama modul, prompt, atau aset..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#060816] border border-white/20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
          />
        </div>

        {/* Search Results */}
        <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Ketik kata kunci untuk mencari di seluruh ekosistem FIKSI AI Academy.
            </div>
          ) : (
            <>
              {/* Courses Results */}
              {matchedCourses.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Courses ({matchedCourses.length})
                  </span>
                  {matchedCourses.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        navigateTo('course-detail', c.id);
                      }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-cyan/40 hover:bg-white/[0.08] cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail} className="w-10 h-10 rounded-lg object-cover" alt={c.title} />
                        <span className="text-xs font-bold text-white">{c.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Prompts Results */}
              {matchedPrompts.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent-purple flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Prompts ({matchedPrompts.length})
                  </span>
                  {matchedPrompts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        navigateTo('prompts');
                      }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-purple/40 hover:bg-white/[0.08] cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.thumbnail} className="w-10 h-10 rounded-lg object-cover" alt={p.title} />
                        <span className="text-xs font-bold text-white">{p.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Assets Results */}
              {matchedAssets.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <FolderDown className="w-3.5 h-3.5" />
                    Assets ({matchedAssets.length})
                  </span>
                  {matchedAssets.map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        navigateTo('assets');
                      }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/40 hover:bg-white/[0.08] cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={a.thumbnail} className="w-10 h-10 rounded-lg object-cover" alt={a.title} />
                        <span className="text-xs font-bold text-white">{a.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </Modal>
  );
};
