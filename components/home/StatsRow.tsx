'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { School01Icon, Location01Icon, File01Icon, HeartCheckIcon } from '@hugeicons/core-free-icons';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

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
      else setDone(true);
    };
    tick();
  }, [isInView, target]);

  return (
    <div ref={ref} className="relative inline-block">
      <span>{count}{suffix}</span>
      {done && (
        <motion.div
          className="absolute -bottom-2 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8]"
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}

function formatNum(n: number): { value: number; suffix: string } {
  if (n >= 1000) return { value: Math.floor(n / 1000), suffix: 'K+' };
  if (n > 10) return { value: n, suffix: '+' };
  return { value: n, suffix: '' };
}

export default function StatsRow() {
  const t = useTranslations('stats');

  const statMeta = [
    { key: 'totalSchools', label: t('schools'), icon: School01Icon, fallback: 55, color: '#0284C7' },
    { key: 'regions', label: t('regions'), icon: Location01Icon, fallback: 14, color: '#3B82F6' },
    { key: 'totalProjects', label: t('projects'), icon: File01Icon, fallback: 0, color: '#8B5CF6' },
    { key: 'totalVotes', label: t('votes'), icon: HeartCheckIcon, fallback: 0, color: '#EC4899' },
  ];
  const [apiData, setApiData] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setApiData({
            totalSchools: d.totalSchools || 55,
            regions: d.regionStats?.length || 14,
            totalProjects: d.totalProjects || 0,
            totalVotes: d.totalVotes || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative z-10 -mt-10 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-gradient-to-b from-white to-[#FAFCFF] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] border border-[#E2E8F0]/40 p-2 backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {statMeta.map((stat, i) => {
              const raw = apiData?.[stat.key] ?? stat.fallback;
              const isRegions = stat.key === 'regions';
              const { value, suffix } = isRegions ? { value: raw, suffix: '' } : formatNum(raw);

              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                  className={`group relative flex flex-col items-center py-7 px-4 rounded-xl transition-colors duration-300 hover:bg-[#F8FAFC] cursor-default ${
                    i < statMeta.length - 1 ? 'md:border-r md:border-[#E2E8F0]/50' : ''
                  } ${i < 2 ? 'border-b md:border-b-0 border-[#E2E8F0]/50' : ''}`}
                >
                  <motion.div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: stat.color + '12' }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <HugeiconsIcon icon={stat.icon} size={20} style={{ color: stat.color }} />
                  </motion.div>
                  <div className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-none transition-colors duration-300 group-hover:text-[#0284C7]">
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <div className="text-[13px] text-[#64748B] mt-2 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
