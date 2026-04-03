'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  fileUrl: string | null;
  photoCount: number | null;
  viewCount: number;
  createdAt: string;
}

const categoryMap: Record<string, { label: string; color: string }> = {
  NEWS: { label: 'Новость', color: 'bg-blue-50 text-blue-700' },
  REPORT: { label: 'Отчёт', color: 'bg-amber-50 text-amber-700' },
  PHOTO: { label: 'Фото', color: 'bg-green-50 text-green-700' },
  VIDEO: { label: 'Видео', color: 'bg-purple-50 text-purple-700' },
};

const categoryOptions = [
  { value: 'NEWS', label: 'Новость' },
  { value: 'REPORT', label: 'Отчёт' },
  { value: 'PHOTO', label: 'Фото' },
  { value: 'VIDEO', label: 'Видео' },
];

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // form state
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'NEWS',
    imageUrl: '',
    fileUrl: '',
    photoCount: '',
  });

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`/api/news?page=${page}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setNews(data.news);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCreate = async () => {
    if (!form.title || !form.content || !form.category) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        content: form.content,
        category: form.category,
      };
      if (form.imageUrl) payload.imageUrl = form.imageUrl;
      if (form.fileUrl) payload.fileUrl = form.fileUrl;
      if (form.photoCount) payload.photoCount = parseInt(form.photoCount);

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка создания');
      }
      setModalOpen(false);
      setForm({ title: '', content: '', category: 'NEWS', imageUrl: '', fileUrl: '', photoCount: '' });
      fetchNews();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления');
      setDeleteId(null);
      fetchNews();
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
            {[...Array(5)].map((_, i) => (
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
          <h1 className="text-xl font-bold text-[#0F172A]">Новости</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Всего: {total} новостей</p>
        </div>
        <Button size="md" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Создать новость
        </Button>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {news.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            Новостей пока нет. Нажмите &laquo;Создать новость&raquo; чтобы добавить первую.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-500">Заголовок</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Категория</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Просмотры</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Дата</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 max-w-[350px] truncate">
                      {item.title}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          categoryMap[item.category]?.color || 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {categoryMap[item.category]?.label || item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {item.viewCount}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDeleteId(item.id)}
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

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0]">
            <p className="text-[12px] text-slate-500">
              Страница {page} из {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Назад
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Далее
              </button>
            </div>
          </div>
        )}
      </div>

      {/* create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Создать новость">
        <div className="space-y-4">
          <Input
            label="Заголовок"
            placeholder="Введите заголовок новости"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Select
            label="Категория"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Textarea
            label="Содержание"
            placeholder="Текст новости..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <Input
            label="URL изображения"
            placeholder="https://... (необязательно)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <Input
            label="URL файла"
            placeholder="https://... (необязательно)"
            value={form.fileUrl}
            onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
          />
          {form.category === 'PHOTO' && (
            <Input
              label="Количество фото"
              type="number"
              placeholder="0"
              value={form.photoCount}
              onChange={(e) => setForm({ ...form, photoCount: e.target.value })}
            />
          )}
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
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">Удалить новость?</h3>
                <p className="text-[13px] text-slate-500 mb-5">
                  Это действие необратимо. Новость будет удалена из системы.
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
