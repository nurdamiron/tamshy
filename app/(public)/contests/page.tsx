'use client';

import { useState, useRef } from 'react';
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Contest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  statusLabel: string;
  deadline: string;
  typeBadge: string;
  fullDescription: string;
  documents: { name: string; format: string; size: string }[];
  fields: FormFieldDef[];
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
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const regionOptions = [
  { value: '', label: 'Выберите регион...' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'astana', label: 'Астана' },
  { value: 'shymkent', label: 'Шымкент' },
  { value: 'kyzylorda', label: 'Кызылординская обл.' },
  { value: 'turkestan', label: 'Туркестанская обл.' },
  { value: 'mangystau', label: 'Мангистауская обл.' },
  { value: 'aktobe', label: 'Актюбинская обл.' },
  { value: 'karaganda', label: 'Карагандинская обл.' },
  { value: 'pavlodar', label: 'Павлодарская обл.' },
  { value: 'other', label: 'Другой' },
];

const sharedFields: FormFieldDef[] = [
  { name: 'fullName', label: 'ФИО Участника', type: 'text', placeholder: 'Иванов Иван Иванович', required: true },
  { name: 'birthDate', label: 'Дата рождения', type: 'date', required: true },
  { name: 'email', label: 'Email для связи', type: 'email', placeholder: 'example@mail.kz', required: true },
  { name: 'phone', label: 'Номер телефона', type: 'tel', placeholder: '+7 (7XX) XXX-XX-XX', required: true },
  {
    name: 'institution',
    label: 'Учебное заведение / Город',
    type: 'select',
    options: regionOptions,
    required: true,
  },
];

