'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import {
  basinLabels,
  problemLabels,
  waterBasinValues,
  waterProblemValues,
  regionLabels,
} from '@/lib/validators';

type ShowcaseProject = {
  id: string;
  title: string;
  summary: string | null;
  type: string;
  status: 'APPROVED' | 'WINNER';
  thumbnailUrl: string | null;
  videoUrl: string | null;
  region: string;
  basin: keyof typeof basinLabels | null;
  problemType: keyof typeof problemLabels | null;
  schoolName: string;
  publishedToQazsuAt: string | null;
  createdAt: string;
  waterObject: { id: string; name: string; type: string } | null;
};

export default function QazsuShowcasePage() {
  const tQazsu = useTranslations('qazsu');
  const tBasins = useTranslations('basins');
  const tProblems = useTranslations('problems');
  const tRegions = useTranslations('regions');

  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [basin, setBasin] = useState('');
  const [problem, setProblem] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (basin) params.set('basin', basin);
      if (problem) params.set('problem', problem);
      if (region) params.set('region', region);
      const res = await fetch(`/api/qazsu/showcase?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, basin, problem, region]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          <span className="text-[12px] font-medium text-[#0284C7]">Qazsu × Tamshy</span>
        </div>
        <h1 className="text-[28px] font-bold text-[#0F172A]">{tQazsu('showcaseTitle')}</h1>
        <p className="text-[14px] text-[#64748B] mt-2 max-w-2xl">
          {tQazsu('showcaseSubtitle')}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={basin} onChange={(e) => { setBasin(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
          <option value="">{tQazsu('allBasins')}</option>
          {waterBasinValues.map((b) => (
            <option key={b} value={b}>{tBasins(b)}</option>
          ))}
        </select>
        <select value={problem} onChange={(e) => { setProblem(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
          <option value="">{tQazsu('allProblems')}</option>
          {waterProblemValues.map((p) => (
            <option key={p} value={p}>{tProblems(p)}</option>
          ))}
        </select>
        <select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
          <option value="">{tQazsu('allRegions')}</option>
          {Object.keys(regionLabels).map((code) => (
            <option key={code} value={code}>{tRegions(code)}</option>
          ))}
        </select>
        <span className="ml-auto text-[12px] text-slate-500 self-center">{tQazsu('showcaseFound', { count: total })}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card padding="lg" hover={false}>
          <p className="text-center text-slate-500 py-12">
            {tQazsu('showcaseEmpty')}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group">
              <Card padding="md" hover>
                {p.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {p.status === 'WINNER' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      {tQazsu('winnerBadge')}
                    </span>
                  )}
                  {p.basin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F0F9FF] text-[#0284C7]">
                      {tBasins(p.basin)}
                    </span>
                  )}
                  {p.problemType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                      {tProblems(p.problemType)}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[15px] text-[#0F172A] line-clamp-2 group-hover:text-[#0284C7] transition-colors">
                  {p.title}
                </h3>
                {p.summary && (
                  <p className="text-[12.5px] text-slate-500 mt-1.5 line-clamp-2">{p.summary}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-2 truncate">
                  {p.schoolName} · {tRegions(p.region)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-1 mt-8">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
            ← Назад
          </button>
          <span className="px-4 py-2 text-[13px] text-slate-500">{page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}
