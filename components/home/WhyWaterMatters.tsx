'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
    bg: 'bg-blue-50',
  },
  {
    value: 45,
    suffix: '%',
    label: 'воды теряется из-за устаревшей ирригационной инфраструктуры',
    dotColor: '#F59E0B',
    bg: 'bg-amber-50',
  },
  {
    value: 90,
    suffix: '%',
    label: 'Аральского моря высохло за последние 60 лет',
    dotColor: '#EF4444',
    bg: 'bg-red-50',
  },
  {
    value: 4,
    suffix: ' млн',
    label: 'человек в Казахстане не имеют доступа к чистой питьевой воде',
    dotColor: '#8B5CF6',
    bg: 'bg-purple-50',
  },
];

export default function WhyWaterMatters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const waterLevel = useTransform(scrollYProgress, [0.1, 0.6], ['85%', '20%']);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ y: visualY }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[420px] mx-auto">
              {/* Concentric water rings */}
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border-2"
                  style={{
                    inset: `${ring * 12}%`,
                    borderColor: `rgba(2, 132, 199, ${0.04 + ring * 0.03})`,
                  }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 3,
                    delay: ring * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* Center water drop with animated fill level */}
              <motion.div
                className="absolute inset-[28%] flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#E0F2FE] to-[#BAE6FD]">
                  {/* Animated water level */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0284C7] to-[#38BDF8] rounded-b-full"
                    style={{ top: waterLevel }}
                  >
                    {/* Wave on top of water */}
                    <svg className="absolute -top-[6px] left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                      <motion.path
                        d="M0,4 Q25,0 50,4 Q75,8 100,4 L100,8 L0,8 Z"
                        fill="#38BDF8"
                        animate={{
                          d: [
                            'M0,4 Q25,0 50,4 Q75,8 100,4 L100,8 L0,8 Z',
                            'M0,4 Q25,8 50,4 Q75,0 100,4 L100,8 L0,8 Z',
                            'M0,4 Q25,0 50,4 Q75,8 100,4 L100,8 L0,8 Z',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </svg>
                  </motion.div>
                  <svg width="48" height="68" viewBox="0 0 20 28" fill="none" className="relative z-10">
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

              {/* Orbiting dots with trails */}
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
                      backgroundColor: fact.dotColor + '12',
                      boxShadow: `0 0 20px ${fact.dotColor}15`,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
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
              <span className="text-[#0284C7] relative">
                водоуязвимых
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>{' '}
              стран мира
            </h2>
            <p className="text-[15px] text-[#64748B] mt-4 leading-relaxed">
              Наша страна занимает последнее место в Центральной Азии по обеспеченности
              водными ресурсами на душу населения. Каждый проект школьника -- это шаг к
              решению этой проблемы.
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
