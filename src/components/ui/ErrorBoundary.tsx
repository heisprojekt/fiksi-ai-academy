import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { GradientButton } from './GradientButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);

    // If it's a chunk loading failure after new deployment, auto-reload once to fetch latest chunks
    const isChunkError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      const hasReloaded = window.sessionStorage.getItem('chunk_reload_triggered');
      if (!hasReloaded) {
        window.sessionStorage.setItem('chunk_reload_triggered', 'true');
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    try {
      window.sessionStorage.removeItem('chunk_reload_triggered');
    } catch {}
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      window.sessionStorage.removeItem('chunk_reload_triggered');
      localStorage.removeItem('fiksi_current_view');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0B0C10] text-slate-100">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#12141F] border border-white/10 shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Memperbarui Studio Canvas
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Terdapat pembaruan versi baru atau koneksi browser terputus sementara. Muat ulang halaman untuk menyinkronkan data.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <GradientButton
                className="flex-1"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={this.handleReset}
              >
                Muat Ulang
              </GradientButton>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left w-full text-[10px] text-rose-400 bg-black/40 p-3 rounded-xl overflow-auto max-h-32 border border-rose-500/20 font-mono">
                <summary className="cursor-pointer font-bold mb-1">Debug Stack Trace</summary>
                {this.state.error.toString()}
              </details>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
