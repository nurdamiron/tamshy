'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/project/ProjectCard';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/layout/PageHeader';
import {
  regionLabels,
  waterBasinValues,
  waterProblemValues,
} from '@/lib/validators';
import { PROJECT_TYPES } from '@/lib/constants';
import { useTranslations } from 'next-intl';

/* options are built inside the component with translations */

interface ProjectDataRaw {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  teacherName: string;
  createdAt: string;
  author: { id: string; name: string | null };
  _count: { votes: number };
  thumbnailUrl?: string | null;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  teacherName: string;
  createdAt: string;
  authorName: string;
  voteCount: number;
  thumbnailUrl?: string | null;
}

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tRegions = useTranslations('regions');
  const tTypes = useTranslations('types');
  const tCommon = useTranslations('common');
  const tQazsu = useTranslations('qazsu');
  const tBasins = useTranslations('basins');
  const tProblems = useTranslations('problems');

  const regionOptions = [
    { value: 'all', label: t('allRegions') },
    ...Object.entries(regionLabels).map(([value, label]) => ({ value, label: tRegions(value) || label })),
  ];

  const typeOptions = [
    { value: 'all', label: t('allTypes') },
    ...PROJECT_TYPES.map((pt) => ({ value: pt.value, label: tTypes(pt.value) })),
  ];

  const sortOptions = [
    { value: 'new', label: t('sortNew') },
    { value: 'popular', label: t('sortPopular') },
    { value: 'winner', label: t('sortWinner') },
  ];

  const basinOptions = [
    { value: 'all', label: tQazsu('allBasins') },
    ...waterBasinValues.map((b) => ({ value: b, label: tBasins(b) })),
  ];

  const problemOptions = [
    { value: 'all', label: tQazsu('allProblems') },
    ...waterProblemValues.map((p) => ({ value: p, label: tProblems(p) })),
  ];

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');
  const [region, setRegion] = useState('all');
  const [sort, setSort] = useState('new');
  const [search, setSearch] = useState('');
  const [basin, setBasin] = useState('all');
  const [problem, setProblem] = useState('all');
  const observerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const fetchProjects = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        sort,
        ...(type !== 'all' && { type }),
        ...(region !== 'all' && { region }),
        ...(basin !== 'all' && { basin }),
        ...(problem !== 'all' && { problem }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();

      const mapped = data.projects.map((p: ProjectDataRaw) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        status: p.status,
        region: p.region,
        schoolName: p.schoolName,
        grade: p.grade,
        teacherName: p.teacherName,
        createdAt: p.createdAt,
        authorName: p.author?.name || tCommon('defaultAuthor'),
        voteCount: p._count?.votes || 0,
        thumbnailUrl: p.thumbnailUrl,
      }));

      setProjects(prev => append ? [...prev, ...mapped] : mapped);
      setTotalPages(data.pages);
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, [type, region, sort, search, basin, problem]);

  useEffect(() => {
    setPage(1);
    fetchProjects(1);
  }, [fetchProjects]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProjects(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loading, fetchProjects]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProjects(1);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-[#F8FAFC]/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-[calc(50%-6px)] sm:w-40">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={typeOptions}
            />
          </div>
          <div className="w-[calc(50%-6px)] sm:w-44">
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              options={regionOptions}
            />
          </div>
          <div className="w-[calc(50%-6px)] sm:w-44">
            <Select
              value={basin}
              onChange={(e) => setBasin(e.target.value)}
              options={basinOptions}
            />
          </div>
          <div className="w-[calc(50%-6px)] sm:w-44">
            <Select
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              options={problemOptions}
            />
          </div>
          <div className="w-full sm:w-36">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-20">
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p className="text-[16px] text-[#64748B]">{t('noResults')}</p>
          <p className="text-[13px] text-[#64748B]/60 mt-1">{t('noResultsHint')}</p>
        </div>
      ) : null}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 w-20 bg-[#E2E8F0] rounded-full mb-3" />
              <div className="h-5 w-3/4 bg-[#E2E8F0] rounded mb-2" />
              <div className="h-4 w-full bg-[#E2E8F0] rounded mb-1" />
              <div className="h-4 w-2/3 bg-[#E2E8F0] rounded mb-4" />
              <div className="h-px bg-[#E2E8F0] mb-3" />
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-[#E2E8F0] rounded" />
                <div className="h-4 w-12 bg-[#E2E8F0] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}
