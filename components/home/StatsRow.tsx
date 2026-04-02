'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { School01Icon, Location01Icon, File01Icon, HeartCheckIcon } from '@hugeicons/core-free-icons';

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
  { value: 55, suffix: '+', label: 'Школ участвуют', icon: School01Icon },
  { value: 14, suffix: '', label: 'Областей', icon: Location01Icon },
  { value: 500, suffix: '+', label: 'Проектов подано', icon: File01Icon },
  { value: 10, suffix: 'K+', label: 'Голосов получено', icon: HeartCheckIcon },
];

export default function StatsRow() {
  return (
    <section className="relative z-10 -mt-10 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E2E8F0]/60 p-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-6 px-4 ${
                  i < stats.length - 1 ? 'md:border-r md:border-[#E2E8F0]' : ''
                } ${i < 2 ? 'border-b md:border-b-0 border-[#E2E8F0]' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={stat.icon} size={20} className="text-[#0284C7]" />
                </div>
                <div className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-none">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[13px] text-[#64748B] mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
