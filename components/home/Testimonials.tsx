'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const TESTIMONIAL_META = [
  { avatarColor: '#0284C7', stars: 5 },
  { avatarColor: '#38BDF8', stars: 5 },
  { avatarColor: '#F59E0B', stars: 5 },
  { avatarColor: '#0369A1', stars: 5 },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials = TESTIMONIAL_META.map((meta, i) => {
    const idx = i + 1;
    return {
      name: t(`t${idx}Name`),
      role: t(`t${idx}Role`),
      text: t(`t${idx}Text`),
      region: t(`t${idx}Region`),
      avatarColor: meta.avatarColor,
      initial: t(`t${idx}Name`).charAt(0),
      stars: meta.stars,
    };
  });

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) {
      setCurrent((c) => Math.min(c + 1, testimonials.length - 1));
    } else if (info.offset.x > 50) {
      setCurrent((c) => Math.max(c - 1, 0));
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            {t('title')}
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Navigation arrows */}
          <button
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E2E8F0] flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 cursor-pointer ${current === 0 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(c + 1, testimonials.length - 1))}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E2E8F0] flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 cursor-pointer ${current === testimonials.length - 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Cards container */}
          <div className="overflow-hidden mx-8">
            <motion.div
              className="flex gap-6"
              style={{ x: dragX }}
              animate={{ x: -current * (100 / 2) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: -(testimonials.length - 1) * 300, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              {testimonials.map((item, i) => (
                <motion.div
                  key={item.name}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className="bg-[#F8FAFC] rounded-2xl p-7 h-full border border-[#E2E8F0]/40 relative"
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Large decorative quote */}
                    <svg className="absolute top-5 right-6 opacity-[0.04]" width="56" height="56" viewBox="0 0 24 24" fill="#0284C7">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>

                    <StarRating count={item.stars} />

                    <p className="text-[15px] text-[#0F172A] leading-relaxed mt-4 mb-6">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-5 border-t border-[#E2E8F0]/60">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 ring-2 ring-offset-2"
                        style={{ backgroundColor: item.avatarColor, '--tw-ring-color': item.avatarColor + '40' } as React.CSSProperties}
                      >
                        {item.initial}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-[#0F172A]">{item.name}</div>
                        <div className="text-[12px] text-[#64748B] truncate">{item.role}</div>
                      </div>
                      <div className="ml-auto shrink-0">
                        <span className="text-[11px] bg-[#E0F2FE] text-[#0284C7] px-2.5 py-1 rounded-full font-medium">
                          {item.region}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'w-8 bg-[#0284C7]' : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
