'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Badge, { getTypeLabel } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import { regionLabels } from '@/lib/validators';
import Link from 'next/link';

interface LeaderProject {
  id: string;
  title: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  author: { name: string | null };
  _count: { votes: number };
}

const typeToBadge: Record<string, 'video' | 'research' | 'art' | 'invention' | 'app' | 'other'> = {
  VIDEO: 'video', RESEARCH: 'research', ART: 'art',
  INVENTION: 'invention', APP: 'app', OTHER: 'other',
};

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<LeaderProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/projects?sort=popular&page=1');
        const data = await res.json();
        setProjects(data.projects);
      } catch {
        // handle error
      }
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Таблица лидеров"
        subtitle="Проекты с наибольшим количеством голосов"
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E2EDE9]" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-[#E2EDE9] rounded mb-2" />
                <div className="h-3 w-1/3 bg-[#E2EDE9] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/projects/${project.id}`}>
                <Card hover padding="none" className="cursor-pointer">
                  <div className="flex items-center gap-4 p-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0
                      ${i === 0 ? 'bg-amber-100 text-amber-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-[#F8FAF9] text-[#5A7A6E]'}`}>
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#111B17] truncate">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[12px] text-[#5A7A6E]">
                        <span>{project.author?.name || 'Автор'}</span>
                        <span>·</span>
                        <span>{regionLabels[project.region]}</span>
                        <span>·</span>
                        <span>{project.schoolName}</span>
                      </div>
                    </div>

                    {/* Badge & Votes */}
                    <div className="hidden sm:block">
                      <Badge variant={typeToBadge[project.type] || 'other'}>
                        {getTypeLabel(project.type)}
                      </Badge>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[18px] font-bold text-[#1D9E75]">
                        {project._count.votes}
                      </div>
                      <div className="text-[11px] text-[#5A7A6E]">голосов</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[16px] text-[#5A7A6E]">Пока нет проектов</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
