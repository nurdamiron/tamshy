'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Megaphone01Icon,
  File01Icon,
  Medal01Icon,
  Settings01Icon,
  Download01Icon,
  ArrowRight01Icon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

/* ---------- animation helpers ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={0}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- data ---------- */

const NAV_ITEMS = [
  { id: 'goals', label: 'Цели и задачи' },
  { id: 'description', label: 'Описание инициативы' },
  { id: 'documents', label: 'Документы проекта' },
] as const;

const FEATURES = [
  {
    icon: Megaphone01Icon,
    title: 'Информирование',
    text: 'Повышение осведомлённости школьников и учителей о проблемах водных ресурсов Казахстана.',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    icon: File01Icon,
    title: 'Публикация',
    text: 'Платформа для размещения видеороликов, исследований, арт-проектов и изобретений.',
    color: '#3B82F6',
    bg: '#DBEAFE',
  },
  {
    icon: Medal01Icon,
    title: 'Конкурсы',
    text: 'Организация республиканских конкурсов водных проектов среди школьников.',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    icon: Settings01Icon,
    title: 'Администрирование',
    text: 'Удобные инструменты для управления проектами, оценки и голосования.',
    color: '#64748B',
    bg: '#F1F5F9',
  },
];

const DOCUMENTS = [
  {
    title: 'Положение о проекте',
    size: '2.4 MB',
    type: 'PDF',
  },
  {
    title: 'Презентация инициативы',
    size: '5.1 MB',
    type: 'PDF',
  },
];

/* ---------- component ---------- */

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('goals');

  /* track which section is in viewport */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-20% 0px -60% 0px' },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex gap-10">
        {/* ====== sidebar (lg only) ====== */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* navigation */}
            <div>
              <p className="text-caption text-[#64748B] mb-3">НАВИГАЦИЯ</p>
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`
                      text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200
                      ${
                        activeSection === id
                          ? 'bg-[#E0F2FE] text-[#0284C7]'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* questions card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-3">
                <HugeiconsIcon icon={HelpCircleIcon} size={20} className="text-[#0284C7]" />
              </div>
              <p className="text-[15px] font-semibold text-[#0F172A] mb-1">Есть вопросы?</p>
              <p className="text-[13px] text-[#64748B] mb-4">
                Свяжитесь с нами, и мы ответим на все ваши вопросы о проекте.
              </p>
              <Link
                href="/contacts"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0284C7] hover:text-[#0369A1] transition-colors"
              >
                Связаться
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>
        </aside>

        {/* ====== main content ====== */}
        <div className="flex-1 min-w-0">
          {/* page header */}
          <AnimatedSection>
            <div className="mb-10">
              <h1 className="text-[32px] font-bold tracking-tight text-[#0F172A]">О проекте</h1>
              <p className="mt-2 text-[15px] text-[#64748B] max-w-2xl">
                Информация о платформе Тамшы, её целях, задачах и основных документах проекта.
              </p>
            </div>
          </AnimatedSection>

          {/* --- Цели и задачи --- */}
          <section id="goals" className="scroll-mt-24 mb-14">
            <AnimatedSection>
              <div className="flex items-stretch gap-4 mb-6">
                <div className="w-1 rounded-full bg-gradient-to-b from-[#0284C7] to-[#38BDF8] shrink-0" />
                <div>
                  <h2 className="text-[24px] font-semibold text-[#0F172A]">Цели и задачи</h2>
                  <p className="mt-2 text-[15px] text-[#64748B] leading-relaxed max-w-2xl">
                    Платформа Тамшы.kz создана для популяризации бережного отношения к водным
                    ресурсам среди школьников Казахстана. Проект объединяет образовательные и
                    конкурсные инициативы, направленные на вовлечение молодёжи в решение
                    экологических проблем, связанных с водой.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i}
                >
                  <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#93C5FD]/60">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: feat.bg }}
                    >
                      <HugeiconsIcon icon={feat.icon} size={22} style={{ color: feat.color }} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{feat.title}</h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed">{feat.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- Описание инициативы --- */}
          <section id="description" className="scroll-mt-24 mb-14">
            <AnimatedSection>
              <div className="flex items-stretch gap-4 mb-6">
                <div className="w-1 rounded-full bg-gradient-to-b from-[#0284C7] to-[#38BDF8] shrink-0" />
                <h2 className="text-[24px] font-semibold text-[#0F172A]">Описание инициативы</h2>
              </div>
            </AnimatedSection>

            <div className="flex flex-col lg:flex-row gap-6">
              <AnimatedSection className="flex-1">
                <div className="space-y-4">
                  <p className="text-[15px] text-[#0F172A]/80 leading-relaxed">
                    Инициатива Тамшы реализуется при поддержке Министерства водных ресурсов и
                    ирригации Республики Казахстан и направлена на экологическое просвещение
                    молодёжи в контексте проблем бассейна Аральского моря.
                  </p>
                  <p className="text-[15px] text-[#0F172A]/80 leading-relaxed">
                    Программа охватывает все регионы страны и предлагает школьникам возможность
                    представить собственные проекты по водосбережению в формате видеороликов,
                    научных исследований, художественных работ и технических изобретений.
                    Лучшие работы оцениваются экспертным жюри ИАЦ водных ресурсов, а победители
                    получают дипломы и ценные призы.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="lg:w-80 shrink-0">
                <div className="relative w-full h-52 lg:h-full min-h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0284C7] to-[#38BDF8] flex items-center justify-center">
                  {/* decorative circles */}
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-white/10" />
                  <p className="text-white/90 text-[14px] font-medium text-center px-6 leading-relaxed">
                    Район бассейна<br />Аральского моря
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* --- Документы проекта --- */}
          <section id="documents" className="scroll-mt-24 mb-14">
            <AnimatedSection>
              <div className="flex items-stretch gap-4 mb-6">
                <div className="w-1 rounded-full bg-gradient-to-b from-[#0284C7] to-[#38BDF8] shrink-0" />
                <h2 className="text-[24px] font-semibold text-[#0F172A]">Документы проекта</h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOCUMENTS.map((doc, i) => (
                <motion.div
                  key={doc.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i}
                >
                  <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#93C5FD]/60 cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* PDF icon */}
                        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-red-500"
                          >
                            <path
                              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 2v6h6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <text
                              x="12"
                              y="17"
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="5"
                              fontWeight="700"
                            >
                              PDF
                            </text>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-[15px] font-semibold text-[#0F172A] mb-0.5">
                            {doc.title}
                          </h3>
                          <p className="text-[12px] text-[#64748B]">
                            {doc.type} &middot; {doc.size}
                          </p>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0 group-hover:bg-[#E0F2FE] transition-colors">
                        <HugeiconsIcon
                          icon={Download01Icon}
                          size={18}
                          className="text-[#64748B] group-hover:text-[#0284C7] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
