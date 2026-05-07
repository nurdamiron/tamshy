'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import { regionLabels } from '@/lib/validators';
import { REGIONS } from '@/lib/constants';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface RegionCount {
  region: string;
  _count: { _all: number };
}

export default function RegionsPage() {
  const tRegions = useTranslations('regions');
  const tPage = useTranslations('regionsPage');
  const [selected, setSelected] = useState<string | null>(null);
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/regions')
      .then((r) => r.json())
      .then((data) => {
        if (data.regions) {
          const map: Record<string, number> = {};
          (data.regions as RegionCount[]).forEach((r) => {
            map[r.region] = r._count._all;
          });
          setRegionCounts(map);
        }
        setCountsLoading(false);
      })
      .catch(() => setCountsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title={tPage('title')}
        subtitle={tPage('subtitle')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGIONS.map((region, i) => {
          const count = regionCounts[region] ?? 0;
          return (
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
                          {tRegions(region) || regionLabels[region]}
                        </h3>
                        {countsLoading ? (
                          <div className="h-3 w-20 bg-[#E2E8F0] rounded animate-pulse mt-1" />
                        ) : (
                          <p className="text-[12px] text-[#64748B]">
                            {count > 0
                              ? `${count} мақұлданған жоба`
                              : tPage('viewProjects')}
                          </p>
                        )}
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
