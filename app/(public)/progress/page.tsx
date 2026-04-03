'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
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

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type Category = 'all' | 'news' | 'reports' | 'photos' | 'videos';

interface MaterialItem {
  id: number;
  type: Category;
  title: string;
  description?: string;
  date?: string;
  badge?: string;
  views?: number;
  photoCount?: number;
  subtitle?: string;
  size: 'large' | 'normal';
}

const TABS: { key: Category; label: string; icon: typeof News01Icon }[] = [
  { key: 'all', label: 'Все материалы', icon: GridViewIcon },
  { key: 'news', label: 'Новости', icon: News01Icon },
  { key: 'reports', label: 'Отчёты', icon: File01Icon },
  { key: 'photos', label: 'Фото', icon: Image01Icon },
  { key: 'videos', label: 'Видео', icon: Video01Icon },
];

const MATERIALS: MaterialItem[] = [
  {
    id: 1,
    type: 'news',
    size: 'large',
    badge: 'Новости',
    date: '28 апреля 2026',
    title: 'Завершен первый этап внедрения систем капельного орошения в пилотных школах',
    description:
      'В рамках проекта Тамшы успешно установлены системы капельного орошения в 15 школах трёх регионов Казахстана. Экономия воды составила 40% по сравнению с традиционными методами полива.',
  },
  {
    id: 2,
    type: 'reports',
    size: 'normal',
    date: '15.04.2026',
    title: 'Отчёт по мониторингу потребления воды',
    description: 'Результаты замеров за 1 квартал 2026 года.',
  },
  {
    id: 3,
    type: 'videos',
    size: 'normal',
    badge: 'Видео',
    title: "Вебинар: 'Водные ресурсы будущего'",
  },
  {
    id: 4,
    type: 'photos',
    size: 'normal',
    badge: 'Фото',
    title: 'Фотоотчет: Эко-субботник',
    subtitle: 'Очистка береговой линии.',
    photoCount: 12,
  },
  {
    id: 5,
    type: 'news',
    size: 'normal',
    badge: 'Новости',
    date: '10.04.2026',
    title: 'Запуск конкурса экологических плакатов',
    description:
      'Школьники со всех регионов могут принять участие в конкурсе плакатов на тему бережного отношения к водным ресурсам.',
    views: 142,
  },
];

const TIMELINE = [
  {
    period: 'Январь 2026',
    title: 'Запуск проекта',
    status: 'done' as const,
    label: 'Выполнено',
  },
  {
    period: 'Февраль-Март 2026',
    title: 'Разработка материалов',
    status: 'done' as const,
    label: 'Выполнено',
  },
  {
    period: 'Апрель-Май 2026',
    title: 'Образовательная кампания',
    status: 'active' as const,
    label: 'В процессе',
  },
  {
    period: 'Июнь 2026',
    title: 'Подведение итогов',
    status: 'upcoming' as const,
    label: '',
  },
];

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

