'use client';

import { useEffect, useState, useCallback } from 'react';
import { basinLabels, waterBasinValues, regionLabels } from '@/lib/validators';

type WaterObject = {
  id: string;
  name: string;
  nameKz: string | null;
  nameEn: string | null;
  basin: keyof typeof basinLabels;
  type: 'RIVER' | 'LAKE' | 'RESERVOIR' | 'CANAL' | 'GROUNDWATER' | 'GLACIER' | 'OTHER';
  region: string | null;
  description: string | null;
  qazsuUrl: string | null;
  _count: { projects: number };
};

const TYPE_LABELS: Record<WaterObject['type'], string> = {
  RIVER: 'Река', LAKE: 'Озеро', RESERVOIR: 'Водохр.',
  CANAL: 'Канал', GROUNDWATER: 'Подз.воды', GLACIER: 'Ледник', OTHER: 'Другое',
};

const TYPE_OPTIONS: WaterObject['type'][] = [
  'RIVER','LAKE','RESERVOIR','CANAL','GROUNDWATER','GLACIER','OTHER',
];

const emptyObj = (): Omit<WaterObject, '_count'> => ({
  id: '', name: '', nameKz: null, nameEn: null,
  basin: 'BALKHASH_ALAKOL', type: 'RIVER',
  region: null, description: null, qazsuUrl: null,
});

export default function AdminWaterObjects() {
  const [objects, setObjects] = useState<WaterObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [basin, setBasin] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Omit<WaterObject, '_count'> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (basin) params.set('basin', basin);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/water-objects?${params}`);
      const data = await res.json();
      setObjects(data.objects ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [basin, search]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const startNew = () => { setEditing(emptyObj()); setIsNew(true); setError(''); };
  const startEdit = (o: WaterObject) => {
    const { _count, ...rest } = o; void _count;
    setEditing(rest); setIsNew(false); setError('');
  };

  const save = async () => {
    if (!editing) return;
    setError('');
    const url = isNew
      ? '/api/admin/water-objects'
      : `/api/admin/water-objects?id=${encodeURIComponent(editing.id)}`;
    const method = isNew ? 'POST' : 'PATCH';
    // На PATCH не шлём id (в URL уже)
    const body = isNew ? editing : (() => {
      const { id, ...rest } = editing; void id;
      return rest;
    })();
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditing(null);
      fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const remove = async (id: string, projectCount: number) => {
    if (!confirm(`Удалить объект "${id}"?${projectCount > 0 ? `\n${projectCount} проектов потеряют привязку.` : ''}`)) return;
    await fetch(`/api/admin/water-objects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    fetchAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Водные объекты</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Всего: {objects.length}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или id..."
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <select
            value={basin} onChange={(e) => setBasin(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white"
          >
            <option value="">Все бассейны</option>
            {waterBasinValues.map((b) => <option key={b} value={b}>{basinLabels[b]}</option>)}
          </select>
          <button
            onClick={startNew}
            className="h-9 px-4 rounded-lg bg-[#0284C7] text-white text-[13px] font-semibold hover:bg-[#0369A1]"
          >+ Новый</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : objects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[13px]">Ничего не найдено</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-slate-500">ID</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Название</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Бассейн</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Тип</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Регион</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500">Проектов</th>
                <th className="px-4 py-2.5 font-semibold text-slate-500"></th>
              </tr>
            </thead>
            <tbody>
              {objects.map((o) => (
                <tr key={o.id} className="border-t border-[#E2E8F0] hover:bg-slate-50/60">
                  <td className="px-4 py-2 font-mono text-[11px] text-slate-500">{o.id}</td>
                  <td className="px-4 py-2 font-medium text-slate-700">
                    {o.name}
                    {o.nameKz && <span className="text-[11px] text-slate-400 ml-2">{o.nameKz}</span>}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{basinLabels[o.basin]}</td>
                  <td className="px-4 py-2"><span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">{TYPE_LABELS[o.type]}</span></td>
                  <td className="px-4 py-2 text-slate-500">{o.region ? regionLabels[o.region] ?? o.region : '—'}</td>
                  <td className="px-4 py-2 font-medium">{o._count.projects}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(o)} className="text-[12px] text-[#0284C7] hover:underline mr-3">Изменить</button>
                    <button onClick={() => remove(o.id, o._count.projects)} className="text-[12px] text-red-500 hover:underline">Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Модалка ред-я */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-bold">{isNew ? 'Новый объект' : `Редактирование: ${editing.id}`}</h2>
            </div>
            <div className="p-5 space-y-3">
              <Field label="ID (slug, латиница и дефис)">
                <input
                  type="text" value={editing.id} disabled={!isNew}
                  onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                  placeholder="ili-river"
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] disabled:bg-slate-50"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Название (RU)">
                  <input type="text" value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px]" />
                </Field>
                <Field label="Название (KZ)">
                  <input type="text" value={editing.nameKz ?? ''}
                    onChange={(e) => setEditing({ ...editing, nameKz: e.target.value || null })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px]" />
                </Field>
              </div>
              <Field label="Название (EN)">
                <input type="text" value={editing.nameEn ?? ''}
                  onChange={(e) => setEditing({ ...editing, nameEn: e.target.value || null })}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px]" />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Бассейн">
                  <select value={editing.basin}
                    onChange={(e) => setEditing({ ...editing, basin: e.target.value as keyof typeof basinLabels })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
                    {waterBasinValues.map((b) => <option key={b} value={b}>{basinLabels[b]}</option>)}
                  </select>
                </Field>
                <Field label="Тип">
                  <select value={editing.type}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value as WaterObject['type'] })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </Field>
                <Field label="Регион">
                  <select value={editing.region ?? ''}
                    onChange={(e) => setEditing({ ...editing, region: e.target.value || null })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] bg-white">
                    <option value="">—</option>
                    {Object.keys(regionLabels).map((r) => <option key={r} value={r}>{regionLabels[r]}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Описание (опционально)">
                <textarea value={editing.description ?? ''} rows={3}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px]" />
              </Field>
              <Field label="URL в Qazsu (deeplink)">
                <input type="url" value={editing.qazsuUrl ?? ''} placeholder="https://qazsu.gov.kz/#/object/..."
                  onChange={(e) => setEditing({ ...editing, qazsuUrl: e.target.value || null })}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px]" />
              </Field>

              {error && <p className="text-[12px] text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>}
            </div>
            <div className="p-5 border-t border-[#E2E8F0] flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-[13px] hover:bg-slate-200">Отмена</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-[13px] font-semibold hover:bg-[#0369A1]">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-slate-600 block mb-1">{label}</label>
      {children}
    </div>
  );
}
