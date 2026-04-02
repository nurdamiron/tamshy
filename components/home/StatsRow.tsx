'use client';

import { motion } from 'framer-motion';

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: '55+', label: 'Школ' },
  { value: '14', label: 'Областей' },
  { value: '500+', label: 'Проектов' },
  { value: '10K+', label: 'Голосов' },
];

export default function StatsRow() {
  return (
    <section className="py-16 bg-white border-y border-[#E2EDE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-[36px] font-bold text-[#1D9E75]">{stat.value}</div>
              <div className="text-[14px] text-[#5A7A6E] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
