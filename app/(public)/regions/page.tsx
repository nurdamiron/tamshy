'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import { regionLabels } from '@/lib/validators';
import { REGIONS } from '@/lib/constants';
import Link from 'next/link';

export default function RegionsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Регионы"
        subtitle="Статистика проектов по регионам Казахстана"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGIONS.map((region, i) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
          >
            <Link href={`/projects?region=${region}`}>
              <Card
                hover
                padding="md"
                className={`cursor-pointer transition-all ${selected === region ? 'ring-2 ring-[#0284C7]' : ''}`}
                onClick={() => setSelected(region)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#0F172A]">
                        {regionLabels[region]}
                      </h3>
                      <p className="text-[12px] text-[#64748B]">Смотреть проекты</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
