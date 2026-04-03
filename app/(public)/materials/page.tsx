'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FileFormat = 'PDF' | 'PPT' | 'DOCX' | 'MP4' | 'XLS';

interface Material {
  id: number;
  title: string;
  description: string;
  format: FileFormat;
  fileUrl: string;
  fileSize: string;
  downloads: number;
  views?: number;
  type: string;
  audience: string;
  year: number;
  featured?: boolean;
}

interface MaterialsResponse {
  materials: Material[];
  total: number;
  pages: number;
  page: number;
}

const FORMAT_META: Record<string, { color: string; bg: string; label: string }> = {
  PDF:  { color: '#EF4444', bg: '#FEF2F2', label: 'PDF' },
  PPT:  { color: '#F97316', bg: '#FFF7ED', label: 'PPT' },
  DOCX: { color: '#3B82F6', bg: '#EFF6FF', label: 'DOCX' },
  MP4:  { color: '#8B5CF6', bg: '#F5F3FF', label: 'MP4' },
  XLS:  { color: '#22C55E', bg: '#F0FDF4', label: 'XLS' },
};

const MATERIAL_TYPES = [
  { value: 'methodical', label: 'Методические пособия' },
  { value: 'booklets', label: 'Информационные буклеты' },
  { value: 'presentations', label: 'Презентации' },
  { value: 'video', label: 'Видеоуроки' },
];

const AUDIENCES = [
  { value: 'schoolchildren', label: 'Для школьников' },
  { value: 'students', label: 'Для студентов' },
  { value: 'teachers', label: 'Для педагогов' },
];

const YEARS = [
  { value: 'all', label: 'Все годы' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
];

const SORT_OPTIONS = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'popular', label: 'По популярности' },
  { value: 'alpha', label: 'По алфавиту' },
];

const ITEMS_PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pluralizeMaterials(n: number): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs >= 11 && abs <= 19) return 'материалов';
  if (lastDigit === 1) return 'материал';
  if (lastDigit >= 2 && lastDigit <= 4) return 'материала';
  return 'материалов';
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function DownloadIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FilterIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
      <rect x="4" y="4" width="48" height="68" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
      <rect x="12" y="16" width="32" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
      <rect x="12" y="24" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.35" />
      <rect x="12" y="32" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.35" />
      <rect x="12" y="44" width="32" height="20" rx="2" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkbox component                                                 */