function LargeNewsCard({ item }: { item: MaterialItem }) {
  return (
    <motion.article variants={itemVariants} className="col-span-full">
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60">
        <GradientPlaceholder className="h-52 sm:h-64 flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <HugeiconsIcon icon={DropletIcon} size={28} className="text-white/80" />
            </div>
          </div>
        </GradientPlaceholder>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge>{item.badge}</Badge>
            <span className="text-[13px] text-[#64748B]">{item.date}</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#0F172A] leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-[14px] text-[#64748B] leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>
          <button className="text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors cursor-pointer">
            Читать далее &rarr;
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ReportCard({ item }: { item: MaterialItem }) {
  return (
    <motion.article variants={itemVariants}>
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col">
        <div className="flex items-center gap-2 text-[13px] text-[#64748B] mb-3">
          <HugeiconsIcon icon={Clock01Icon} size={15} className="text-[#94A3B8]" />
          <span>{item.date}</span>
        </div>
        <h3 className="text-[16px] font-semibold text-[#0F172A] leading-snug mb-2">
          {item.title}
        </h3>
        <p className="text-[14px] text-[#64748B] leading-relaxed mb-4 flex-1">
          {item.description}
        </p>
        <button className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#3B82F6] bg-[#3B82F6]/8 hover:bg-[#3B82F6]/15 rounded-lg px-4 py-2 transition-colors cursor-pointer w-fit">
          <HugeiconsIcon icon={Download01Icon} size={15} />
          Скачать (PDF)
        </button>
      </div>
    </motion.article>
  );
}

function VideoCard({ item }: { item: MaterialItem }) {
  return (
    <motion.article variants={itemVariants}>
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col">
        <GradientPlaceholder className="h-40 flex items-center justify-center">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
              <HugeiconsIcon icon={PlayIcon} size={28} className="text-white ml-0.5" />
            </div>
          </div>
        </GradientPlaceholder>
        <div className="p-5 flex-1 flex flex-col">
          <Badge>{item.badge}</Badge>
          <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug mt-3">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}

function PhotoCard({ item }: { item: MaterialItem }) {
  return (
    <motion.article variants={itemVariants}>
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col">
        <GradientPlaceholder className="h-36 flex items-end justify-end p-3">
          <div className="relative z-10 inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <HugeiconsIcon icon={Camera01Icon} size={14} className="text-white/90" />
            <span className="text-[12px] font-medium text-white/90">
              {item.photoCount} фото
            </span>
          </div>
        </GradientPlaceholder>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug">
            {item.title}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1">{item.subtitle}</p>
        </div>
      </div>
    </motion.article>
  );
}

function SmallNewsCard({ item }: { item: MaterialItem }) {
  return (
    <motion.article variants={itemVariants}>
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-[#93C5FD]/60 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <Badge>{item.badge}</Badge>
          <span className="text-[12px] text-[#64748B]">{item.date}</span>
        </div>
        <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug mb-2">
          {item.title}
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-4 flex-1 line-clamp-2">
          {item.description}
        </p>
        <span className="text-[12px] text-[#94A3B8]">{item.views} просмотра</span>
      </div>
    </motion.article>
  );
}

function MaterialCard({ item }: { item: MaterialItem }) {
  if (item.type === 'news' && item.size === 'large') return <LargeNewsCard item={item} />;
  if (item.type === 'reports') return <ReportCard item={item} />;
  if (item.type === 'videos') return <VideoCard item={item} />;
  if (item.type === 'photos') return <PhotoCard item={item} />;
  return <SmallNewsCard item={item} />;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');

  const filtered = MATERIALS.filter((m) => {
    const matchesTab = activeTab === 'all' || m.type === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
                Ход реализации
              </h1>
              <p className="mt-2 text-[15px] text-[#64748B] max-w-xl">
                Последние события, отчёты и медиаматериалы проекта.
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
                placeholder="Поиск по материалам..."
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
            {TABS.map((tab) => {
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
                  {tab.label}
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {filtered.length > 0 ? (
                  filtered.map((item) => <MaterialCard key={item.id} item={item} />)
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full text-center py-16"
                  >
                    <p className="text-[16px] text-[#64748B]">
                      Материалы не найдены
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ---- Pagination ---- */}
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

              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all cursor-pointer
                    ${
                      currentPage === p
                        ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                        : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#93C5FD] hover:text-[#3B82F6]'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                className="w-9 h-9 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-[#93C5FD] hover:text-[#3B82F6] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage === 3}
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </motion.div>
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
                Этапы проекта
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E2E8F0]" />

                <div className="space-y-5">
                  {TIMELINE.map((step, i) => (
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
                          {step.period}
                        </p>
                        <p className="text-[14px] font-medium text-[#0F172A] mt-0.5">
                          {step.title}
                        </p>
                        {step.label && (
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
                              {step.label}
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
                Подписка на новости
              </h3>
              <p className="text-[13px] text-[#64748B] mb-4">
                Получайте уведомления о новых материалах проекта.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all"
                  />
                </div>
                <button className="h-10 w-10 shrink-0 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors cursor-pointer shadow-md shadow-[#3B82F6]/20">
                  <HugeiconsIcon icon={MailSend01Icon} size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
