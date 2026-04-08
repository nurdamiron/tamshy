'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  viewCount: number;
  createdAt: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  NEWS:   { label: 'Новости',  color: 'text-blue-700',   bg: 'bg-blue-50',   gradient: 'from-blue-500 to-blue-600' },
  REPORT: { label: 'Отчёты',   color: 'text-amber-700',  bg: 'bg-amber-50',  gradient: 'from-amber-500 to-orange-500' },
  PHOTO:  { label: 'Фото',     color: 'text-green-700',  bg: 'bg-green-50',  gradient: 'from-green-500 to-emerald-500' },
  VIDEO:  { label: 'Видео',    color: 'text-purple-700', bg: 'bg-purple-50', gradient: 'from-purple-500 to-violet-600' },
};

const CATEGORIES = ['ALL', 'NEWS', 'REPORT', 'PHOTO', 'VIDEO'];

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0]/60 animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-16 bg-slate-200 rounded-full" />
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-3 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const observerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const fetchNews = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum) });
      if (category !== 'ALL') params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/news?${params}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();

      setNewsList(prev => append ? [...prev, ...(data.news || [])] : (data.news || []));
      setTotalPages(data.pages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    setPage(1);
    fetchNews(1);
  }, [fetchNews]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loading) {
          const next = page + 1;
          setPage(next);
          fetchNews(next, true);
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loading, fetchNews]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchNews(1);
    }, 350);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader title="Новости" subtitle="Актуальные новости, фоторепортажи и видеоматериалы олимпиады" />

      {/* Search + category tabs */}
      <div className="sticky top-16 z-30 bg-[#F8FAFC]/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Поиск по новостям..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const cfg = cat === 'ALL' ? null : CATEGORY_CONFIG[cat];
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border ${
                    isActive
                      ? cat === 'ALL'
                        ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-[0_2px_8px_rgba(2,132,199,0.3)]'
                        : `bg-gradient-to-r ${cfg?.gradient} text-white border-transparent shadow-md`
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0284C7]/40 hover:text-[#0284C7]'
                  }`}
                >
                  {cat === 'ALL' ? 'Все' : cfg?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {!loading && newsList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-[16px] text-[#64748B]">Новостей не найдено</p>
            <p className="text-[13px] text-[#64748B]/60 mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {newsList.map((item, i) => {
              const cfg = CATEGORY_CONFIG[item.category];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <Link href={`/news/${item.id}`}>
                    <motion.article
                      className="group bg-white rounded-2xl overflow-hidden border border-[#E2E8F0]/60 h-full flex flex-col cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]"
                      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {/* Image / gradient placeholder */}
                      {item.imageUrl ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className={`relative h-48 bg-gradient-to-br ${cfg?.gradient || 'from-slate-400 to-slate-500'} flex items-center justify-center overflow-hidden`}>
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white" />
                            <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full border border-white" />
                          </div>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.7">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        {/* Category badge */}
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg?.bg || 'bg-slate-50'} ${cfg?.color || 'text-slate-600'}`}>
                            {cfg?.label || item.category}
                          </span>
                        </div>

                        <h2 className="text-[15px] font-semibold text-[#0F172A] mb-2 line-clamp-2 leading-snug group-hover:text-[#0284C7] transition-colors duration-300 flex-1">
                          {item.title}
                        </h2>

                        <p className="text-[13px] text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                          {item.content.replace(/<[^>]+>/g, '')}
                        </p>

                        <div className="flex items-center justify-between text-[12px] text-[#94A3B8] pt-3 border-t border-[#E2E8F0]/60">
                          <span>
                            {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeIcon />
                            {item.viewCount}
                          </span>
                        </div>
                      </div>

                      {/* Hover border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#0284C7]/15 transition-colors duration-300 pointer-events-none" />
                    </motion.article>
                  </Link>
                </motion.div>
              );
            })}

            {/* Loading skeletons (append) */}
            {loading && newsList.length > 0 && Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={`sk-${i}`} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial skeleton */}
      {loading && newsList.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}
