'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type ProjectStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WINNER';
type ProjectType = 'VIDEO' | 'RESEARCH' | 'ART' | 'INVENTION' | 'APP' | 'OTHER';
type SubmissionStatus = 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';

interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  schoolName: string;
  studentName?: string | null;
  grade: number;
  juryScore?: number | null;
  createdAt: string;
  _count: { votes: number };
}

interface ContestSubmission {
  id: string;
  fullName: string;
  status: SubmissionStatus;
  createdAt: string;
  contest: { title: string; type: string; deadline: string };
}

interface MeUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  consentEmail: boolean;
  createdAt: string;
}

interface ProjectCounts { PENDING: number; APPROVED: number; REJECTED: number; WINNER: number }

const ROLE_CONFIG: Record<string, { label: string; color: string; gradient: string }> = {
  STUDENT: { label: 'Оқушы',   color: 'bg-blue-50 text-blue-700 border border-blue-200',    gradient: 'from-blue-400 to-blue-600'   },
  TEACHER: { label: 'Мұғалім', color: 'bg-green-50 text-green-700 border border-green-200',  gradient: 'from-green-400 to-green-600' },
  JURY:    { label: 'Қазы',    color: 'bg-amber-50 text-amber-700 border border-amber-200',  gradient: 'from-amber-400 to-amber-600' },
  ADMIN:   { label: 'Әкімші',  color: 'bg-red-50 text-red-700 border border-red-200',        gradient: 'from-red-400 to-red-600'     },
};

