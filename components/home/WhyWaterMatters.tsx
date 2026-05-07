'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WHY_WATER_PHOTOS } from '@/lib/constants';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isInView, target]);

  return <span ref={ref}>{current}{suffix}</span>;
}

export default function WhyWaterMatters() {
  const t = useTranslations('whyWater');

  const facts = [
    {
      value: 70,
      suffix: '%',
      label: t('fact1'),
      dotColor: '#3B82F6',
      bg: 'bg-blue-50',
    },
    {
      value: 45,
      suffix: '%',
      label: t('fact2'),
      dotColor: '#F59E0B',
      bg: 'bg-amber-50',
    },
    {
      value: 90,
      suffix: '%',
      label: t('fact3'),
      dotColor: '#EF4444',
      bg: 'bg-red-50',
    },
    {
      value: 4,
      suffix: t('millionSuffix'),
      label: t('fact4'),
      dotColor: '#8B5CF6',
      bg: 'bg-purple-50',
    },
  ];
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Photo mosaic with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ y: visualY }}
            className="relative"
          >
            <div className="relative max-w-[420px] mx-auto">
              {/* 2-column photo grid */}
              <div className="grid grid-cols-2 gap-3 h-[420px]">
                {/* Left column — tall portrait photo */}
                <motion.div
                  className="rounded-2xl overflow-hidden row-span-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={WHY_WATER_PHOTOS[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Top right */}
                <motion.div
                  className="rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: -12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={WHY_WATER_PHOTOS[1]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Bottom right */}
                <motion.div
                  className="rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={WHY_WATER_PHOTOS[2]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Floating stat badge — bottom right */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-4 border border-[#E2E8F0]"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 22 }}
              >
                <div className="text-[28px] font-bold text-[#0284C7] leading-none">
                  <AnimatedNumber target={facts[0].value} suffix={facts[0].suffix} />
                </div>
                <div className="text-[11px] text-[#64748B] mt-1 max-w-[120px] leading-snug">
                  {facts[0].label}
                </div>
              </motion.div>

              {/* Water drop badge — top left */}
              <motion.div
                className="absolute -top-3 -left-3 w-12 h-12 bg-[#0284C7] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"
                animate={{ rotate: [0, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              >
                <svg width="22" height="31" viewBox="0 0 20 28" fill="none">
                  <path
                    d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3 leading-tight">
              {t('title')}{' '}
              <span className="text-[#0284C7] relative">
                {t('titleHighlight')}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>{' '}
              {t('titleEnd')}
            </h2>
            <p className="text-[15px] text-[#64748B] mt-4 leading-relaxed">
              {t('description')}
            </p>

            <div className="mt-8 space-y-4">
              {facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex gap-4 items-start p-4 rounded-xl ${fact.bg} border border-transparent hover:border-[#E2E8F0] transition-colors duration-300`}
                >
                  <div
                    className="shrink-0 w-1 h-full min-h-[40px] rounded-full"
                    style={{ backgroundColor: fact.dotColor }}
                  />
                  <div className="shrink-0 w-[72px] text-[26px] font-bold leading-none pt-0.5" style={{ color: fact.dotColor }}>
                    <AnimatedNumber target={fact.value} suffix={fact.suffix} />
                  </div>
                  <p className="text-[14px] text-[#64748B] leading-relaxed pt-0.5">
                    {fact.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
