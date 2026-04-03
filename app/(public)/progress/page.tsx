'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations, useLocale } from 'next-intl';
import {
  News01Icon,
  File01Icon,
  Image01Icon,
  Video01Icon,
  Search01Icon,
  Mail01Icon,
  MailSend01Icon,
  Clock01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Download01Icon,
  PlayIcon,
  Camera01Icon,
  CheckmarkBadge01Icon,
  DropletIcon,
  GridViewIcon,
} from '@hugeicons/core-free-icons';
import Modal from '@/components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = 'all' | 'news' | 'reports' | 'photos' | 'videos';

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

interface NewsResponse {
  news: NewsItem[];
  total: number;
  pages: number;
  page: number;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const TAB_KEYS: { key: Category; labelKey: string; icon: typeof News01Icon }[] = [
  { key: 'all', labelKey: 'tabAll', icon: GridViewIcon },
  { key: 'news', labelKey: 'tabNews', icon: News01Icon },
  { key: 'reports', labelKey: 'tabReports', icon: File01Icon },
  { key: 'photos', labelKey: 'tabPhotos', icon: Image01Icon },
  { key: 'videos', labelKey: 'tabVideos', icon: Video01Icon },
];

const TIMELINE_KEYS = [
  {
    periodKey: 'timelinePeriod1',
    titleKey: 'timelineStep1',
    status: 'done' as const,
    labelKey: 'done',
  },
  {
    periodKey: 'timelinePeriod2',
    titleKey: 'timelineStep2',
    status: 'done' as const,
    labelKey: 'done',
  },
  {
    periodKey: 'timelinePeriod3',
    titleKey: 'timelineStep3',
    status: 'active' as const,
    labelKey: 'inProgress',
  },
  {
    periodKey: 'timelinePeriod4',
    titleKey: 'timelineStep4',
    status: 'upcoming' as const,
    labelKey: '',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatDateLong(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function mapCategory(cat: string): Category {
  const lower = cat.toLowerCase();
  if (lower === 'news') return 'news';
  if (lower === 'report') return 'reports';
  if (lower === 'photo') return 'photos';
  if (lower === 'video') return 'videos';
  return 'news';
}

const CATEGORY_BADGE_KEYS: Record<string, string> = {
  news: 'badgeNews',
  report: 'badgeReports',
  photo: 'badgePhotos',
  video: 'badgeVideos',
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sidebarVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 animate-pulse">
      <div className="h-4 w-20 rounded bg-[#E2E8F0] mb-3" />
      <div className="h-5 w-3/4 rounded bg-[#E2E8F0] mb-2" />
      <div className="h-3 w-full rounded bg-[#E2E8F0] mb-1" />
      <div className="h-3 w-2/3 rounded bg-[#E2E8F0]" />
    </div>
  );
}

function LargeCardSkeleton() {
  return (
    <div className="col-span-full bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden animate-pulse">
      <div className="h-52 sm:h-64 bg-[#E2E8F0]" />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="h-4 w-32 rounded bg-[#E2E8F0]" />
        <div className="h-5 w-3/4 rounded bg-[#E2E8F0]" />
        <div className="h-3 w-full rounded bg-[#E2E8F0]" />
        <div className="h-3 w-2/3 rounded bg-[#E2E8F0]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GradientPlaceholder({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0284C7] via-[#38BDF8] to-[#7DD3FC] ${className}`}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {children}
    </div>
  );
}

function Badge({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'orange';
}) {
  const colors = {
    blue: 'bg-[#3B82F6]/10 text-[#3B82F6]',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

/* ---- Cards ----- */

function LargeNewsCard({
  item,
  t,
  locale,
  onOpen,
}: {
  item: NewsItem;
  t: (key: string) => string;
  locale: string;
  onOpen: () => void;
}) {
  return (
    <motion.article variants={itemVariants} className="col-span-full">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 cursor-pointer text-left w-full"
      >
        {item.imageUrl ? (
          <div className="h-52 sm:h-64 overflow-hidden">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <GradientPlaceholder className="h-52 sm:h-64 flex items-center justify-center">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <HugeiconsIcon icon={DropletIcon} size={28} className="text-white/80" />
              </div>
            </div>
          </GradientPlaceholder>
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge>{t(CATEGORY_BADGE_KEYS[item.category.toLowerCase()] ?? 'badgeNews')}</Badge>
            <span className="text-[13px] text-[#64748B]">{formatDateLong(item.createdAt, locale)}</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#0F172A] leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-[14px] text-[#64748B] leading-relaxed mb-4 line-clamp-3">
            {item.content}
          </p>
          <span className="text-[14px] font-medium text-[#3B82F6]">
            {t('readMore')} &rarr;
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function ReportCard({ item, t, onOpen }: { item: NewsItem; t: (key: string) => string; onOpen: () => void }) {
  return (
    <motion.article variants={itemVariants}>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col cursor-pointer text-left w-full"
      >
        {item.imageUrl ? (
          <div className="h-36 w-full overflow-hidden shrink-0">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[13px] text-[#64748B] mb-3">
            <HugeiconsIcon icon={Clock01Icon} size={15} className="text-[#94A3B8]" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <h3 className="text-[16px] font-semibold text-[#0F172A] leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-[14px] text-[#64748B] leading-relaxed mb-4 flex-1 line-clamp-4">
            {item.content}
          </p>
          {item.fileUrl && (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#3B82F6] bg-[#3B82F6]/8 hover:bg-[#3B82F6]/15 rounded-lg px-4 py-2 transition-colors cursor-pointer w-fit"
            >
              <HugeiconsIcon icon={Download01Icon} size={15} />
              {t('downloadPdf')}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function VideoCard({ item, t, onOpen }: { item: NewsItem; t: (key: string) => string; onOpen: () => void }) {
  return (
    <motion.article variants={itemVariants}>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col cursor-pointer text-left w-full"
      >
        <div className="relative h-40 w-full overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <GradientPlaceholder className="h-full w-full flex items-center justify-center" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
              <HugeiconsIcon icon={PlayIcon} size={28} className="text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <Badge>{t(CATEGORY_BADGE_KEYS[item.category.toLowerCase()] ?? 'badgeNews')}</Badge>
          <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug mt-3">
            {item.title}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-2 line-clamp-2">{item.content}</p>
        </div>
      </div>
    </motion.article>
  );
}

function PhotoCard({ item, t, onOpen }: { item: NewsItem; t: (key: string) => string; onOpen: () => void }) {
  return (
    <motion.article variants={itemVariants}>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col cursor-pointer text-left w-full"
      >
        {item.imageUrl ? (
          <div className="relative h-36 overflow-hidden rounded-xl">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <HugeiconsIcon icon={Camera01Icon} size={14} className="text-white/90" />
              <span className="text-[12px] font-medium text-white/90">
                {item.photoCount ?? 0} {t('photos')}
              </span>
            </div>
          </div>
        ) : (
          <GradientPlaceholder className="h-36 flex items-end justify-end p-3">
            <div className="relative z-10 inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <HugeiconsIcon icon={Camera01Icon} size={14} className="text-white/90" />
              <span className="text-[12px] font-medium text-white/90">
                {item.photoCount ?? 0} {t('photos')}
              </span>
            </div>
          </GradientPlaceholder>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug">
            {item.title}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1 line-clamp-2">{item.content}</p>
        </div>
      </div>
    </motion.article>
  );
}

function SmallNewsCard({ item, t, onOpen }: { item: NewsItem; t: (key: string) => string; onOpen: () => void }) {
  return (
    <motion.article variants={itemVariants}>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col cursor-pointer text-left w-full"
      >
        {item.imageUrl ? (
          <div className="h-32 w-full overflow-hidden shrink-0">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Badge>{t(CATEGORY_BADGE_KEYS[item.category.toLowerCase()] ?? 'badgeNews')}</Badge>
            <span className="text-[12px] text-[#64748B]">{formatDate(item.createdAt)}</span>
          </div>
          <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-[13px] text-[#64748B] leading-relaxed mb-4 flex-1 line-clamp-3">
            {item.content}
          </p>
          <span className="text-[12px] text-[#94A3B8]">{item.viewCount} {t('viewsCount')}</span>
        </div>
      </div>
    </motion.article>
  );
}

function NewsCard({
  item,
  isFirst,
  t,
  locale,
  onOpen,
}: {
  item: NewsItem;
  isFirst: boolean;
  t: (key: string) => string;
  locale: string;
  onOpen: (item: NewsItem) => void;
}) {
  const category = mapCategory(item.category);
  const open = () => onOpen(item);
  if (isFirst && category === 'news') return <LargeNewsCard item={item} t={t} locale={locale} onOpen={open} />;
  if (category === 'reports') return <ReportCard item={item} t={t} onOpen={open} />;
  if (category === 'videos') return <VideoCard item={item} t={t} onOpen={open} />;
  if (category === 'photos') return <PhotoCard item={item} t={t} onOpen={open} />;
  return <SmallNewsCard item={item} t={t} onOpen={open} />;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ProgressPage() {
  const t = useTranslations('progress');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');

  // Data fetching state
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [detailItem, setDetailItem] = useState<NewsItem | null>(null);

  // Fetch news from API
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('category', activeTab);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('page', String(currentPage));

      const res = await fetch(`/api/news?${params.toString()}`);
      const data: NewsResponse = await res.json();

      setNewsItems(data.news ?? []);
      setTotalPages(data.pages ?? 1);
    } catch {
      setNewsItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Newsletter subscription
  const handleNewsletter = async () => {
    if (!email.trim()) return;
    setNewsletterLoading(true);
    setNewsletterError('');
    setNewsletterSuccess(false);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || t('subscribeError'));
      }

      setNewsletterSuccess(true);
      setEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errorGeneric');
      setNewsletterError(message);
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Modal
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.title}
        panelClassName="max-w-2xl"
      >
        {detailItem && (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-4 -mt-1">
              <Badge>{t(CATEGORY_BADGE_KEYS[detailItem.category.toLowerCase()] ?? 'badgeNews')}</Badge>
              <span className="text-[13px] text-[#64748B]">{formatDateLong(detailItem.createdAt, locale)}</span>
              <span className="text-[13px] text-[#94A3B8]">
                {detailItem.viewCount} {t('viewsCount')}
              </span>
            </div>
            {detailItem.imageUrl && (
              <div className="relative w-full rounded-xl overflow-hidden mb-5 bg-[#F1F5F9] max-h-[min(360px,50vh)]">
                <img
                  src={detailItem.imageUrl}
                  alt=""
                  className="w-full h-full object-cover object-center max-h-[min(360px,50vh)]"
                />
              </div>
            )}
            <div className="text-[15px] text-[#334155] leading-relaxed whitespace-pre-line">{detailItem.content}</div>
            {detailItem.fileUrl && (
              <a
                href={detailItem.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-[14px] font-semibold text-[#3B82F6] bg-[#3B82F6]/8 hover:bg-[#3B82F6]/15 rounded-lg px-4 py-2.5 transition-colors"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
                {t('downloadPdf')}
              </a>
            )}
          </>
        )}
      </Modal>

      {/* ---- Header ---- */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#0F172A]">
                {t('title')}
              </h1>
              <p className="mt-2 text-[15px] text-[#64748B] max-w-xl">
                {t('subtitle')}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all"
              />
            </div>
          </motion.div>

          {/* ---- Tabs ---- */}
          <motion.div
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {TAB_KEYS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer
                    ${
                      isActive
                        ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#93C5FD] hover:text-[#3B82F6]'
                    }`}
                >
                  <HugeiconsIcon icon={tab.icon} size={16} />
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---- Content + Sidebar ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <LargeCardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + searchQuery + currentPage}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                  {newsItems.length > 0 ? (
                    newsItems.map((item, index) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        isFirst={index === 0}
                        t={t}
                        locale={locale}
                        onOpen={setDetailItem}
                      />
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="col-span-full text-center py-16"
                    >
                      <p className="text-[16px] text-[#64748B]">
                        {t('noResults')}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* ---- Pagination ---- */}
            {totalPages > 1 && (
              <motion.div
                className="mt-8 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-[#93C5FD] hover:text-[#3B82F6] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all cursor-pointer
                      ${
                        currentPage === i + 1
                          ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                          : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#93C5FD] hover:text-[#3B82F6]'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-[#93C5FD] hover:text-[#3B82F6] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </button>
              </motion.div>
            )}
          </div>

          {/* ---- Sidebar ---- */}
          <motion.aside
            className="w-full lg:w-[320px] shrink-0 space-y-6"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Project timeline */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-5">
                {t('timelineTitle')}
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E2E8F0]" />

                <div className="space-y-5">
                  {TIMELINE_KEYS.map((step, i) => (
                    <motion.div
                      key={i}
                      className="relative flex gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {/* Dot */}
                      <div
                        className={`relative z-10 w-4 h-4 rounded-full border-[2.5px] mt-0.5 shrink-0
                          ${
                            step.status === 'done'
                              ? 'bg-[#3B82F6] border-[#3B82F6]'
                              : step.status === 'active'
                              ? 'bg-[#3B82F6] border-[#3B82F6] ring-4 ring-[#3B82F6]/15'
                              : 'bg-[#E2E8F0] border-[#CBD5E1]'
                          }`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
                          {t(step.periodKey)}
                        </p>
                        <p className="text-[14px] font-medium text-[#0F172A] mt-0.5">
                          {t(step.titleKey)}
                        </p>
                        {step.labelKey && (
                          <span className="mt-1.5 inline-block">
                            <Badge
                              variant={
                                step.status === 'done'
                                  ? 'green'
                                  : step.status === 'active'
                                  ? 'orange'
                                  : 'blue'
                              }
                            >
                              {step.status === 'done' && (
                                <HugeiconsIcon
                                  icon={CheckmarkBadge01Icon}
                                  size={12}
                                  className="mr-1"
                                />
                              )}
                              {t(step.labelKey)}
                            </Badge>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter subscribe */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">
                {t('subscribeTitle')}
              </h3>
              <p className="text-[13px] text-[#64748B] mb-4">
                {t('subscribeDesc')}
              </p>

              {newsletterSuccess && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[13px] text-emerald-700">
                  {t('subscribeSuccess')}
                </div>
              )}
              {newsletterError && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
                  {newsletterError}
                </div>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder={t('subscribePlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all"
                  />
                </div>
                <button
                  onClick={handleNewsletter}
                  disabled={newsletterLoading || !email.trim()}
                  className="h-10 w-10 shrink-0 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors cursor-pointer shadow-md shadow-[#3B82F6]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={MailSend01Icon} size={18} />
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