const STATUS_CFG: Record<ProjectStatus, { labelKey: string; className: string }> = {
  PENDING:  { labelKey: 'statPending', className: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  APPROVED: { labelKey: 'statApproved', className: 'bg-green-50 text-green-700 border border-green-200'  },
  REJECTED: { labelKey: 'rejected',     className: 'bg-red-50 text-red-700 border border-red-200'       },
  WINNER:   { labelKey: 'statWinners',  className: 'bg-amber-50 text-amber-700 border border-amber-200' },
};

const TYPE_KEYS: Record<ProjectType, string> = {
  VIDEO: 'VIDEO', RESEARCH: 'RESEARCH', ART: 'ART',
  INVENTION: 'INVENTION', APP: 'APP', OTHER: 'OTHER',
};

function initials(name?: string | null, email?: string) {
  if (name?.trim()) return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (email?.[0] ?? '?').toUpperCase();
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[#E2E8F0] rounded animate-pulse ${className}`} />;
}

export default function CabinetPage() {
  const t = useTranslations('cabinet');
  const tTypes = useTranslations('types');
  const router = useRouter();

  const [user, setUser] = useState<MeUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contestSubmissions, setContestSubmissions] = useState<ContestSubmission[]>([]);
  const [projectCounts, setProjectCounts] = useState<ProjectCounts>({ PENDING: 0, APPROVED: 0, REJECTED: 0, WINNER: 0 });
  const [totalProjects, setTotalProjects] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'projects' | 'contests'>('projects');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchPage = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const res = await fetch(`/api/me?page=${p}`);
      if (res.status === 401) { setUnauthorized(true); return; }
      const data = await res.json();
      if (p === 1) {
        setUser(data.user);
        setContestSubmissions(data.contestSubmissions ?? []);
      }
      setProjectCounts(data.projectCounts ?? { PENDING: 0, APPROVED: 0, REJECTED: 0, WINNER: 0 });
      setTotalProjects(data.totalProjects ?? 0);
      setTotalPages(data.projectPages ?? 1);
      setProjects(prev => append ? [...prev, ...(data.projects || [])] : (data.projects || []));
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); setLoadingMore(false); }
  }, []);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(u => u ? { ...u, name: data.user.name } : u);
        setEditingName(false);
      }
    } catch { /* */ }
    setSavingName(false);
  };

  const logout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E2E8F0]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (unauthorized || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">{t('loginTitle')}</h2>
          <p className="text-[15px] text-[#64748B] mb-6">{t('loginDesc')}</p>
          <Link href="/login"><Button>{t('loginBtn')}</Button></Link>
        </motion.div>
      </div>
    );
  }

  const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.STUDENT;

  const stats = [
    { labelKey: 'statTotal',   value: totalProjects,         color: 'text-[#0284C7]' },
    { labelKey: 'statPending', value: projectCounts.PENDING,  color: 'text-yellow-600' },
    { labelKey: 'statApproved',value: projectCounts.APPROVED, color: 'text-green-600'  },
    { labelKey: 'statWinners', value: projectCounts.WINNER,   color: 'text-amber-600'  },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleCfg.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-[22px] font-bold text-white">{initials(user.name, user.email)}</span>
              </div>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input autoFocus value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                      className="h-8 px-2.5 rounded-lg border border-[#0284C7] text-[16px] font-semibold text-[#0F172A]
                        focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 w-52"
                      placeholder={t('namePlaceholder')}
                    />
                    <button onClick={saveName} disabled={savingName}
                      className="text-[12px] px-3 py-1.5 bg-[#0284C7] text-white rounded-lg hover:bg-[#0369A1] disabled:opacity-50 transition-colors">
                      {savingName ? '...' : t('save')}
                    </button>
                    <button onClick={() => setEditingName(false)}
                      className="text-[12px] text-[#94A3B8] hover:text-[#64748B] transition-colors">
                      {t('cancel')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-[20px] font-bold text-[#0F172A]">
                      {user.name || <span className="text-[#CBD5E1] font-normal">{t('noName')}</span>}
                    </h1>
                    <button onClick={() => { setNameInput(user.name || ''); setEditingName(true); }}
                      className="p-1 rounded-md text-[#CBD5E1] hover:text-[#0284C7] hover:bg-[#F0F9FF] transition-colors"
                      title={t('editTitle')}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                )}
                <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleCfg.color} mb-2`}>
                  {roleCfg.label}
                </span>
                <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {user.email}
                </div>
                <p className="text-[12px] text-[#94A3B8] mt-1">
                  {t('since')}{' '}
                  {new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
              {user.role === 'ADMIN' && (
                <Link href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                    bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  {t('adminPanel')}
                </Link>
              )}
              {user.role === 'JURY' && (
                <Link href="/jury"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                    bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {t('juryPanel')}
                </Link>
              )}
              <button onClick={logout} disabled={loggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                  text-[#94A3B8] border border-[#E2E8F0] hover:bg-red-50 hover:text-red-600
                  hover:border-red-200 transition-all disabled:opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {loggingOut ? '...' : t('logout')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.labelKey}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <p className="text-[12px] text-[#94A3B8] mb-1">{t(s.labelKey as Parameters<typeof t>[0])}</p>
              <p className={`text-[28px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + Projects */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
        {/* Tab switcher */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            <button onClick={() => setActiveTab('projects')}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}>
              {t('myProjects')}
              {totalProjects > 0 && (
                <span className="ml-1.5 text-[11px] text-[#94A3B8]">({totalProjects})</span>
              )}
            </button>
            <button onClick={() => setActiveTab('contests')}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === 'contests'
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}>
              Конкурстар
              {contestSubmissions.length > 0 && (
                <span className="ml-1.5 text-[11px] text-[#94A3B8]">({contestSubmissions.length})</span>
              )}
            </button>
          </div>
          <Link href="/submit"><Button size="sm">{t('submitBtn')}</Button></Link>
        </div>

        {/* Contest submissions tab */}
        {activeTab === 'contests' && (
          contestSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
              <p className="text-[14px] font-medium text-[#64748B] mb-1">Конкурстық өтінімдер жоқ</p>
              <p className="text-[13px] text-[#94A3B8] mb-4">Конкурстарға қатысып, жүлдеге ие болыңыз</p>
              <Link href="/contests"><Button size="sm">Конкурстарды көру</Button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {contestSubmissions.map((sub, i) => {
                const SUB_STATUS: Record<SubmissionStatus, { label: string; color: string }> = {
                  NEW:       { label: 'Жаңа',           color: 'bg-blue-50 text-blue-700 border border-blue-200'    },
                  REVIEWING: { label: 'Қарастырылуда',  color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
                  ACCEPTED:  { label: 'Қабылданды',     color: 'bg-green-50 text-green-700 border border-green-200'  },
                  REJECTED:  { label: 'Қабылданбады',   color: 'bg-red-50 text-red-700 border border-red-200'       },
                };
                const sc = SUB_STATUS[sub.status];
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}>
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                              {sub.contest.type}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>
                              {sc.label}
                            </span>
                          </div>
                          <h3 className="text-[14px] font-semibold text-[#0F172A] truncate">{sub.contest.title}</h3>
                          <p className="text-[12px] text-[#64748B] mt-0.5">{sub.fullName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px] text-[#94A3B8]">
                            {new Date(sub.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-[11px] text-[#CBD5E1] mt-0.5">
                            Дедлайн: {new Date(sub.contest.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'projects' && projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="text-[14px] font-medium text-[#64748B] mb-1">{t('noProjects')}</p>
            <p className="text-[13px] text-[#94A3B8] mb-4">{t('noProjectsDesc')}</p>
            <Link href="/submit"><Button size="sm">{t('submitBtn')}</Button></Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project, i) => {
              const sc = STATUS_CFG[project.status];
              return (
                <motion.div key={project.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 + i * 0.04 }}>
                  <Link href={`/projects/${project.id}`}>
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#0284C7]/30
                      hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                              {tTypes(TYPE_KEYS[project.type])}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.className}`}>
                              {t(sc.labelKey as Parameters<typeof t>[0])}
                            </span>
                          </div>
                          <h3 className="text-[14px] font-semibold text-[#0F172A] truncate group-hover:text-[#0284C7] transition-colors">
                            {project.title}
                          </h3>
                          {project.studentName && (
                            <p className="text-[12px] text-[#64748B] mt-0.5">{project.studentName}</p>
                          )}
                          <p className="text-[12px] text-[#94A3B8] mt-0.5">
                            {project.schoolName} · {t('grade', { grade: project.grade })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Редактировать — только PENDING */}
                          {project.status === 'PENDING' && (
                            <Link
                              href={`/projects/${project.id}/edit`}
                              onClick={e => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-[#0284C7] hover:bg-[#F0F9FF] transition-all"
                              title="Өзгерту"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </Link>
                          )}
                          <div className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                              <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                            </svg>
                            {project._count.votes}
                          </div>
                          {project.juryScore != null && (
                            <div className="flex items-center gap-1 text-[12px] font-semibold text-[#F59E0B]">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                              {project.juryScore}/10
                            </div>
                          )}
                          <span className="text-[12px] text-[#CBD5E1] hidden sm:block">
                            {new Date(project.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2"
                            className="group-hover:stroke-[#0284C7] transition-colors">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            {page < totalPages && (
              <div className="text-center pt-2">
                <Button variant="secondary" onClick={() => fetchPage(page + 1, true)} loading={loadingMore}>
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
