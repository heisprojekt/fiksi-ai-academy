import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[#101827]/95 border border-white/15 backdrop-blur-2xl shadow-2xl max-w-md"
        >
          {toast.type === 'success' && (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-9 h-9 rounded-xl bg-accent-blue/20 text-accent-cyan flex items-center justify-center shrink-0 border border-accent-blue/30">
              <Info className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 pr-2">
            <h4 className="text-sm font-semibold text-white leading-snug">{toast.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={hideToast}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
