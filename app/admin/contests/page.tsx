'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface Contest {
  id: string;
  title: string;
  type: string;
  description: string;
  rules: string | null;
  status: string;
  deadline: string;
  createdAt: string;
  _count: { submissions: number };
}

const statusMap: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Активный', color: 'bg-green-50 text-green-700' },
  COMPLETED: { label: 'Завершён', color: 'bg-slate-100 text-slate-600' },
};

const contestTypes = [
  { value: 'ВИДЕОКОНКУРС', label: 'Видеоконкурс' },
  { value: 'ЭССЕ', label: 'Эссе' },
  { value: 'ФОТОКОНКУРС', label: 'Фотоконкурс' },
  { value: 'ИССЛЕДОВАНИЕ', label: 'Исследование' },
  { value: 'ПРОЕКТ', label: 'Проект' },
];

export default function AdminContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState({
    title: '',
    type: 'ВИДЕОКОНКУРС',
    description: '',
    rules: '',
    deadline: '',
  });

  const fetchContests = useCallback(async () => {
    try {
      const res = await fetch('/api/contests');
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setContests(data.contests);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.deadline) return;
    setSaving(true);
    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка создания');
      }
      setModalOpen(false);
      setForm({ title: '', type: 'ВИДЕОКОНКУРС', description: '', rules: '', deadline: '' });
      fetchContests();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contests/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления');
      setDeleteId(null);
      fetchContests();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const handleStatusToggle = async (id: string, current: string) => {
    const newStatus = current === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/contests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      fetchContests();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Конкурсы</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Управление конкурсами платформы</p>
        </div>
        <Button size="md" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Создать конкурс
        </Button>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {contests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            Конкурсов пока нет. Нажмите &laquo;Создать конкурс&raquo; чтобы добавить первый.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-500">ID</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Название</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Тип</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Дедлайн</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Статус</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Заявок</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest, i) => (
                  <motion.tr
                    key={contest.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">
                      {contest.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700 max-w-[250px] truncate">
                      {contest.title}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{contest.type}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(contest.deadline).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleStatusToggle(contest.id, contest.status)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium cursor-pointer transition-colors hover:opacity-80 ${
                          statusMap[contest.status]?.color || 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {statusMap[contest.status]?.label || contest.status}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium">
                      {contest._count.submissions}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDeleteId(contest.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Удалить"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Создать конкурс">
        <div className="space-y-4">
          <Input
            label="Название"
            placeholder="Введите название конкурса"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Select
            label="Тип конкурса"
            options={contestTypes}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <Textarea
            label="Описание"
            placeholder="Описание конкурса..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Textarea
            label="Правила"
            placeholder="Правила конкурса (необязательно)"
            value={form.rules}
            onChange={(e) => setForm({ ...form, rules: e.target.value })}
          />
          <Input
            label="Дедлайн"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button size="md" loading={saving} onClick={handleCreate}>
              Создать
            </Button>
          </div>
        </div>
      </Modal>

      {/* delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">Удалить конкурс?</h3>
                <p className="text-[13px] text-slate-500 mb-5">
                  Это действие необратимо. Все заявки, связанные с конкурсом, тоже будут удалены.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" size="md" onClick={() => setDeleteId(null)}>
                    Отмена
                  </Button>
                  <Button variant="danger" size="md" onClick={() => handleDelete(deleteId)}>
                    Удалить
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
