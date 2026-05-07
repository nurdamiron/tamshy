'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Button from '@/components/ui/Button';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  fileUrl: string | null;
  photoCount: number | null;
  viewCount: number;
  createdAt: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  NEWS:   { label: 'Жаңалық',    color: 'text-blue-700',   bg: 'bg-blue-50',   gradient: 'from-blue-500 to-blue-600' },
  REPORT: { label: 'Есеп',       color: 'text-amber-700',  bg: 'bg-amber-50',  gradient: 'from-amber-500 to-orange-500' },
  PHOTO:  { label: 'Фото',       color: 'text-green-700',  bg: 'bg-green-50',  gradient: 'from-green-500 to-emerald-500' },
  VIDEO:  { label: 'Бейне',      color: 'text-purple-700', bg: 'bg-purple-50', gradient: 'from-purple-500 to-violet-600' },
};

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = useLocale();

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Жаңалық табылмады');
        return r.json();
      })
      .then((data) => setNews(data.news))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-72 bg-slate-200 rounded-2xl" />
        <div className="h-6 w-3/4 bg-slate-200 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-[16px] text-[#64748B] mb-4">{error || 'Жаңалық табылмады'}</p>
        <Link href="/news">
          <Button variant="secondary" size="md">← Жаңалықтарға оралу</Button>
        </Link>
      </div>
    );
  }

  const cfg = CATEGORY_CONFIG[news.category];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[13px] text-[#64748B] hover:text-[#0284C7] transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Жаңалықтарға оралу
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Hero image or gradient */}
        {news.imageUrl ? (
          <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className={`relative w-full h-[200px] rounded-2xl bg-gradient-to-br ${cfg?.gradient || 'from-slate-400 to-slate-500'} mb-8 flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 border-white" />
              <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full border border-white" />
            </div>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {cfg && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
          )}
          <span className="text-[13px] text-[#94A3B8]">
            {new Date(news.createdAt).toLocaleDateString(locale, {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-[#94A3B8]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {news.viewCount} қарау
          </span>
          {news.photoCount && news.category === 'PHOTO' && (
            <span className="flex items-center gap-1.5 text-[13px] text-[#94A3B8]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {news.photoCount} фото
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mb-6 leading-tight">
          {news.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none text-[15px] text-[#334155] leading-relaxed
            prose-headings:text-[#0F172A] prose-headings:font-semibold
            prose-a:text-[#0284C7] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* File attachment */}
        {news.fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0F172A]">Тіркелген файл</p>
                <p className="text-[11px] text-[#94A3B8] truncate max-w-[240px]">{news.fileUrl.split('/').pop()}</p>
              </div>
            </div>
            <a
              href={news.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="secondary" size="sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Жүктеу
              </Button>
            </a>
          </motion.div>
        )}

        {/* Back button bottom */}
        <div className="mt-10 pt-6 border-t border-[#E2E8F0]">
          <Link href="/news">
            <Button variant="ghost" size="md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Жаңалықтарға оралу
            </Button>
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
