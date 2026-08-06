import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_BLOGS } from '../../data/mockData';
import { 
  Newspaper, 
  Clock, 
  User, 
  Tag, 
  BookOpen, 
  Share2, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Badge } from '../ui/Badge';

export const BlogView: React.FC = () => {
  const { selectedBlog, setSelectedBlog } = useApp();
  const blog = selectedBlog || MOCK_BLOGS[0];

  return (
    <div className="flex flex-col gap-8 py-4 max-w-6xl mx-auto w-full">

      {/* Blog Article Header */}
      <div className="flex flex-col gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Badge variant="purple" icon={<Newspaper className="w-3.5 h-3.5" />}>BLOG & ARTICLES</Badge>
          <Badge variant="cyan" size="sm">{blog.category}</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <img src={blog.author.avatar} alt={blog.author.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-white font-semibold">{blog.author.name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{blog.publishedAt}</span>
          </div>
          <span>•</span>
          <span className="text-accent-cyan font-bold">{blog.readTime}</span>
        </div>
      </div>

      {/* Cover Image Banner */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Grid with Table of Contents Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content (8 cols) */}
        <GlassCard className="lg:col-span-8 p-6 sm:p-8 flex flex-col gap-6 text-slate-200 text-sm leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-accent-cyan prose-strong:text-white"
          />

          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <Badge key={i} variant="outline" size="sm">#{tag}</Badge>
            ))}
          </div>
        </GlassCard>

        {/* Table of Contents Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
          <GlassCard className="p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Daftar Isi Artikel</span>
            </h3>

            <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-xs">
              {blog.tableOfContents.map((item, i) => (
                <a
                  key={i}
                  href={`#${item.id}`}
                  className="text-slate-400 hover:text-white hover:translate-x-1 transition-all py-1 border-l-2 border-transparent hover:border-accent-cyan pl-2"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
