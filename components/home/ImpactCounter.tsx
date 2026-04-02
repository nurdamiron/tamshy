'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix = '', duration = 2500 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('ru-RU')}{suffix}
    </span>
  );
}

const impacts = [
  {
    value: 1250000,
    suffix: '+',
    label: 'Литров воды сохранено',
    description: 'Благодаря проектам участников',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" fill="#38BDF8" fillOpacity="0.8" />
      </svg>
    ),
  },
  {
    value: 45,
    suffix: '+',
    label: 'Тонн CO2 снижено',
    description: 'Экологический эффект',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    value: 55,
    suffix: '+',
    label: 'Школ участвуют',
    description: 'По всему Казахстану',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
      </svg>
    ),
  },
  {
    value: 14,
    suffix: '',
    label: 'Регионов охвачено',
    description: 'Все области Казахстана',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

function StarParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white/20"
      style={{ left: x, top: y }}
      animate={{
        opacity: [0.1, 0.5, 0.1],
        scale: [0.5, 1.5, 0.5],
      }}
      transition={{
        duration: 3 + delay,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function ImpactCounter() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
      {/* Star particles */}
      <StarParticle delay={0} x="10%" y="20%" />
      <StarParticle delay={0.5} x="25%" y="60%" />
      <StarParticle delay={1} x="40%" y="15%" />
      <StarParticle delay={1.5} x="55%" y="75%" />
      <StarParticle delay={2} x="70%" y="30%" />
      <StarParticle delay={2.5} x="85%" y="55%" />
      <StarParticle delay={3} x="15%" y="80%" />
      <StarParticle delay={0.8} x="60%" y="45%" />
      <StarParticle delay={1.8} x="90%" y="15%" />
      <StarParticle delay={3.2} x="35%" y="90%" />

      {/* Wave decoration top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[30px] sm:h-[40px]">
          <path d="M0,60 C480,0 960,60 1440,0 L1440,0 L0,0 Z" fill="#F8FAFC" />
        </svg>
      </div>

      {/* Wave decoration bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[30px] sm:h-[40px]">
          <path d="M0,0 C480,60 960,0 1440,60 L1440,60 L0,60 Z" fill="#F8FAFC" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-caption text-[#38BDF8] tracking-widest">НАШ ВКЛАД</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-white mt-3">
            Коллективный результат
          </h2>
          <p className="text-[15px] text-white/40 mt-3 max-w-lg mx-auto">
            Каждый проект -- это реальный вклад в будущее водных ресурсов
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact, i) => (
            <motion.div
              key={impact.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center h-full"
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(56,189,248,0.3)',
                  y: -4,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  {impact.icon}
                </div>
                <div className="text-[32px] sm:text-[40px] font-bold text-white leading-none mb-2">
                  <AnimatedCounter target={impact.value} suffix={impact.suffix} />
                </div>
                <div className="text-[15px] font-semibold text-white/80 mb-1">{impact.label}</div>
                <div className="text-[13px] text-white/40">{impact.description}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
