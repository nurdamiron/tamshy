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

function formatNum(n: number): { value: number; suffix: string } {
  if (n >= 1000) return { value: Math.floor(n / 1000), suffix: 'K+' };
  if (n > 10) return { value: n, suffix: '+' };
  return { value: n, suffix: '' };
}

const statMeta = [
  { key: 'totalSchools', label: 'Школ участвуют', icon: School01Icon, fallback: 55 },
  { key: 'regions', label: 'Регионов', icon: Location01Icon, fallback: 14 },
  { key: 'totalProjects', label: 'Проектов подано', icon: File01Icon, fallback: 0 },
  { key: 'totalVotes', label: 'Голосов получено', icon: HeartCheckIcon, fallback: 0 },
];

export default function StatsRow() {
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
    <section className="relative z-10 -mt-10 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E2E8F0]/60 p-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {statMeta.map((stat, i) => {
              const raw = apiData?.[stat.key] ?? stat.fallback;
              const isRegions = stat.key === 'regions';
              const { value, suffix } = isRegions ? { value: raw, suffix: '' } : formatNum(raw);

              return (
                <div
                  key={stat.key}
                  className={`flex flex-col items-center py-6 px-4 ${
                    i < statMeta.length - 1 ? 'md:border-r md:border-[#E2E8F0]' : ''
                  } ${i < 2 ? 'border-b md:border-b-0 border-[#E2E8F0]' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-3">
                    <HugeiconsIcon icon={stat.icon} size={20} className="text-[#0284C7]" />
                  </div>
                  <div className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] leading-none">
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <div className="text-[13px] text-[#64748B] mt-1.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
