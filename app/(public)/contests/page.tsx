'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  File01Icon,
  Upload01Icon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  ArrowLeft01Icon,
  AirplaneTakeOff01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useTranslations } from 'next-intl';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContestDocument {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
}

interface Contest {
  id: string;
  title: string;
  type: string;
  description: string;
  rules: string;
  status: string;
  deadline: string;
  createdAt: string;
  documents: ContestDocument[];
  _count: { submissions: number };
}

interface FormFieldDef {
  name: string;
  label: string;
  type: 'text' | 'date' | 'email' | 'tel' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const REGION_OPTION_KEYS = [
  { value: '', labelKey: 'selectRegion' },
  { value: 'almaty', labelKey: 'regionAlmaty' },
  { value: 'astana', labelKey: 'regionAstana' },
  { value: 'shymkent', labelKey: 'regionShymkent' },
  { value: 'kyzylorda', labelKey: 'regionKyzylorda' },
  { value: 'turkestan', labelKey: 'regionTurkestan' },
  { value: 'mangystau', labelKey: 'regionMangystau' },
  { value: 'aktobe', labelKey: 'regionAktobe' },
  { value: 'karaganda', labelKey: 'regionKaraganda' },
  { value: 'pavlodar', labelKey: 'regionPavlodar' },
  { value: 'other', labelKey: 'regionOther' },
];

const SHARED_FIELD_KEYS = [
  { name: 'fullName', labelKey: 'fullName', type: 'text' as const, placeholderKey: 'fullNamePlaceholder', required: true },
  { name: 'birthDate', labelKey: 'birthDate', type: 'date' as const, required: true },
  { name: 'email', labelKey: 'emailField', type: 'email' as const, placeholderKey: 'emailPlaceholder', required: true },
  { name: 'phone', labelKey: 'phoneField', type: 'tel' as const, placeholderKey: 'phonePlaceholder', required: true },
  {
    name: 'institution',
    labelKey: 'institution',
    type: 'select' as const,
    required: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const typeBadgeColor: Record<string, string> = {
  ВИДЕОКОНКУРС: 'bg-blue-50 text-blue-700',
  ЭССЕ: 'bg-indigo-50 text-indigo-700',
  ФОТОКОНКУРС: 'bg-emerald-50 text-emerald-700',
  'АРТ-КОНКУРС': 'bg-pink-50 text-pink-700',
  ИССЛЕДОВАНИЕ: 'bg-amber-50 text-amber-700',
  ХАКАТОН: 'bg-violet-50 text-violet-700',
  ЛИТЕРАТУРА: 'bg-rose-50 text-rose-700',
};

function formatDeadline(deadline: string, status: string): string {
  if (status === 'ACTIVE') {
    const d = new Date(deadline);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `ДЕДЛАЙН ${day}.${month}`;
  }
  const d = new Date(deadline);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function shortDeadline(deadline: string, status: string): string {
  const d = new Date(deadline);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  if (status === 'ACTIVE') {
    return `до ${day}.${month}`;
  }
  return `${day}.${month}.${d.getFullYear()}`;
}

function formatFileSize(size: string): string {
  return size;
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function ContestListSkeleton() {
  return (
    <div className="px-3 pb-3 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse p-3.5 rounded-xl border border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-20 rounded-full bg-[#E2E8F0]" />
            <div className="h-4 w-16 rounded bg-[#E2E8F0] ml-auto" />
          </div>
          <div className="h-4 w-3/4 rounded bg-[#E2E8F0] mb-2" />
          <div className="h-3 w-full rounded bg-[#E2E8F0]" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const panelSlide = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContestsPage() {
  const t = useTranslations('contests');

  const regionOptions = REGION_OPTION_KEYS.map((r) => ({
    value: r.value,
    label: t(r.labelKey),
  }));

  const sharedFields: FormFieldDef[] = SHARED_FIELD_KEYS.map((f) => ({
    name: f.name,
    label: t(f.labelKey),
    type: f.type,
    placeholder: f.placeholderKey ? t(f.placeholderKey) : undefined,
    options: f.name === 'institution' ? regionOptions : undefined,
    required: f.required,
  }));

  const [tab, setTab] = useState<'active' | 'archive'>('active');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [mobileDetail, setMobileDetail] = useState(false);

  // Data fetching state
  const [activeContests, setActiveContests] = useState<Contest[]>([]);
  const [archivedContests, setArchivedContests] = useState<Contest[]>([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [archiveLoaded, setArchiveLoaded] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch active contests on mount
  useEffect(() => {
    setLoadingActive(true);
    fetch('/api/contests?status=ACTIVE')
      .then((res) => res.json())
      .then((data: Contest[]) => {
        setActiveContests(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      })
      .catch(() => {
        setActiveContests([]);
      })
      .finally(() => setLoadingActive(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch archive contests when archive tab is first opened
  const fetchArchive = useCallback(() => {
    if (archiveLoaded) return;
    setLoadingArchive(true);
    fetch('/api/contests?status=COMPLETED')
      .then((res) => res.json())
      .then((data: Contest[]) => {
        setArchivedContests(Array.isArray(data) ? data : []);
        setArchiveLoaded(true);
      })
      .catch(() => {
        setArchivedContests([]);
      })
      .finally(() => setLoadingArchive(false));
  }, [archiveLoaded]);

  const allContests = [...activeContests, ...archivedContests];
  const list = tab === 'active' ? activeContests : archivedContests;
  const isLoading = tab === 'active' ? loadingActive : loadingArchive;

  const filtered = list.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = allContests.find((c) => c.id === selectedId) ?? allContests[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSubmitted(false);
    setSubmitError('');
    setFormValues({});
    setFile(null);
    setConsent(false);
    setMobileDetail(true);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const body: Record<string, string> = { ...formValues };
      const res = await fetch(`/api/contests/${selected.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || t('errorSubmitting'));
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errorGeneric');
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  /* ---- Left Panel (list) ---- */
  const renderList = () => (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0]">
        <button
          onClick={() => { setTab('active'); setSearch(''); }}
          className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
            tab === 'active' ? 'text-[#0284C7]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {t('activeTab')} ({activeContests.length})
          {tab === 'active' && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0284C7]"
            />
          )}
        </button>
        <button
          onClick={() => { setTab('archive'); setSearch(''); fetchArchive(); }}
          className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
            tab === 'archive' ? 'text-[#0284C7]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {t('archiveTab')} ({archivedContests.length})
          {tab === 'archive' && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0284C7]"
            />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full h-[40px] pl-10 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] bg-white placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-colors"
          />
        </div>
      </div>

      {/* Contest cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {isLoading ? (
          <ContestListSkeleton />
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <motion.button
                key={c.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                onClick={() => handleSelect(c.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                  selectedId === c.id
                    ? 'border-[#0284C7] bg-[#E0F2FE]/40 shadow-[0_0_0_1px_#0284C7]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#93C5FD]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      c.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.status === 'ACTIVE' ? t('accepting') : t('completed')}
                  </span>
                  <span className="text-[11px] text-[#64748B] ml-auto flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar01Icon} size={12} />
                    {shortDeadline(c.deadline, c.status)}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] leading-snug mb-1">
                  {c.title}
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed line-clamp-2">
                  {c.description}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10 text-[#64748B] text-[14px]">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  );

  /* ---- Right Panel (detail) ---- */
  const renderDetail = () => {
    if (!selected) {
      return (
        <div className="h-full flex items-center justify-center text-[#64748B] text-[14px]">
          {t('selectContest')}
        </div>
      );
    }

    const typeBadge = (selected.type ?? '').toUpperCase();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id + (submitted ? '-done' : '')}
          variants={panelSlide}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full overflow-y-auto"
        >
          {/* Mobile back button */}
          <button
            onClick={() => setMobileDetail(false)}
            className="lg:hidden flex items-center gap-1.5 text-[#0284C7] text-[14px] font-medium mb-4 hover:underline"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            {t('backToList')}
          </button>

          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${typeBadgeColor[typeBadge] ?? 'bg-gray-100 text-gray-700'}`}>
              {typeBadge}
            </span>
            <span className="text-[12px] text-[#64748B] font-medium">
              ID: {selected.id}
            </span>
            <span className={`ml-auto text-[12px] font-semibold flex items-center gap-1 ${selected.status === 'ACTIVE' ? 'text-red-500' : 'text-[#64748B]'}`}>
              <HugeiconsIcon icon={Calendar01Icon} size={13} />
              {formatDeadline(selected.deadline, selected.status)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0F172A] leading-tight mb-6">
            {selected.title}
          </h1>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-[#0284C7]" />
              <h2 className="text-[16px] font-semibold text-[#0F172A]">{t('descriptionTitle')}</h2>
            </div>
            <p className="text-[14px] text-[#334155] leading-relaxed pl-3">
              {selected.rules || selected.description}
            </p>
          </div>

          {/* Documents */}
          {selected.documents && selected.documents.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {selected.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                    <HugeiconsIcon icon={File01Icon} size={18} className="text-[#0284C7]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      {doc.fileType?.toUpperCase()} · {formatFileSize(doc.fileSize)}
                    </p>
                  </div>
                  <HugeiconsIcon icon={Download01Icon} size={16} className="text-[#64748B] ml-2 group-hover:text-[#0284C7] transition-colors" />
                </a>
              ))}
            </div>
          )}

          {/* Submission form — only for active contests */}
          {selected.status === 'ACTIVE' && !submitted && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                  <HugeiconsIcon icon={AirplaneTakeOff01Icon} size={18} className="text-[#0284C7]" />
                </div>
                <h2 className="text-[16px] font-semibold text-[#0F172A]">{t('submitTitle')}</h2>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[14px] text-red-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sharedFields.map((f) =>
                    f.type === 'select' ? (
                      <Select
                        key={f.name}
                        label={f.label + (f.required ? '*' : '')}
                        options={f.options ?? []}
                        value={formValues[f.name] ?? ''}
                        onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      />
                    ) : (
                      <Input
                        key={f.name}
                        label={f.label + (f.required ? '*' : '')}
                        type={f.type}
                        placeholder={f.placeholder}
                        value={formValues[f.name] ?? ''}
                        onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      />
                    ),
                  )}
                </div>

                {/* File upload */}
                <div>
                  <label className="text-[13px] font-medium text-[#0F172A] block mb-1.5">
                    {t('uploadTitle')}*
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center cursor-pointer hover:border-[#0284C7]/40 hover:bg-[#E0F2FE]/20 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".mp4,.avi,.mov,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <HugeiconsIcon icon={Upload01Icon} size={28} className="text-[#64748B] mx-auto mb-2" />
                    {file ? (
                      <p className="text-[14px] text-[#0284C7] font-medium">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-[14px] text-[#0F172A] font-medium">
                          {t('uploadDesc')}
                        </p>
                        <p className="text-[12px] text-[#64748B] mt-1">
                          {t('uploadFormats')}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#E2E8F0] text-[#0284C7] focus:ring-[#0284C7]/30 accent-[#0284C7]"
                  />
                  <span className="text-[13px] text-[#64748B] leading-snug">
                    {t('consentText')}
                  </span>
                </label>

                {/* Submit */}
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!consent}
                  className="w-full sm:w-auto"
                >
                  {t('submitApplication')}
                </Button>
              </form>
            </>
          )}

          {/* Success state */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#0F172A] mb-2">{t('successTitle')}</h3>
              <p className="text-[14px] text-[#64748B] max-w-md mx-auto">
                {t('successDesc')}
              </p>
            </motion.div>
          )}

          {/* Completed contest notice */}
          {selected.status === 'COMPLETED' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
              <p className="text-[14px] text-[#64748B]">
                {t('contestCompleted')}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  /* ---- Layout ---- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#0F172A]">
          {t('pageTitle')}
        </h1>
        <p className="mt-1.5 text-[15px] text-[#64748B]">
          {t('pageSubtitle')}
        </p>
      </motion.div>

      {/* Desktop: split panel */}
      <div className="hidden lg:grid lg:grid-cols-[350px_1fr] gap-6 min-h-[calc(100vh-220px)]">
        {/* Left panel */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          {renderList()}
        </div>

        {/* Right panel */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-6 sm:p-8 overflow-hidden">
          {renderDetail()}
        </div>
      </div>

      {/* Mobile: list or detail */}
      <div className="lg:hidden">
        {!mobileDetail ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden min-h-[60vh]">
            {renderList()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-5 sm:p-6">
            {renderDetail()}
          </div>
        )}
      </div>
    </div>
  );
}
