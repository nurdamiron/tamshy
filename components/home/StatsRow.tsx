'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, target]);

  return <div ref={ref}>{count}{suffix}</div>;
}

const stats = [
  {
    value: 55,
    suffix: '+',
    label: 'Школ участвуют',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4M9 9h1M14 9h1M9 13h1M14 13h1" />
      </svg>
    ),
  },
  {
    value: 14,
    suffix: '',
    label: 'Областей и городов',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    value: 500,
    suffix: '+',
    label: 'Проектов подано',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    value: 10000,
    suffix: '+',
    label: 'Голосов получено',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
];

export default function StatsRow() {
  return (
    <section className="py-16 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2EDE9] text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-11 h-11 rounded-xl bg-[#E1F5EE] flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-[32px] sm:text-[36px] font-bold text-[#1D9E75] leading-none">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[13px] text-[#5A7A6E] mt-2 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
