'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  phone: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { projects: number };
}

const ROLES = ['STUDENT', 'TEACHER', 'JURY', 'ADMIN'];
const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Ученик',
  TEACHER: 'Учитель',
  JURY: 'Жюри',
  ADMIN: 'Админ',
};
const ROLE_COLORS: Record<string, string> = {
  STUDENT: 'bg-blue-50 text-blue-700',
  TEACHER: 'bg-green-50 text-green-700',
  JURY: 'bg-amber-50 text-amber-700',
  ADMIN: 'bg-red-50 text-red-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch { /* */ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeRole = async (userId: string, role: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F172A]">Пользователи</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Всего: {total}</p>
        </div>
        <input
          type="text"
          placeholder="Поиск по имени или телефону..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-[280px] h-[40px] px-4 rounded-xl border border-[#E2E8F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Имя</th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Телефон</th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Роль</th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Проекты</th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Дата</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#E2E8F0]/50">
                  <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-[#F1F5F9] rounded animate-pulse" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[14px] text-[#94A3B8]">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[#E2E8F0]/50 hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[14px] font-medium text-[#0F172A]">
                      {user.name || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B] font-mono">
                    {user.phone}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg border-0 cursor-pointer ${ROLE_COLORS[user.role] || 'bg-gray-50 text-gray-700'}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">
                    {user._count.projects}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#94A3B8]">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]/50">
            <span className="text-[13px] text-[#94A3B8]">Стр. {page} из {pages}</span>
            <div className="flex gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                    p === page ? 'bg-[#3B82F6] text-white' : 'text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