/* ------------------------------------------------------------------ */

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <div
        className={`
          w-[18px] h-[18px] rounded flex items-center justify-center border transition-all duration-200 shrink-0
          ${checked
            ? 'bg-[#3B82F6] border-[#3B82F6]'
            : 'border-[#CBD5E1] group-hover:border-[#94A3B8]'
          }
        `}
        onClick={(e) => { e.preventDefault(); onChange(); }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-[14px] text-[#334155] select-none">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Format badge component                                             */
/* ------------------------------------------------------------------ */

function FormatBadge({ format }: { format: string }) {
  const meta = FORMAT_META[format.toUpperCase()] ?? { color: '#64748B', bg: '#F1F5F9', label: format };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function MaterialCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-5 pb-0 flex items-start justify-between">
        <div className="h-5 w-14 rounded bg-[#E2E8F0]" />
        <div className="h-4 w-12 rounded bg-[#E2E8F0]" />
      </div>
      <div className="p-5 pt-3 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-[#E2E8F0]" />
        <div className="h-3 w-full rounded bg-[#E2E8F0]" />
        <div className="h-3 w-2/3 rounded bg-[#E2E8F0]" />
      </div>
      <div className="px-5 pb-5 pt-0">
        <div className="h-px bg-[#E2E8F0] mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
          <div className="h-8 w-20 rounded-lg bg-[#E2E8F0]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Material card                                                      */
/* ------------------------------------------------------------------ */

function MaterialCard({ material, index, onDownload }: { material: Material; index: number; onDownload: (m: Material) => void }) {
  const isVideo = material.format.toUpperCase() === 'MP4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.07, 0.35), duration: 0.4 }}
      className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#93C5FD]/60 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 pb-0 flex items-start justify-between">
        <FormatBadge format={material.format} />
        <span className="text-[12px] text-[#94A3B8] font-medium">{material.fileSize}</span>
      </div>

      {/* Body */}
      <div className="p-5 pt-3 flex-1">
        <h3 className="text-[15px] font-semibold text-[#0F172A] leading-snug mb-2 line-clamp-2">
          {material.title}
        </h3>
        <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
          {material.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-0">
        <div className="h-px bg-[#E2E8F0] mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
            {isVideo ? (
              <>
                <EyeIcon className="text-[#94A3B8]" />
                <span>{material.views ?? 0} просмотров</span>
              </>
            ) : (
              <>
                <DownloadIcon className="text-[#94A3B8]" />
                <span>{material.downloads} скачиваний</span>
              </>
            )}
          </div>
          <button
            onClick={() => onDownload(material)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold
              transition-all duration-200 cursor-pointer
              ${isVideo
                ? 'bg-[#F5F3FF] text-[#8B5CF6] hover:bg-[#EDE9FE]'
                : 'bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#DBEAFE]'
              }
            `}
          >
            {isVideo ? (
              <>
                <PlayIcon />
                Смотреть
              </>
            ) : (
              <>
                <DownloadIcon />
                Скачать
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [sort, setSort] = useState('new');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [featuredMaterial, setFeaturedMaterial] = useState<Material | null>(null);

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const toggleAudience = (value: string) => {
    setSelectedAudiences((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  // Fetch materials from API
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','));
      if (selectedAudiences.length > 0) params.set('audience', selectedAudiences.join(','));
      if (selectedYear !== 'all') params.set('year', selectedYear);
      if (search.trim()) params.set('search', search.trim());
      params.set('sort', sort);
      params.set('page', String(currentPage));

      const res = await fetch(`/api/materials?${params.toString()}`);
      const data: MaterialsResponse = await res.json();

      setMaterials(data.materials ?? []);
      setTotalMaterials(data.total ?? 0);
      setTotalPages(data.pages ?? 1);

      // Find featured material from first load
      if (!featuredMaterial) {
        const feat = (data.materials ?? []).find((m) => m.featured);
        if (feat) setFeaturedMaterial(feat);
      }
    } catch {
      setMaterials([]);
      setTotalMaterials(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTypes, selectedAudiences, selectedYear, sort, currentPage, featuredMaterial]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Handle download click
  const handleDownload = async (material: Material) => {
    try {
      // Track download
      await fetch(`/api/materials/${material.id}/download`, { method: 'POST' });
    } catch {
      // Tracking failed silently
    }
    // Open the file
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    }
  };

  const activeFilterCount = selectedTypes.length + selectedAudiences.length + (selectedYear !== 'all' ? 1 : 0);

  /* Sidebar content (shared between desktop and mobile) */
  const sidebarContent = (
    <>
      {/* Search */}
      <div className="mb-6">
        <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3">Поиск материалов</h3>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Название или ключевые слова"
            className="w-full h-[42px] pl-10 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] bg-white placeholder:text-[#94A3B8] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Type */}
      <div className="mb-6">
        <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
          Тип материала
        </h4>
        <div className="space-y-0.5">
          {MATERIAL_TYPES.map((t) => (
            <Checkbox
              key={t.value}
              checked={selectedTypes.includes(t.value)}
              onChange={() => toggleType(t.value)}
              label={t.label}
            />
          ))}
        </div>
      </div>

      {/* Audience */}
      <div className="mb-6">
        <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
          Целевая аудитория
        </h4>
        <div className="space-y-0.5">
          {AUDIENCES.map((a) => (
            <Checkbox
              key={a.value}
              checked={selectedAudiences.includes(a.value)}
              onChange={() => toggleAudience(a.value)}
              label={a.label}
            />
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
          Год публикации
        </h4>
        <select
          value={selectedYear}
          onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
          className="w-full h-[42px] px-3 rounded-lg border border-[#E2E8F0] text-[14px] bg-white transition-colors duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
        >
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>{y.label}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[32px] font-bold tracking-tight text-[#0F172A]"
          >
            Библиотека знаний
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-1 text-[15px] text-[#64748B]"
          >
            ({totalMaterials} {pluralizeMaterials(totalMaterials)})
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden inline-flex items-center gap-2 h-[42px] px-4 rounded-lg border border-[#E2E8F0] text-[14px] font-medium text-[#334155] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <FilterIcon />
            Фильтры
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
            className="h-[42px] px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[14px] bg-white transition-colors duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Mobile filters panel */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden mb-6"
          >
            <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: sidebar + content */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="hidden lg:block w-[280px] shrink-0"
        >
          <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5 sticky top-24">
            {sidebarContent}
          </div>
        </motion.aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Featured banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-[#059669] via-[#0D9488] to-[#0284C7] p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold mb-3">
                  Рекомендуем
                </span>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-white leading-snug mb-2">
                  {featuredMaterial ? featuredMaterial.title : 'Методическое пособие «Водный след»'}
                </h2>
                <p className="text-[14px] text-white/80 leading-relaxed mb-4 max-w-lg">
                  {featuredMaterial
                    ? featuredMaterial.description
                    : 'Полное руководство для педагогов по проведению интерактивных занятий на тему водного следа продуктов и услуг.'}
                </p>
                <button
                  onClick={() => {
                    if (featuredMaterial) handleDownload(featuredMaterial);
                  }}
                  className="inline-flex items-center gap-2 h-[42px] px-5 rounded-xl bg-white text-[#059669] text-[14px] font-semibold hover:bg-white/90 transition-colors cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                >
                  <DownloadIcon />
                  Скачать бесплатно ({featuredMaterial ? featuredMaterial.format.toUpperCase() : 'PDF'})
                </button>
              </div>
              <div className="hidden sm:flex items-center justify-center w-[100px] shrink-0 opacity-80">
                <BookIcon />
              </div>
            </div>
          </motion.div>

          {/* Materials grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <MaterialCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {materials.map((material, i) => (
                <MaterialCard key={material.id} material={material} index={i} onDownload={handleDownload} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="mx-auto mb-4 text-[#E2E8F0]" />
              <p className="text-[16px] text-[#64748B]">Материалы не найдены</p>
              <p className="text-[13px] text-[#64748B]/60 mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mt-10"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-[36px] h-[36px] rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeftIcon />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    w-[36px] h-[36px] rounded-lg text-[14px] font-medium transition-all duration-200 cursor-pointer
                    ${currentPage === i + 1
                      ? 'bg-[#3B82F6] text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                      : 'border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-[36px] h-[36px] rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRightIcon />
              </button>

              <span className="ml-3 text-[13px] text-[#94A3B8]">
                Стр. {currentPage} из {totalPages}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
