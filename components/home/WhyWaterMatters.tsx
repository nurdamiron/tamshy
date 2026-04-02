'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

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

const facts = [
  {
    value: 70,
    suffix: '%',
    label: 'водных ресурсов Казахстана формируется за пределами страны',
    dotColor: '#3B82F6',
  },
  {
    value: 45,
    suffix: '%',
    label: 'воды теряется из-за устаревшей ирригационной инфраструктуры',
    dotColor: '#F59E0B',
  },
  {
    value: 90,
    suffix: '%',
    label: 'Аральского моря высохло за последние 60 лет',
    dotColor: '#EF4444',
  },
  {
    value: 4,
    suffix: ' млн',
    label: 'человек в Казахстане не имеют доступа к чистой питьевой воде',
    dotColor: '#8B5CF6',
  },
];

export default function WhyWaterMatters() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[420px] mx-auto">
              {/* Concentric water rings */}
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border border-[#0284C7]"
                  style={{
                    inset: `${ring * 12}%`,
                    opacity: 0.06 + ring * 0.04,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    delay: ring * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* Center water drop */}
              <motion.div
                className="absolute inset-[30%] flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-full h-full bg-gradient-to-b from-[#0284C7]/20 to-[#38BDF8]/10 rounded-full flex items-center justify-center">
                  <svg width="64" height="90" viewBox="0 0 20 28" fill="none">
                    <path
                      d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z"
                      fill="url(#dropGrad)"
                    />
                    <defs>
                      <linearGradient id="dropGrad" x1="10" y1="0" x2="10" y2="28">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0369A1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>

              {/* Orbiting dots */}
              {facts.map((fact, i) => {
                const angle = (i * 90 - 45) * (Math.PI / 180);
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <motion.div
                    key={i}
                    className="absolute w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: fact.dotColor + '15',
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: fact.dotColor }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-caption text-[#0284C7] tracking-widest">ПОЧЕМУ ЭТО ВАЖНО</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3 leading-tight">
              Казахстан -- одна из самых{' '}
              <span className="text-[#0284C7]">водоуязвимых</span>{' '}
              стран мира
            </h2>
            <p className="text-[15px] text-[#64748B] mt-4 leading-relaxed">
              Наша страна занимает последнее место в Центральной Азии по обеспеченности
              водными ресурсами на душу населения. Каждый проект школьника -- это шаг к
              решению этой проблемы.
            </p>

            <div className="mt-8 space-y-5">
              {facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0 w-[80px] text-[28px] font-bold leading-none pt-0.5" style={{ color: fact.dotColor }}>
                    <AnimatedNumber target={fact.value} suffix={fact.suffix} />
                  </div>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
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
