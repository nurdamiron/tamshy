'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { basinLabels, waterBasinValues, problemLabels, waterProblemValues } from '@/lib/validators';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  teacherName: string;
  studentName?: string | null;
  grade: number;
  juryScore?: number | null;
  createdAt: string;
  author: { name: string | null; email: string | null };
  _count: { votes: number };
  // Qazsu integration
  sourceSystem?: 'DIRECT' | 'QAZSU' | 'PARTNER' | null;
  basin?: keyof typeof basinLabels | null;
  problemType?: keyof typeof problemLabels | null;
  publishToQazsu?: boolean;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING:  { label: 'На рассмотрении', color: 'bg-yellow-50 text-yellow-700' },
  APPROVED: { label: 'Одобрено',        color: 'bg-green-50 text-green-700'  },
  REJECTED: { label: 'Отклонено',       color: 'bg-red-50 text-red-700'     },
  WINNER:   { label: 'Победитель',      color: 'bg-amber-50 text-amber-700' },
};

const typeLabels: Record<string, string> = {
  VIDEO: 'Видео', RESEARCH: 'Исслед.', ART: 'Творч.',
  INVENTION: 'Изобрет.', APP: 'Прилож.', OTHER: 'Другое',
};

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'PENDING',  label: 'На рассмотрении' },
  { value: 'APPROVED', label: 'Одобрено' },
  { value: 'REJECTED', label: 'Отклонено' },
  { value: 'WINNER',   label: 'Победитель' },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [basin, setBasin] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      if (basin) params.set('basin', basin);
      const res = await fetch(`/api/projects?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch { /* */ }
    setLoading(false);
  }, [page, status, search, basin]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const changeStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 0, comment: 'Изменено администратором', status: newStatus }),
    });
    if (res.ok) fetchProjects();
  };

  const togglePublishToQazsu = async (id: string, publish: boolean) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _qazsuPublish: publish }),
    });
    if (res.ok) fetchProjects();
  };

  const updateQazsuMeta = async (
    id: string,
    field: 'basin' | 'problemType',
    value: string,
  ) => {
    await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _qazsuMeta: { [field]: value || null } }),
    });
    fetchProjects();
  };

  // ── Bulk selection helpers ──
  const toggleAll = () => {
    if (selected.size === projects.length && projects.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(projects.map((p) => p.id)));
    }
  };
  const toggleOne = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const runBulk = useCallback(async (action: string, value?: string) => {
    if (selected.size === 0) return;
    if (!confirm(`Применить "${action}" к ${selected.size} проектам?`)) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/projects/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected), action, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`Обновлено: ${data.updated} проектов`);
      clearSelection();
      fetchProjects();
    } catch (e) {
      alert('Ошибка: ' + (e instanceof Error ? e.message : 'unknown'));
    } finally {
      setBulkLoading(false);
    }
  }, [selected, fetchProjects]);

  const exportCsv = () => {
    const params = new URLSearchParams({ type: 'projects' });
    if (status) params.set('status', status);
    if (basin) params.set('basin', basin);
    window.open(`/api/admin/export?${params}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Проекты</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Всего: {total}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select
            value={basin}
            onChange={(e) => { setBasin(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            title="Фильтр по бассейну"
          >
            <option value="">Все бассейны</option>
            {waterBasinValues.map((b) => (
              <option key={b} value={b}>{basinLabels[b]}</option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-medium flex items-center gap-1.5"
            title="Скачать CSV (с учётом текущих фильтров)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">Проектов нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={projects.length > 0 && selected.size === projects.length}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 accent-[#0284C7] cursor-pointer"
                      title="Выделить все"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Проект</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Учитель</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Школа</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Тип</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Источник</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Бассейн</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Тема</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Голоса</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Оценка</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Статус</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Смена статуса</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Витрина Qazsu</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors ${
                      selected.has(p.id) ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleOne(p.id)}
                        className="w-3.5 h-3.5 accent-[#0284C7] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <Link href={`/projects/${p.id}`} target="_blank"
                        className="font-medium text-slate-700 hover:text-blue-600 truncate block">
                        {p.title}
                      </Link>
                      {p.studentName && (
                        <p className="text-[11px] text-slate-400 truncate">Ученик: {p.studentName}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {p.teacherName || p.author?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{p.schoolName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                        {typeLabels[p.type] || p.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.sourceSystem === 'QAZSU' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F9FF] text-[#0284C7]">
                          Qazsu
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <select
                        value={p.basin ?? ''}
                        onChange={(e) => updateQazsuMeta(p.id, 'basin', e.target.value)}
                        className="text-[11px] bg-white border border-[#E2E8F0] rounded px-1.5 py-1 max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        title="Изменить бассейн"
                      >
                        <option value="">—</option>
                        {waterBasinValues.map((b) => (
                          <option key={b} value={b}>{basinLabels[b]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <select
                        value={p.problemType ?? ''}
                        onChange={(e) => updateQazsuMeta(p.id, 'problemType', e.target.value)}
                        className="text-[11px] bg-white border border-[#E2E8F0] rounded px-1.5 py-1 max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        title="Изменить тему"
                      >
                        <option value="">—</option>
                        {waterProblemValues.map((p) => (
                          <option key={p} value={p}>{problemLabels[p]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{p._count.votes}</td>
                    <td className="px-4 py-3 text-[#F59E0B] font-bold">
                      {p.juryScore != null ? `${p.juryScore}/10` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusMap[p.status]?.color || 'bg-slate-50 text-slate-600'}`}>
                        {statusMap[p.status]?.label || p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={(e) => changeStatus(p.id, e.target.value)}
                        className="text-[12px] bg-white border border-[#E2E8F0] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {['APPROVED', 'WINNER'].includes(p.status) ? (
                        <button
                          onClick={() => togglePublishToQazsu(p.id, !p.publishToQazsu)}
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                            p.publishToQazsu
                              ? 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={p.publishToQazsu ? 'Скрыть из витрины Qazsu' : 'Опубликовать в витрине Qazsu'}
                        >
                          {p.publishToQazsu ? 'В витрине' : 'Опубликовать'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-slate-500">Страница {page} из {totalPages}</p>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
                Назад
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">
                Далее
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white border border-[#0284C7] rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 flex-wrap max-w-[95vw]">
          <span className="text-[13px] font-semibold text-[#0F172A]">
            Выбрано: <span className="text-[#0284C7]">{selected.size}</span>
          </span>
          <div className="h-6 w-px bg-slate-200" />
          <button onClick={() => runBulk('approve')} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-[12px] font-medium hover:bg-green-100 disabled:opacity-50">
            ✓ Одобрить
          </button>
          <button onClick={() => runBulk('reject')} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-[12px] font-medium hover:bg-red-100 disabled:opacity-50">
            ✗ Отклонить
          </button>
          <button onClick={() => runBulk('mark_winner')} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[12px] font-medium hover:bg-amber-100 disabled:opacity-50">
            🏆 Победитель
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <button onClick={() => runBulk('publish')} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg bg-[#F0F9FF] text-[#0284C7] text-[12px] font-medium hover:bg-[#E0F2FE] disabled:opacity-50">
            📤 В витрину
          </button>
          <button onClick={() => runBulk('unpublish')} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[12px] font-medium hover:bg-slate-200 disabled:opacity-50">
            ↩ Скрыть
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <select
            disabled={bulkLoading}
            onChange={(e) => { if (e.target.value) { runBulk('set_basin', e.target.value); e.target.value=''; } }}
            className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] bg-white"
            title="Назначить бассейн"
            defaultValue=""
          >
            <option value="">↘ Бассейн</option>
            {waterBasinValues.map((b) => <option key={b} value={b}>{basinLabels[b]}</option>)}
          </select>
          <select
            disabled={bulkLoading}
            onChange={(e) => { if (e.target.value) { runBulk('set_problem', e.target.value); e.target.value=''; } }}
            className="h-8 px-2 rounded-lg border border-[#E2E8F0] text-[12px] bg-white"
            title="Назначить тему"
            defaultValue=""
          >
            <option value="">↘ Тема</option>
            {waterProblemValues.map((p) => <option key={p} value={p}>{problemLabels[p]}</option>)}
          </select>
          <div className="h-6 w-px bg-slate-200" />
          <button onClick={clearSelection} disabled={bulkLoading}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-500 hover:bg-slate-100">
            Снять выделение
          </button>
        </div>
      )}
    </div>
  );
}