const contests: Contest[] = [
  {
    id: '2026-VC-01',
    title: 'Конкурс видеороликов «Вода — это жизнь»',
    description: 'Для школьников 5-9 классов. Создай креативное видео о важности воды.',
    status: 'active',
    statusLabel: 'Прием заявок',
    deadline: 'до 15.05',
    typeBadge: 'ВИДЕОКОНКУРС',
    fullDescription:
      'Приглашаем учащихся 5-9 классов принять участие в конкурсе видеороликов, посвящённых теме водосбережения. Ролик должен быть не длиннее 3 минут, содержать оригинальный сценарий и демонстрировать осведомлённость о водных проблемах Казахстана. Допускается работа в команде до 3 человек. Жюри оценивает креативность, информативность и качество подачи материала.',
    documents: [
      { name: 'Положение о конкурсе', format: 'PDF', size: '1.2 MB' },
      { name: 'Шаблон согласия родителей', format: 'DOCX', size: '45 KB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2026-ES-02',
    title: 'Эссе «Мой вклад в спасение Арала»',
    description: 'Конкурс творческих работ для студентов колледжей и вузов.',
    status: 'active',
    statusLabel: 'Прием заявок',
    deadline: 'до 20.05',
    typeBadge: 'ЭССЕ',
    fullDescription:
      'Конкурс эссе для студентов колледжей и вузов Казахстана. Работа объёмом 800-1500 слов должна раскрывать личный опыт или видение участника по теме сохранения Аральского моря. Принимаются работы на казахском и русском языках. Лучшие эссе будут опубликованы в сборнике и на платформе Tamshy.kz.',
    documents: [
      { name: 'Положение о конкурсе', format: 'PDF', size: '980 KB' },
      { name: 'Пример оформления эссе', format: 'PDF', size: '320 KB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2026-PH-03',
    title: 'Фотоконкурс «Живая вода»',
    description: 'Лучшие фотографии природы родного края.',
    status: 'completed',
    statusLabel: 'Завершен',
    deadline: '10.03.2026',
    typeBadge: 'ФОТОКОНКУРС',
    fullDescription:
      'Фотоконкурс был посвящён красоте водных ресурсов Казахстана. Участники представили снимки рек, озёр и природных источников. Победители получили ценные призы и сертификаты. Всего было подано 247 заявок из 14 регионов.',
    documents: [
      { name: 'Итоги конкурса', format: 'PDF', size: '2.1 MB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2025-DR-04',
    title: 'Конкурс рисунков «Капля надежды»',
    description: 'Для детей 6-12 лет. Нарисуй мир, где воды хватит всем.',
    status: 'completed',
    statusLabel: 'Завершен',
    deadline: '15.12.2025',
    typeBadge: 'АРТ-КОНКУРС',
    fullDescription:
      'Конкурс детских рисунков для учащихся начальных и средних классов. Тема — будущее, где чистая вода доступна каждому. Принимались работы в любой технике: акварель, гуашь, цифровой рисунок. Победители были награждены на церемонии в Астане.',
    documents: [
      { name: 'Итоги конкурса', format: 'PDF', size: '1.8 MB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2025-RES-05',
    title: 'Исследование «Водный след моей школы»',
    description: 'Проведи исследование водопотребления в своей школе.',
    status: 'completed',
    statusLabel: 'Завершен',
    deadline: '01.11.2025',
    typeBadge: 'ИССЛЕДОВАНИЕ',
    fullDescription:
      'Участники провели замеры водопотребления в своих учебных заведениях, составили отчёт и предложили меры по экономии воды. Лучшие исследования были представлены на национальной конференции по водосбережению.',
    documents: [
      { name: 'Итоги конкурса', format: 'PDF', size: '1.5 MB' },
      { name: 'Сборник лучших работ', format: 'PDF', size: '4.7 MB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2025-INV-06',
    title: 'Хакатон «Вода и технологии»',
    description: 'Создай технологическое решение для экономии воды.',
    status: 'completed',
    statusLabel: 'Завершен',
    deadline: '20.09.2025',
    typeBadge: 'ХАКАТОН',
    fullDescription:
      'Двухдневный хакатон, на котором команды из 3-5 человек разрабатывали прототипы технологических решений для мониторинга и экономии воды. Победители получили гранты на реализацию своих проектов.',
    documents: [
      { name: 'Итоги хакатона', format: 'PDF', size: '3.2 MB' },
    ],
    fields: sharedFields,
  },
  {
    id: '2025-PO-07',
    title: 'Поэтический конкурс «Голос воды»',
    description: 'Напиши стихотворение о воде на казахском или русском языке.',
    status: 'completed',
    statusLabel: 'Завершен',
    deadline: '05.08.2025',
    typeBadge: 'ЛИТЕРАТУРА',
    fullDescription:
      'Поэтический конкурс для всех возрастов. Принимались стихотворения на казахском и русском языках объёмом до 40 строк. Жюри оценивало художественную ценность, оригинальность и раскрытие темы водосбережения.',
    documents: [
      { name: 'Сборник стихов', format: 'PDF', size: '2.4 MB' },
    ],
    fields: sharedFields,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const activeContests = contests.filter((c) => c.status === 'active');
const archivedContests = contests.filter((c) => c.status === 'completed');

const typeBadgeColor: Record<string, string> = {
  ВИДЕОКОНКУРС: 'bg-blue-50 text-blue-700',
  ЭССЕ: 'bg-indigo-50 text-indigo-700',
  ФОТОКОНКУРС: 'bg-emerald-50 text-emerald-700',
  'АРТ-КОНКУРС': 'bg-pink-50 text-pink-700',
  ИССЛЕДОВАНИЕ: 'bg-amber-50 text-amber-700',
  ХАКАТОН: 'bg-violet-50 text-violet-700',
  ЛИТЕРАТУРА: 'bg-rose-50 text-rose-700',
};

const deadlineDisplay = (c: Contest) => {
  if (c.status === 'active') return `ДЕДЛАЙН ${c.deadline.replace('до ', '')}`;
  return c.deadline;
};

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
  const [tab, setTab] = useState<'active' | 'archive'>('active');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(activeContests[0]?.id ?? '');
  const [mobileDetail, setMobileDetail] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const list = tab === 'active' ? activeContests : archivedContests;
  const filtered = list.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = contests.find((c) => c.id === selectedId) ?? contests[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSubmitted(false);
    setFormValues({});
    setFile(null);
    setConsent(false);
    setMobileDetail(true);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
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
          Активные ({activeContests.length})
          {tab === 'active' && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0284C7]"
            />
          )}
        </button>
        <button
          onClick={() => { setTab('archive'); setSearch(''); }}
          className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
            tab === 'archive' ? 'text-[#0284C7]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Архив ({archivedContests.length})
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
            placeholder="Найти конкурс..."
            className="w-full h-[40px] pl-10 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] bg-white placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-colors"
          />
        </div>
      </div>

      {/* Contest cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
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
                    c.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {c.statusLabel}
                </span>
                <span className="text-[11px] text-[#64748B] ml-auto flex items-center gap-1">
                  <HugeiconsIcon icon={Calendar01Icon} size={12} />
                  {c.deadline}
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

        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#64748B] text-[14px]">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );

  /* ---- Right Panel (detail) ---- */
  const renderDetail = () => (
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
          Назад к списку
        </button>

        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${typeBadgeColor[selected.typeBadge] ?? 'bg-gray-100 text-gray-700'}`}>
            {selected.typeBadge}
          </span>
          <span className="text-[12px] text-[#64748B] font-medium">
            ID: {selected.id}
          </span>
          <span className={`ml-auto text-[12px] font-semibold flex items-center gap-1 ${selected.status === 'active' ? 'text-red-500' : 'text-[#64748B]'}`}>
            <HugeiconsIcon icon={Calendar01Icon} size={13} />
            {deadlineDisplay(selected)}
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
            <h2 className="text-[16px] font-semibold text-[#0F172A]">Описание и условия</h2>
          </div>
          <p className="text-[14px] text-[#334155] leading-relaxed pl-3">
            {selected.fullDescription}
          </p>
        </div>

        {/* Documents */}
        <div className="flex flex-wrap gap-3 mb-8">
          {selected.documents.map((doc) => (
            <button
              key={doc.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                <HugeiconsIcon icon={File01Icon} size={18} className="text-[#0284C7]" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                  {doc.name}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {doc.format} · {doc.size}
                </p>
              </div>
              <HugeiconsIcon icon={Download01Icon} size={16} className="text-[#64748B] ml-2 group-hover:text-[#0284C7] transition-colors" />
            </button>
          ))}
        </div>

        {/* Submission form — only for active contests */}
        {selected.status === 'active' && !submitted && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                <HugeiconsIcon icon={AirplaneTakeOff01Icon} size={18} className="text-[#0284C7]" />
              </div>
              <h2 className="text-[16px] font-semibold text-[#0F172A]">Подача заявки</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selected.fields.map((f) =>
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
                  Конкурсная работа*
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
                        Нажмите, чтобы загрузить конкурсную работу
                      </p>
                      <p className="text-[12px] text-[#64748B] mt-1">
                        Макс. размер: 50 МБ. Форматы: MP4, AVI, MOV
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
                  Я даю согласие на обработку персональных данных в соответствии с политикой конфиденциальности
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                loading={submitting}
                disabled={!consent}
                className="w-full sm:w-auto"
              >
                Отправить заявку
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
            <h3 className="text-[18px] font-semibold text-[#0F172A] mb-2">Заявка отправлена!</h3>
            <p className="text-[14px] text-[#64748B] max-w-md mx-auto">
              Спасибо за участие! Мы свяжемся с вами по указанному email в течение 5 рабочих дней.
            </p>
          </motion.div>
        )}

        {/* Completed contest notice */}
        {selected.status === 'completed' && (
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
            <p className="text-[14px] text-[#64748B]">
              Этот конкурс завершён. Приём заявок закрыт.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

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
          Конкурсы
        </h1>
        <p className="mt-1.5 text-[15px] text-[#64748B]">
          Участвуй в конкурсах по водосбережению и выиграй ценные призы
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
