'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { SmartPhone01Icon, Upload01Icon, HeartCheckIcon, Medal01Icon } from '@hugeicons/core-free-icons';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: SmartPhone01Icon,
      color: '#0284C7',
      gradient: 'from-[#0284C7] to-[#38BDF8]',
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Upload01Icon,
      color: '#3B82F6',
      gradient: 'from-[#3B82F6] to-[#60A5FA]',
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: HeartCheckIcon,
      color: '#EC4899',
      gradient: 'from-[#EC4899] to-[#F472B6]',
    },
    {
      num: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: Medal01Icon,
      color: '#F5A623',
      gradient: 'from-[#F59E0B] to-[#FBBF24]',
    },
  ];
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 50%'],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

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
          <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            {t('title')}
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Animated connector line -- desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-[2px] bg-[#E2E8F0]/60">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0284C7] via-[#EC4899] to-[#F59E0B] rounded-full"
              style={{ width: lineWidth }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 25 }}
              className="relative text-center group"
            >
              {/* Icon with gradient border on hover */}
              <div className="relative z-10 mx-auto mb-6">
                <motion.div
                  className="w-[76px] h-[76px] rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 border-2 border-transparent group-hover:border-current"
                  style={{ backgroundColor: step.color + '10', color: step.color + '30' }}
                  whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <motion.div
                    initial={{ rotate: 180, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <HugeiconsIcon icon={step.icon} size={28} style={{ color: step.color }} />
                  </motion.div>
                </motion.div>
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full shadow-sm flex items-center justify-center text-[11px] font-bold bg-white border-2"
                  style={{ color: step.color, borderColor: step.color + '40' }}
                >
                  {step.num}
                </div>
              </div>

              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2 group-hover:text-[#0284C7] transition-colors">
                {step.title}
              </h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed max-w-[240px] mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
