'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { SmartPhone01Icon, Upload01Icon, HeartCheckIcon, Medal01Icon } from '@hugeicons/core-free-icons';
import { HOW_IT_WORKS_BG_URL } from '@/lib/constants';

const iconMap = [SmartPhone01Icon, Upload01Icon, HeartCheckIcon, Medal01Icon];
const colors = ['#0284C7', '#3B82F6', '#EC4899', '#F59E0B'];

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', title: t('step4Title'), desc: t('step4Desc') },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Photo background — very subtle, content readability preserved */}
      {HOW_IT_WORKS_BG_URL && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HOW_IT_WORKS_BG_URL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ opacity: 0.04 }}
          />
          <div className="absolute inset-0 bg-white/80 pointer-events-none" />
        </>
      )}
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(#0284C7 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block text-[12px] font-bold text-[#0284C7] tracking-[0.2em] uppercase mb-4 px-4 py-1.5 bg-[#EFF6FF] rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {t('caption')}
          </motion.span>
          <h2 className="text-[30px] sm:text-[40px] font-bold text-[#0F172A] mt-3 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-[16px] text-[#64748B] mt-4 max-w-md mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps — desktop: horizontal cards with arrow connectors */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-5">
            {steps.map((step, i) => {
              const color = colors[i];
              const Icon = iconMap[i];
              const isHovered = hoveredStep === i;

              return (
                <div key={step.num} className="relative">
                  {/* Arrow connector */}
                  {i < 3 && (
                    <motion.div
                      className="absolute top-1/2 -right-5 z-10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M12 5l5 5-5 5" stroke={colors[i]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
                      </svg>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
                    onMouseEnter={() => setHoveredStep(i)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="relative cursor-default"
                  >
                    <motion.div
                      className="relative rounded-2xl p-6 pb-8 text-center border transition-colors duration-300 h-full"
                      style={{
                        borderColor: isHovered ? color + '30' : '#E2E8F0',
                        backgroundColor: isHovered ? color + '04' : 'white',
                      }}
                      animate={isHovered ? { y: -6 } : { y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {/* Step number — top right */}
                      <motion.div
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shadow-lg text-white"
                        style={{ backgroundColor: color }}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 400 }}
                      >
                        {step.num}
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ backgroundColor: color + '10' }}
                        animate={isHovered ? { scale: 1.1, rotate: 6 } : { scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <motion.div
                          initial={{ rotate: 180, opacity: 0 }}
                          animate={isInView ? { rotate: 0, opacity: 1 } : {}}
                          transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <HugeiconsIcon icon={Icon} size={28} style={{ color }} />
                        </motion.div>
                      </motion.div>

                      {/* Text */}
                      <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2.5 transition-colors duration-300" style={{ color: isHovered ? color : '#0F172A' }}>
                        {step.title}
                      </h3>
                      <p className="text-[13.5px] text-[#64748B] leading-relaxed">
                        {step.desc}
                      </p>

                      {/* Bottom accent line */}
                      <motion.div
                        className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ scaleX: 0 }}
                        animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps — mobile/tablet: vertical timeline */}
        <div className="lg:hidden">
          <div className="relative ml-4">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#0284C7] via-[#EC4899] to-[#F59E0B]" />

            <div className="space-y-10">
              {steps.map((step, i) => {
                const color = colors[i];
                const Icon = iconMap[i];

                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative pl-12"
                  >
                    {/* Dot on timeline */}
                    <motion.div
                      className="absolute left-0 top-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-lg"
                      style={{ backgroundColor: color }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 400 }}
                    >
                      {step.num}
                    </motion.div>

                    <div className="rounded-xl border border-[#E2E8F0] p-5 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '10' }}>
                          <HugeiconsIcon icon={Icon} size={22} style={{ color }} />
                        </div>
                        <h3 className="text-[16px] font-semibold text-[#0F172A]">{step.title}</h3>
                      </div>
                      <p className="text-[14px] text-[#64748B] leading-relaxed">{step.desc}</p>
                    </div>
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
