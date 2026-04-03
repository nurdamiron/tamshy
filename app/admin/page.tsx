'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Stats {
  contests: number;
  submissions: { total: number; new: number; reviewing: number; accepted: number; rejected: number };
  materials: number;
  news: number;
  messages: number;
  subscribers: number;
}

interface Submission {
  id: string;
  fullName: string;
  status: string;
  createdAt: string;
  contest: { title: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новая', color: 'bg-green-50 text-green-700' },
  REVIEWING: { label: 'На проверке', color: 'bg-yellow-50 text-yellow-700' },
  ACCEPTED: { label: 'Принята', color: 'bg-blue-50 text-blue-700' },
  REJECTED: { label: 'Отклонена', color: 'bg-red-50 text-red-700' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, subsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/submissions'),
        ]);

        if (!statsRes.ok || !subsRes.ok) throw new Error('Ошибка загрузки');

        const statsData = await statsRes.json();
        const subsData = await subsRes.json();

        setStats(statsData);
        setSubmissions(subsData.submissions?.slice(0, 5) || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
          <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded" />
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
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-[13px] text-red-500 hover:text-red-700 underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: 'НОВЫЕ ЗАЯВКИ',
      value: stats?.submissions.new ?? 0,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" strokeLinecap="round" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
      ),
    },
    {
      label: 'АКТИВНЫЕ КОНКУРСЫ',
      value: stats?.contests ?? 0,
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
          <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" strokeLinecap="round" />
          <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" strokeLinecap="round" />
          <path d="M4 22h16" strokeLinecap="round" />
          <path d="M10 22V8a2 2 0 014 0v14" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'МАТЕРИАЛЫ',
      value: stats?.materials ?? 0,
      accent: 'text-green-600',
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'СИСТЕМА',
      value: 'Stable',
      accent: 'text-slate-600',
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* page title */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Дашборд</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Обзор системы Tamshy.kz</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {card.label}
              </p>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.accent}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* submissions table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Последние заявки</h2>
            <Link
              href="/admin/submissions"
              className="text-[12px] text-blue-600 hover:text-blue-700 font-medium"
            >
              Все заявки
            </Link>
          </div>
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-[13px]">
              Заявок пока нет
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-2.5 font-semibold text-slate-500">ID</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-500">Имя</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-500">Конкурс</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-500">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">
                        {sub.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-700">{sub.fullName}</td>
                      <td className="px-5 py-3 text-slate-500 max-w-[200px] truncate">
                        {sub.contest.title}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            statusMap[sub.status]?.color || 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {statusMap[sub.status]?.label || sub.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* quick stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4"
        >
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Статистика заявок</h2>
          <div className="space-y-3">
            {[
              { label: 'Всего', value: stats?.submissions.total ?? 0, color: 'bg-slate-500' },
              { label: 'Новых', value: stats?.submissions.new ?? 0, color: 'bg-green-500' },
              { label: 'На проверке', value: stats?.submissions.reviewing ?? 0, color: 'bg-yellow-500' },
              { label: 'Принято', value: stats?.submissions.accepted ?? 0, color: 'bg-blue-500' },
              { label: 'Отклонено', value: stats?.submissions.rejected ?? 0, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-[13px] text-slate-600">{item.label}</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-2">
            <h3 className="text-[13px] font-semibold text-slate-500">Быстрые ссылки</h3>
            {[
              { label: 'Новости', href: '/admin/news', count: stats?.news ?? 0 },
              { label: 'Сообщения', href: '/admin/messages', count: stats?.messages ?? 0 },
              { label: 'Подписчики', href: '/admin', count: stats?.subscribers ?? 0 },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between py-1.5 text-[13px] text-slate-600 hover:text-blue-600 transition-colors"
              >
                <span>{link.label}</span>
                <span className="font-medium">{link.count}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
