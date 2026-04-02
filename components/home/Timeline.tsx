'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const milestones = [
  {
    date: 'Январь 2026',
    title: 'Старт конкурса',
    desc: 'Открытие регистрации и приёма проектов',
    status: 'past' as const,
  },
  {
    date: 'Февраль 2026',
    title: 'Региональные этапы',
    desc: 'Отбор лучших проектов в каждом регионе',
    status: 'past' as const,
  },
  {
    date: 'Март 2026',
    title: 'Голосование',
    desc: 'Общенародное голосование за лучшие проекты',
    status: 'past' as const,
  },
  {
    date: 'Апрель 2026',
    title: 'Экспертная оценка',
    desc: 'Жюри ИАЦ водных ресурсов оценивает финалистов',
    status: 'current' as const,
  },
  {
    date: 'Июнь 2026',
    title: 'Финал',
    desc: 'Торжественное объявление победителей в Астане',
    status: 'future' as const,
  },
  {
    date: 'Август 2026',
    title: 'Реализация',
    desc: 'Гранты на реализацию лучших проектов',
    status: 'future' as const,
  },
];

const statusColors = {
  past: { dot: 'bg-[#0284C7]', text: 'text-[#0284C7]', line: 'bg-[#0284C7]', bg: 'bg-[#E0F2FE]' },
  current: { dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', line: 'bg-[#F59E0B]', bg: 'bg-amber-50' },
  future: { dot: 'bg-[#CBD5E1]', text: 'text-[#94A3B8]', line: 'bg-[#E2E8F0]', bg: 'bg-[#F8FAFC]' },
};

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 60%'],
  });
  const lineProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">ЭТАПЫ</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            Календарь конкурса
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            Ключевые даты и события конкурса Тамшы
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Base line */}
            <div className="absolute top-[28px] left-[8%] right-[8%] h-[3px] bg-[#E2E8F0] rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0284C7] via-[#F59E0B] to-[#E2E8F0] rounded-full"
                style={{ width: lineProgress }}
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              {milestones.map((m, i) => {
                const colors = statusColors[m.status];
                return (
                  <motion.div
                    key={m.date}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Dot */}
                    <div className="relative mb-6">
                      <div className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <div className={`w-4 h-4 rounded-full ${colors.dot}`} />
                      </div>
                      {m.status === 'current' && (
                        <div className="absolute inset-0 rounded-full bg-[#F59E0B]/20 animate-ping" />
                      )}
                    </div>

                    <span className={`text-[12px] font-bold uppercase tracking-wide ${colors.text} mb-2`}>
                      {m.date}
                    </span>
                    <h4 className={`text-[15px] font-semibold mb-1 ${m.status === 'future' ? 'text-[#94A3B8]' : 'text-[#0F172A]'}`}>
                      {m.title}
                    </h4>
                    <p className={`text-[13px] leading-relaxed ${m.status === 'future' ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                      {m.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden">
          <div className="relative ml-6">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E2E8F0] rounded-full">
              <motion.div
                className="w-full bg-gradient-to-b from-[#0284C7] via-[#F59E0B] to-[#E2E8F0] rounded-full"
                style={{ height: lineProgress }}
              />
            </div>

            <div className="space-y-8">
              {milestones.map((m, i) => {
                const colors = statusColors[m.status];
                return (
                  <motion.div
                    key={m.date}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1 -translate-x-[calc(50%-1.5px)]">
                      <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                      </div>
                      {m.status === 'current' && (
                        <div className="absolute inset-0 rounded-full bg-[#F59E0B]/20 animate-ping" />
                      )}
                    </div>

                    <span className={`text-[12px] font-bold uppercase tracking-wide ${colors.text}`}>
                      {m.date}
                    </span>
                    <h4 className={`text-[15px] font-semibold mt-1 ${m.status === 'future' ? 'text-[#94A3B8]' : 'text-[#0F172A]'}`}>
                      {m.title}
                    </h4>
                    <p className={`text-[13px] mt-0.5 leading-relaxed ${m.status === 'future' ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                      {m.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
