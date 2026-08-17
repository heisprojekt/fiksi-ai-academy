import React, { useState } from 'react';
import { Copy, Check, Sparkles, Lightbulb, AlertTriangle, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface ArticleViewerProps {
  content?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackTopics?: string[];
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  content,
  fallbackTitle,
  fallbackDescription,
  fallbackTopics = []
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // If no custom markdown content is provided, render a rich structured fallback view
  if (!content || !content.trim()) {
    return (
      <div className="flex flex-col gap-6 text-slate-200">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Panduan & Rangkuman Pembelajaran</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">{fallbackTitle || 'Materi Pembelajaran Episode'}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {fallbackDescription || 'Ikuti video pembelajaran di atas dan gunakan poin-poin rangkuman ini sebagai panduan praktik langsung Anda.'}
          </p>
        </div>

        {fallbackTopics.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-accent-cyan" />
              <span>Poin-Poin Utama (Key Takeaways):</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fallbackTopics.map((topic, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-xs text-slate-200 font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-200">Tips Praktik:</strong> Tonton video sambil mempraktikkan langkah-langkahnya di tab browser lain untuk mempercepat pemahaman alur kerja AI.
          </div>
        </div>
      </div>
    );
  }

  // Parse markdown lines into structured elements
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol' | 'checklist'; items: React.ReactNode[] } | null = null;
  let codeBlock: { code: string[]; lang?: string } | null = null;
  let blockQuote: string[] | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === 'checklist') {
      renderedElements.push(
        <div key={key} className="flex flex-col gap-2 my-2">
          {currentList.items}
        </div>
      );
    } else if (currentList.type === 'ol') {
      renderedElements.push(
        <ol key={key} className="flex flex-col gap-2 my-2 pl-2">
          {currentList.items}
        </ol>
      );
    } else {
      renderedElements.push(
        <ul key={key} className="flex flex-col gap-2 my-2 pl-2">
          {currentList.items}
        </ul>
      );
    }
    currentList = null;
  };

  const flushCodeBlock = (key: string, idx: number) => {
    if (!codeBlock) return;
    const text = codeBlock.code.join('\n');
    const isCopied = copiedIndex === idx;
    renderedElements.push(
      <div key={key} className="my-3 rounded-2xl bg-[#060816] border border-white/10 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-[11px] text-slate-400">
          <span className="font-mono font-bold text-accent-cyan flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formula Prompt / Kode</span>
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(text, idx)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-purple/20 text-accent-pink hover:bg-accent-purple/30 text-[11px] font-bold transition-all"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {text}
        </pre>
      </div>
    );
    codeBlock = null;
  };

  const flushBlockQuote = (key: string, idx: number) => {
    if (!blockQuote) return;
    const rawQuote = blockQuote.join(' ');
    const isPromptFormula = rawQuote.includes('Formula Prompt') || rawQuote.includes('Prompt Karakter');
    const isTip = rawQuote.includes('Pro Tip') || rawQuote.includes('Tips');
    const isWarning = rawQuote.includes('Perhatian') || rawQuote.includes('Peringatan');
    const isCopied = copiedIndex === idx;

    renderedElements.push(
      <div
        key={key}
        className={`my-3 p-4 rounded-2xl border flex flex-col gap-2 ${
          isWarning
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            : isTip
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : 'bg-accent-purple/10 border-accent-purple/30 text-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {isWarning ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : isTip ? (
              <Lightbulb className="w-4 h-4 text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            )}
            <span className={isWarning ? 'text-rose-300' : isTip ? 'text-amber-300' : 'text-accent-cyan'}>
              {isWarning ? 'Catatan Penting' : isTip ? 'Pro Tip' : 'Highlight Formula'}
            </span>
          </div>

          {isPromptFormula && (
            <button
              type="button"
              onClick={() => handleCopyText(rawQuote.replace(/^>\s*/, ''), idx)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-colors"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{isCopied ? 'Tersalin' : 'Copy'}</span>
            </button>
          )}
        </div>

        <p className="text-xs leading-relaxed text-slate-200 italic font-medium">
          {renderInlineFormatting(rawQuote)}
        </p>
      </div>
    );
    blockQuote = null;
  };

  const renderInlineFormatting = (text: string) => {
    // Basic inline markdown parsing for bold, code, and links
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan font-mono text-[11px] border border-accent-cyan/20">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block handling
    if (trimmed.startsWith('```')) {
      if (codeBlock) {
        flushCodeBlock(`code-${index}`, index);
      } else {
        if (currentList) flushList(`list-before-code-${index}`);
        if (blockQuote) flushBlockQuote(`quote-before-code-${index}`, index);
        codeBlock = { code: [], lang: trimmed.slice(3) };
      }
      return;
    }

    if (codeBlock) {
      codeBlock.code.push(line);
      return;
    }

    // Blockquote handling
    if (trimmed.startsWith('>')) {
      if (currentList) flushList(`list-before-quote-${index}`);
      if (!blockQuote) blockQuote = [];
      blockQuote.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else if (blockQuote) {
      flushBlockQuote(`quote-${index}`, index);
    }

    // Blank line
    if (!trimmed) {
      if (currentList) flushList(`list-${index}`);
      return;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      if (currentList) flushList(`list-${index}`);
      renderedElements.push(<hr key={`hr-${index}`} className="my-4 border-white/10" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      if (currentList) flushList(`list-${index}`);
      renderedElements.push(
        <h1 key={`h1-${index}`} className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3 mb-2 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-gradient-to-b from-accent-cyan to-accent-purple inline-block" />
          <span>{renderInlineFormatting(trimmed.slice(2))}</span>
        </h1>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      if (currentList) flushList(`list-${index}`);
      renderedElements.push(
        <h2 key={`h2-${index}`} className="text-lg font-extrabold text-white tracking-tight mt-4 mb-2 flex items-center gap-2">
          <span>{renderInlineFormatting(trimmed.slice(3))}</span>
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      if (currentList) flushList(`list-${index}`);
      renderedElements.push(
        <h3 key={`h3-${index}`} className="text-base font-bold text-accent-cyan tracking-tight mt-3 mb-1.5">
          {renderInlineFormatting(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Checklists (- [ ] or - [x])
    if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ')) {
      const isChecked = trimmed.startsWith('- [x] ') || trimmed.startsWith('- [X] ');
      const checkText = trimmed.slice(6);
      if (!currentList || currentList.type !== 'checklist') {
        if (currentList) flushList(`list-${index}`);
        currentList = { type: 'checklist', items: [] };
      }
      currentList.items.push(
        <div key={`check-${index}`} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-200">
          {isChecked ? (
            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Square className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <span className={isChecked ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}>
            {renderInlineFormatting(checkText)}
          </span>
        </div>
      );
      return;
    }

    // Numbered lists (1. , 2. )
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) flushList(`list-${index}`);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(
        <li key={`ol-${index}`} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-accent-purple/20 text-accent-pink flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 border border-accent-purple/30">
            {numberedMatch[1]}
          </span>
          <span className="flex-1">{renderInlineFormatting(numberedMatch[2])}</span>
        </li>
      );
      return;
    }

    // Unordered lists (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) flushList(`list-${index}`);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(
        <li key={`ul-${index}`} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0 mt-1.5" />
          <span className="flex-1">{renderInlineFormatting(trimmed.slice(2))}</span>
        </li>
      );
      return;
    }

    // Standard paragraph
    if (currentList) flushList(`list-${index}`);
    renderedElements.push(
      <p key={`p-${index}`} className="text-xs text-slate-300 leading-relaxed my-1.5">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  if (currentList) flushList('list-end');
  if (codeBlock) flushCodeBlock('code-end', lines.length);
  if (blockQuote) flushBlockQuote('quote-end', lines.length);

  return (
    <div className="flex flex-col gap-1 text-slate-200">
      {renderedElements}
    </div>
  );
};
