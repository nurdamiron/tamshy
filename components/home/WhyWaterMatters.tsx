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
    color: 'text-blue-500',
    bg: 'bg-blue-500',
  },
  {
    value: 45,
    suffix: '%',
    label: 'воды теряется из-за устаревшей ирригационной инфраструктуры',
    color: 'text-amber-500',
    bg: 'bg-amber-500',
  },
  {
    value: 90,
    suffix: '%',
    label: 'Аральского моря высохло за последние 60 лет',
    color: 'text-red-500',
    bg: 'bg-red-500',
  },
  {
    value: 4,
    suffix: ' млн',
    label: 'человек в Казахстане не имеют доступа к чистой питьевой воде',
    color: 'text-purple-500',
    bg: 'bg-purple-500',
  },
];

export default function WhyWaterMatters() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231D9E75' fill-opacity='1'%3E%3Cpath d='M30 0c0 0-10 14-10 22a10 10 0 0020 0c0-8-10-22-10-22z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[480px] mx-auto">
              {/* Concentric water rings */}
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-[#1D9E75]"
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
                <div className="w-full h-full bg-gradient-to-b from-[#1D9E75]/20 to-[#2BBFA0]/10 rounded-full flex items-center justify-center">
                  <svg width="64" height="90" viewBox="0 0 20 28" fill="none">
                    <path
                      d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z"
                      fill="url(#dropGrad)"
                    />
                    <defs>
                      <linearGradient id="dropGrad" x1="10" y1="0" x2="10" y2="28">
                        <stop offset="0%" stopColor="#2BBFA0" />
                        <stop offset="100%" stopColor="#0F6E56" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>

              {/* Orbiting fact dots */}
              {facts.map((fact, i) => {
                const angle = (i * 90 - 45) * (Math.PI / 180);
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <motion.div
                    key={i}
                    className={`absolute w-10 h-10 rounded-full ${fact.bg}/15 flex items-center justify-center`}
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  >
                    <div className={`w-3 h-3 rounded-full ${fact.bg}`} />
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
            <span className="text-caption text-[#1D9E75] tracking-widest">ПОЧЕМУ ЭТО ВАЖНО</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#111B17] mt-3 leading-tight">
              Казахстан — одна из самых{' '}
              <span className="text-[#1D9E75]">водоуязвимых</span>{' '}
              стран мира
            </h2>
            <p className="text-[15px] text-[#5A7A6E] mt-4 leading-relaxed">
              Наша страна занимает последнее место в Центральной Азии по обеспеченности
              водными ресурсами на душу населения. Каждый проект школьника — это шаг к
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
                  <div className={`text-[28px] font-bold ${fact.color} shrink-0 w-[90px]`}>
                    <AnimatedNumber target={fact.value} suffix={fact.suffix} />
                  </div>
                  <p className="text-[14px] text-[#5A7A6E] pt-1.5 leading-relaxed">
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
