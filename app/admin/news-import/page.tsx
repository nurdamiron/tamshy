'use client';

import { useState } from 'react';
import Link from 'next/link';

type ExtractedMeta = {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
};

type Suggested = {
  title: string;
  content: string;
  imageUrl: string | null;
};

const CATEGORY_OPTIONS: { value: 'NEWS' | 'REPORT' | 'PHOTO' | 'VIDEO'; label: string }[] = [
  { value: 'NEWS', label: 'Новость' },
  { value: 'REPORT', label: 'Отчёт' },
  { value: 'PHOTO', label: 'Фото' },
  { value: 'VIDEO', label: 'Видео' },
];

export default function AdminNewsImport() {
  const [url, setUrl] = useState('');
  const [extracted, setExtracted] = useState<ExtractedMeta | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'NEWS' | 'REPORT' | 'PHOTO' | 'VIDEO'>('NEWS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ id: string; updated: boolean } | null>(null);

  const fetchPreview = async () => {
    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/news-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, mode: 'preview' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setExtracted(data.extracted);
      const sug: Suggested = data.suggested;
      setTitle(sug.title || '');
      setContent(sug.content || '');
      setImageUrl(sug.imageUrl || '');
      // авто-определение категории по URL
      if (/youtube|video|vimeo/i.test(url)) setCategory('VIDEO');
      else if (/instagram|gallery|photo/i.test(url)) setCategory('PHOTO');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/news-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url, mode: 'save', category,
          override: { title, content, imageUrl: imageUrl || undefined },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess({ id: data.news.id, updated: data.updated });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUrl(''); setExtracted(null);
    setTitle(''); setContent(''); setImageUrl('');
    setCategory('NEWS'); setSuccess(null); setError('');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Импорт новости по URL</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Вставь ссылку на новость (gov.kz, qazsu.gov.kz, Instagram, YouTube, любой публичный URL).
          Система попытается вытащить заголовок, описание и обложку из og:meta-тегов.
          Если сайт SPA или WAF блокирует — заполни поля вручную и сохрани.
        </p>
      </div>

      {/* Шаг 1: URL */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
        <label className="text-[13px] font-semibold text-[#0F172A]">Шаг 1. URL источника</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.gov.kz/memleket/entities/water/press/news/details/..."
            className="flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={fetchPreview}
            disabled={!url || loading}
            className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-[13px] font-semibold hover:bg-[#0369A1] disabled:opacity-50"
          >
            {loading ? '...' : 'Подтянуть'}
          </button>
        </div>
        {extracted && (
          <p className="text-[12px] text-slate-500">
            {extracted.title
              ? <>✓ og:title найден ({extracted.title.slice(0, 60)}{extracted.title.length > 60 ? '…' : ''})</>
              : <>⚠ og:title не найден — заполни вручную</>}
            {extracted.imageUrl ? ' · og:image найден' : ' · og:image не найден'}
            {extracted.siteName ? ` · site=${extracted.siteName}` : ''}
          </p>
        )}
      </div>

      {/* Шаг 2: Редактирование */}
      {(extracted || title || content) && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
          <label className="text-[13px] font-semibold text-[#0F172A]">Шаг 2. Проверь и отредактируй</label>

          <div>
            <label className="text-[12px] font-medium text-[#475569] block mb-1">Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Министерство объявило..."
              maxLength={290}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">{title.length}/290</p>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#475569] block mb-1">Содержание</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст новости. Минимум 10 символов."
              rows={8}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">{content.length} симв.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#475569] block mb-1">URL обложки</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#475569] block mb-1">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'NEWS' | 'REPORT' | 'PHOTO' | 'VIDEO')}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="max-h-40 rounded-lg border border-[#E2E8F0]" />
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={save}
              disabled={loading || title.length < 3 || content.length < 10}
              className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-[13px] font-semibold hover:bg-[#0369A1] disabled:opacity-50"
            >
              {loading ? 'Сохраняю...' : 'Сохранить как новость'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-[13px] font-medium hover:bg-slate-200"
            >
              Очистить
            </button>
          </div>
        </div>
      )}

      {/* Уведомления */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-700 flex items-center justify-between">
          <span>
            ✓ Новость {success.updated ? 'обновлена' : 'создана'} (id: <code>{success.id}</code>)
          </span>
          <Link href="/admin/news" className="font-semibold underline">Перейти к списку →</Link>
        </div>
      )}
    </div>
  );
}
