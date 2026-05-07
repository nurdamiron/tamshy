'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectEdit {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  studentName: string | null;
  grade: number;
  teamMembers: { name: string; grade: number }[] | null;
  status: string;
  authorId: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<ProjectEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notAllowed, setNotAllowed] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState([{ name: '', grade: '' }]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${params.id}`).then(r => r.json()),
      fetch('/api/me').then(r => r.ok ? r.json() : null),
    ]).then(([projectData, meData]) => {
      if (projectData.error) { setNotAllowed(true); return; }
      const p: ProjectEdit = projectData.project;

      // Только автор может редактировать, только статус PENDING
      if (!meData?.user || meData.user.id !== p.authorId || p.status !== 'PENDING') {
        setNotAllowed(true);
        return;
      }

      setProject(p);
      setTitle(p.title);
      setSummary(p.summary ?? '');
      setDescription(p.description);

      // Заполняем команду
      const lead = { name: p.studentName ?? '', grade: String(p.grade ?? '') };
      const extra = Array.isArray(p.teamMembers) ? p.teamMembers.map(m => ({ name: m.name, grade: String(m.grade) })) : [];
      setStudents([lead, ...extra]);
    }).catch(() => setNotAllowed(true))
    .finally(() => setLoading(false));
  }, [params.id]);

  const addStudent = () => setStudents(s => s.length < 5 ? [...s, { name: '', grade: '' }] : s);
  const removeStudent = (i: number) => setStudents(s => s.filter((_, idx) => idx !== i));
  const updateStudent = (i: number, field: 'name' | 'grade', val: string) =>
    setStudents(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st));

  const handleSave = async () => {
    if (!title.trim() || description.length < 100) return;
    setSaving(true);
    setError('');
    try {
      const lead = students[0];
      const extra = students.slice(1).filter(s => s.name.trim());

      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _teacherEdit: true,
          title: title.trim(),
          summary: summary.trim() || null,
          description,
          studentName: lead.name.trim(),
          grade: parseInt(lead.grade),
          teamMembers: extra.length > 0 ? extra.map(s => ({ name: s.name.trim(), grade: parseInt(s.grade) })) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/cabinet');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-8 w-40 bg-[#E2E8F0] rounded" />
        <div className="h-64 bg-[#E2E8F0] rounded-2xl" />
      </div>
    );
  }

  if (notAllowed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Рұқсат жоқ</h2>
        <p className="text-[14px] text-[#64748B] mb-6">
          Тек жоба авторы және «Қарастырылуда» мәртебесінде өзгертуге болады
        </p>
        <Link href="/cabinet"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] text-white text-[14px] font-medium hover:bg-[#0369A1] transition-colors">
          Кабинетке оралу
        </Link>
      </div>
    );
  }

  const canSave = title.trim().length >= 3 && description.length >= 100 &&
    students[0]?.name.trim().length >= 2 && !!students[0]?.grade;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back */}
        <Link href="/cabinet"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0284C7] mb-6 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Кабинет
        </Link>

        <h1 className="text-[24px] font-bold text-[#0F172A] mb-1">Жобаны өзгерту</h1>
        <p className="text-[14px] text-[#64748B] mb-6">
          Тек «Қарастырылуда» мәртебесіндегі жобаларды өзгертуге болады
        </p>

        <div className="space-y-5">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-[#0F172A]">Жоба туралы</h3>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Атауы</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                  focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] bg-[#FAFAFA] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Қысқаша аннотация
                <span className="ml-1.5 text-[11px] text-[#94A3B8] font-normal">міндетті емес</span>
              </label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                rows={2} maxLength={500} placeholder="2-3 сөйлем..."
                className="w-full px-3.5 py-3 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A]
                  focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] bg-[#FAFAFA]
                  transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Сипаттама
                <span className="ml-2 text-[11px] text-[#94A3B8]">{description.length}/5000</span>
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                rows={8} maxLength={5000}
                className="w-full px-3.5 py-3 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                  focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] bg-[#FAFAFA]
                  transition-all resize-none leading-relaxed"
              />
              {description.length < 100 && (
                <p className="text-[12px] text-[#F59E0B] mt-1">Кемінде 100 таңба · {description.length}/100</p>
              )}
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">
                Команда
                <span className="ml-1.5 text-[12px] font-normal text-[#94A3B8]">(1–5 оқушы)</span>
              </h3>
              {students.length < 5 && (
                <button onClick={addStudent} type="button"
                  className="flex items-center gap-1 text-[12px] font-medium text-[#0284C7] hover:text-[#0369A1] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Қосу
                </button>
              )}
            </div>

            <div className="space-y-2">
              {students.map((st, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-[12px] font-bold text-[#CBD5E1] w-5 text-center shrink-0">{i + 1}</span>
                  <input type="text" value={st.name} onChange={e => updateStudent(i, 'name', e.target.value)}
                    placeholder="Аты-жөні"
                    className="flex-1 h-10 px-3 rounded-xl border border-[#E2E8F0] text-[14px] text-[#0F172A]
                      focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] bg-[#FAFAFA]"
                  />
                  <select value={st.grade} onChange={e => updateStudent(i, 'grade', e.target.value)}
                    className="w-28 h-10 px-2 rounded-xl border border-[#E2E8F0] text-[13px] bg-[#FAFAFA]
                      focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] shrink-0">
                    <option value="">Сынып</option>
                    {Array.from({length: 11}, (_, k) => k + 1).map(g => (
                      <option key={g} value={g}>{g} сынып</option>
                    ))}
                  </select>
                  {students.length > 1 && (
                    <button onClick={() => removeStudent(i)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-[#CBD5E1]
                        hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/cabinet"
              className="flex-1 h-11 rounded-xl border border-[#E2E8F0] text-[14px] font-medium
                text-[#64748B] hover:bg-[#F8FAFC] transition-colors flex items-center justify-center">
              Болдырмау
            </Link>
            <button onClick={handleSave} disabled={!canSave || saving}
              className="flex-1 h-11 rounded-xl bg-[#0284C7] text-white text-[14px] font-semibold
                hover:bg-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                flex items-center justify-center gap-2">
              {saving && (
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {saving ? 'Сақталуда...' : 'Сақтау'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
