'use client';

import { useEffect, useState } from 'react';
import { basinLabels, problemLabels, regionLabels } from '@/lib/validators';

type StatsResponse = {
  totals: {
    total: number;
    fromQazsu: number;
    withBasin: number;
    withProblem: number;
    withWaterObject: number;
    published: number;
  };
  byBasin: { basin: keyof typeof basinLabels | null; count: number }[];
  byProblem: { problemType: keyof typeof problemLabels | null; count: number }[];
  byRegion: { region: string; count: number }[];
  bySource: { source: string; count: number }[];
  byStatus: { status: string; count: number }[];
  topWaterObjects: { id: string; name: string; basin: string | null; count: number }[];
};

function StatCard({ label, value, hint, accent }: {
  label: string; value: number | string; hint?: string; accent?: 'blue' | 'amber' | 'green' | 'slate';
}) {
  const accentClasses = {
    blue:  'bg-[#F0F9FF] border-[#BAE6FD] text-[#0284C7]',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    slate: 'bg-white border-[#E2E8F0] text-[#0F172A]',
  };
  return (
    <div className={`rounded-xl border p-4 ${accentClasses[accent ?? 'slate']}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-[28px] font-bold mt-1 leading-tight">{value}</p>
      {hint && <p className="text-[11px] mt-1 opacity-60">{hint}</p>}
    </div>
  );
}

function BarRow({ label, count, max, color = '#0284C7' }: {
  label: string; count: number; max: number; color?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-44 text-[12.5px] text-[#475569] truncate" title={label}>{label}</div>
      <div className="flex-1 h-5 rounded-md bg-slate-100 relative overflow-hidden">
        <div className="h-full rounded-md transition-all"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="w-12 text-right text-[12px] font-medium text-[#0F172A]">{count}</div>
    </div>
  );
}

export default function AdminQazsuStats() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/qazsu-stats')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500">Не удалось загрузить статистику</div>
    );
  }

  const { totals } = data;
  const maxBasin = Math.max(1, ...data.byBasin.map((b) => b.count));
  const maxProblem = Math.max(1, ...data.byProblem.map((p) => p.count));
  const maxRegion = Math.max(1, ...data.byRegion.map((r) => r.count));

  const pct = (n: number) => totals.total > 0 ? Math.round((n / totals.total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Qazsu KPI</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Аналитика интеграции Tamshy ↔ Qazsu по бассейнам, темам, регионам и источникам.
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Всего проектов" value={totals.total} accent="slate" />
        <StatCard label="Из Qazsu" value={totals.fromQazsu}
          hint={`${pct(totals.fromQazsu)}% от всех`} accent="blue" />
        <StatCard label="С бассейном" value={totals.withBasin}
          hint={`${pct(totals.withBasin)}% от всех`} accent="slate" />
        <StatCard label="С темой" value={totals.withProblem}
          hint={`${pct(totals.withProblem)}% от всех`} accent="slate" />
        <StatCard label="С объектом" value={totals.withWaterObject}
          hint={`${pct(totals.withWaterObject)}% от всех`} accent="slate" />
        <StatCard label="В витрине Qazsu" value={totals.published} accent="amber" />
      </div>

      {/* Two columns: Basin + Problem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">По бассейнам</h2>
          {data.byBasin.length === 0 ? (
            <p className="text-[12px] text-slate-400">Нет проектов с бассейном</p>
          ) : (
            <div>
              {data.byBasin
                .filter((b) => b.basin)
                .sort((a, b) => b.count - a.count)
                .map((b) => (
                  <BarRow key={b.basin}
                    label={basinLabels[b.basin as keyof typeof basinLabels]}
                    count={b.count} max={maxBasin} />
                ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">По темам</h2>
          {data.byProblem.length === 0 ? (
            <p className="text-[12px] text-slate-400">Нет проектов с темой</p>
          ) : (
            <div>
              {data.byProblem
                .filter((p) => p.problemType)
                .sort((a, b) => b.count - a.count)
                .map((p) => (
                  <BarRow key={p.problemType}
                    label={problemLabels[p.problemType as keyof typeof problemLabels]}
                    count={p.count} max={maxProblem} color="#8B5CF6" />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Region + Top objects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">Топ-10 регионов</h2>
          {data.byRegion.map((r) => (
            <BarRow key={r.region}
              label={regionLabels[r.region] ?? r.region}
              count={r.count} max={maxRegion} color="#10B981" />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">Топ-10 водных объектов</h2>
          {data.topWaterObjects.length === 0 ? (
            <p className="text-[12px] text-slate-400">Нет проектов с привязкой к объекту</p>
          ) : (
            <div className="space-y-1.5">
              {data.topWaterObjects.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#0F172A] truncate">{w.name}</p>
                    {w.basin && (
                      <p className="text-[11px] text-slate-400">
                        {basinLabels[w.basin as keyof typeof basinLabels] ?? w.basin}
                      </p>
                    )}
                  </div>
                  <span className="text-[13px] font-bold text-[#0284C7]">{w.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Source + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">По источнику</h2>
          <div className="flex gap-3 flex-wrap">
            {data.bySource.map((s) => (
              <div key={s.source} className="flex-1 min-w-[100px] bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-slate-500 uppercase">{s.source}</p>
                <p className="text-[20px] font-bold text-[#0F172A] mt-1">{s.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[14px] font-semibold text-[#0F172A] mb-3">По статусу</h2>
          <div className="flex gap-3 flex-wrap">
            {data.byStatus.map((s) => (
              <div key={s.status} className="flex-1 min-w-[100px] bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-slate-500 uppercase">{s.status}</p>
                <p className="text-[20px] font-bold text-[#0F172A] mt-1">{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
