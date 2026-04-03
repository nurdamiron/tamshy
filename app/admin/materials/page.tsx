'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface Material {
  id: string;
  title: string;
  description: string;
  format: string;
  fileUrl: string;
  fileSize: string;
  imageUrl: string | null;
  type: string;
  audience: string;
  year: number;
  downloads: number;
  views: number;
  featured: boolean;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  METHODICAL: 'Методический',
  BOOKLET: 'Буклет',
  PRESENTATION: 'Презентация',
  VIDEO: 'Видео',
};

const audienceLabels: Record<string, string> = {
  SCHOOL: 'Школьники',
  STUDENT: 'Студенты',
  TEACHER: 'Учителя',
};

const typeOptions = [
  { value: 'METHODICAL', label: 'Методический' },
  { value: 'BOOKLET', label: 'Буклет' },
  { value: 'PRESENTATION', label: 'Презентация' },
  { value: 'VIDEO', label: 'Видео' },
];

const audienceOptions = [
  { value: 'SCHOOL', label: 'Школьники' },
  { value: 'STUDENT', label: 'Студенты' },
  { value: 'TEACHER', label: 'Учителя' },
];

const formatOptions = [
  { value: 'PDF', label: 'PDF' },
  { value: 'DOCX', label: 'DOCX' },
  { value: 'PPTX', label: 'PPTX' },
  { value: 'MP4', label: 'MP4' },
  { value: 'XLSX', label: 'XLSX' },
];

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
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
    description: '',
    format: 'PDF',
    fileUrl: '',
    fileSize: '',
    imageUrl: '',
    type: 'METHODICAL',
    audience: 'SCHOOL',
    year: new Date().getFullYear().toString(),
    featured: false,
  });

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch(`/api/materials?page=${page}&sort=new`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setMaterials(data.materials);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.fileUrl || !form.fileSize) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form, year: parseInt(form.year) };
      if (form.imageUrl.trim()) payload.imageUrl = form.imageUrl.trim();
      else delete payload.imageUrl;

      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка создания');
      }
      setModalOpen(false);
      setForm({
        title: '',
        description: '',
        format: 'PDF',
        fileUrl: '',
        fileSize: '',
        imageUrl: '',
        type: 'METHODICAL',
        audience: 'SCHOOL',
        year: new Date().getFullYear().toString(),
        featured: false,
      });
      fetchMaterials();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления');
      setDeleteId(null);
      fetchMaterials();
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
          <h1 className="text-xl font-bold text-[#0F172A]">Медиатека</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Всего: {total} материалов</p>
        </div>
        <Button size="md" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Добавить материал
        </Button>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {materials.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            Материалов пока нет. Нажмите &laquo;Добавить материал&raquo; чтобы добавить первый.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-slate-500 w-16">Обложка</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Название</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Формат</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Тип</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Аудитория</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Скачиваний</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Год</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat, i) => (
                  <motion.tr
                    key={mat.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-[#E2E8F0] hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3 align-middle">
                      {mat.imageUrl ? (
                        <img
                          src={mat.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700 max-w-[250px] truncate">
                      {mat.title}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                        {mat.format}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {typeLabels[mat.type] || mat.type}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {audienceLabels[mat.audience] || mat.audience}
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-medium">{mat.downloads}</td>
                    <td className="px-5 py-3 text-slate-500">{mat.year}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                          title="Скачать"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                        <button
                          onClick={() => setDeleteId(mat.id)}
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Добавить материал">
        <div className="space-y-4">
          <Input
            label="Название"
            placeholder="Введите название материала"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            label="Описание"
            placeholder="Описание материала..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Формат"
              options={formatOptions}
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
            />
            <Select
              label="Тип"
              options={typeOptions}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Аудитория"
              options={audienceOptions}
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            />
            <Input
              label="Год"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <Input
            label="URL обложки (превью на сайте)"
            placeholder="https://images.unsplash.com/... или ссылка после загрузки в S3"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <Input
            label="URL файла"
            placeholder="https://..."
            value={form.fileUrl}
            onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
          />
          <Input
            label="Размер файла"
            placeholder="2.5 MB"
            value={form.fileSize}
            onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
          />
          <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Избранный материал
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button size="md" loading={saving} onClick={handleCreate}>
              Добавить
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
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">Удалить материал?</h3>
                <p className="text-[13px] text-slate-500 mb-5">
                  Это действие необратимо. Файл будет удален из системы.
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
