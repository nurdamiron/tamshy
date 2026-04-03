'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface Submission {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  institution: string;
  region: string;
  fileUrl: string | null;
  status: string;
  createdAt: string;
  contest: { title: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новая', color: 'bg-green-50 text-green-700 border-green-200' },
  REVIEWING: { label: 'На проверке', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ACCEPTED: { label: 'Принята', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  REJECTED: { label: 'Отклонена', color: 'bg-red-50 text-red-700 border-red-200' },
};

const statusOptions = [
  { value: 'NEW', label: 'Новая' },
  { value: 'REVIEWING', label: 'На проверке' },
  { value: 'ACCEPTED', label: 'Принята' },
  { value: 'REJECTED', label: 'Отклонена' },
];

const regionLabels: Record<string, string> = {
  ASTANA: 'Астана',
  ALMATY: 'Алматы',
  SHYMKENT: 'Шымкент',
  AKTOBE: 'Актобе',
  KARAGANDA: 'Караганда',
  MANGYSTAU: 'Мангистау',
  TURKESTAN: 'Туркестан',
  ZHAMBYL: 'Жамбыл',
  ALMATY_REGION: 'Алматинская обл.',
  ATYRAU: 'Атырау',
  AKTAU: 'Актау',
  PAVLODAR: 'Павлодар',
  SEMEY: 'Семей',
  TALDYKORGAN: 'Талдыкорган',
  KYZYLORDA: 'Кызылорда',
  TARAZ: 'Тараз',
  PETROPAVLOVSK: 'Петропавловск',
  ORAL: 'Орал',
  KOSTANAY: 'Костанай',
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const downloadCSV = () => {
    const filtered = filteredSubmissions;
    const headers = ['ID', 'ФИО', 'Конкурс', 'Email', 'Телефон', 'Регион', 'Статус', 'Дата'];
    const rows = filtered.map((s) => [
      s.id,
      s.fullName,
      s.contest.title,
      s.email,
      s.phone,
      regionLabels[s.region] || s.region,
      statusMap[s.status]?.label || s.status,
      new Date(s.createdAt).toLocaleDateString('ru-RU'),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = statusFilter
    ? submissions.filter((s) => s.status === statusFilter)
    : submissions;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-[13px] text-red-500 hover:text-red-700 underline">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Заявки</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Всего: {submissions.length} | Показано: {filteredSubmissions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* status filter */}
          <div className="flex items-center gap-1.5 bg-white rounded-lg border border-[#E2E8F0] p-1">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                !statusFilter ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Все
            </button>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button variant="secondary" size="sm" onClick={downloadCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Скачать в Excel
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            {statusFilter ? 'Нет заявок с этим статусом' : 'Заявок пока нет'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-500">ID</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">ФИО</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Конкурс</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Email</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Телефон</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Регион</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Статус</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Дата</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {sub.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                      {sub.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">
                      {sub.contest.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{sub.email}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{sub.phone}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {regionLabels[sub.region] || sub.region}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          statusMap[sub.status]?.color || 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {statusMap[sub.status]?.label || sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                        className="text-[12px] bg-white border border-[#E2E8F0] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
