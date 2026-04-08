'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type ProjectStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WINNER';
type ProjectType = 'VIDEO' | 'RESEARCH' | 'ART' | 'INVENTION' | 'APP' | 'OTHER';

interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  region: string;
  schoolName: string;
  teacherName: string;
  studentName?: string | null;
  grade: number;
  juryScore?: number | null;
  juryComment?: string | null;
  createdAt: string;
  _count: { votes: number };
}

interface MeUser {
  id: string;
  phone: string;
  name?: string | null;
  role: string;
  consentSms: boolean;
  createdAt: string;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PENDING: { label: 'На рассмотрении', className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  APPROVED: { label: 'Одобрено', className: 'bg-green-100 text-green-700 border border-green-200' },
  REJECTED: { label: 'Отклонено', className: 'bg-red-100 text-red-700 border border-red-200' },
  WINNER: { label: 'Победитель', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
};

const typeLabels: Record<ProjectType, string> = {
  VIDEO: 'Видео',
  RESEARCH: 'Исследование',
  ART: 'Творчество',
  INVENTION: 'Изобретение',
  APP: 'Приложение',
  OTHER: 'Другое',
};

const roleLabels: Record<string, string> = {
  STUDENT: 'Ученик',
  TEACHER: 'Учитель',
  JURY: 'Жюри',
  ADMIN: 'Администратор',
};

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8F0]/60 p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-[#E2E8F0] rounded w-1/3 mb-3" />
      <div className="h-8 bg-[#E2E8F0] rounded w-1/2" />
    </div>
  );
}

export default function CabinetPage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data.user);
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-8 bg-[#E2E8F0] rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 animate-pulse h-48" />
      </div>
    );
  }

  if (unauthorized || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">Войдите в аккаунт</h2>
          <p className="text-[15px] text-[#64748B] mb-6">
            Войдите чтобы просматривать кабинет
          </p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
        setUser((u) => u ? { ...u, name: data.user.name } : u);
        setEditingName(false);
      }
    } catch { /* */ }
    setSavingName(false);
  };

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.status === 'PENDING').length,
    approved: projects.filter((p) => p.status === 'APPROVED').length,
    winners: projects.filter((p) => p.status === 'WINNER').length,
  };

  const statsCards = [
    { label: 'Всего заявок', value: stats.total, color: 'bg-[#E0F2FE] text-[#0284C7]' },
    { label: 'На рассмотрении', value: stats.pending, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Одобрено', value: stats.approved, color: 'bg-green-50 text-green-600' },
    { label: 'Победители', value: stats.winners, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Card hover={false} padding="lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                        className="h-8 px-2 rounded-lg border border-[#0284C7] text-[16px] font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 w-48"
                        placeholder="Ваше ФИО"
                      />
                      <button onClick={saveName} disabled={savingName}
                        className="text-[12px] px-3 py-1.5 bg-[#0284C7] text-white rounded-lg hover:bg-[#0369A1] disabled:opacity-50">
                        {savingName ? '...' : 'Сохранить'}
                      </button>
                      <button onClick={() => setEditingName(false)}
                        className="text-[12px] text-[#64748B] hover:text-[#0F172A]">Отмена</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-[20px] font-bold text-[#0F172A]">
                        {user.name || <span className="text-[#94A3B8]">Имя не указано</span>}
                      </h1>
                      <button
                        onClick={() => { setNameInput(user.name || ''); setEditingName(true); }}
                        className="p-1 rounded-md text-[#94A3B8] hover:text-[#0284C7] hover:bg-[#E0F2FE] transition-colors"
                        title="Редактировать имя"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">
                    {roleLabels[user.role] || user.role}
                  </span>
                </div>
                <p className="text-[14px] text-[#64748B] mt-0.5">{user.phone}</p>
                <p className="text-[12px] text-[#94A3B8] mt-0.5">
                  Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Link href="/submit">
              <Button size="sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Подать заявку
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <Card hover={false} padding="md">
              <p className="text-[12px] text-[#64748B] mb-1">{stat.label}</p>
              <p className={`text-[28px] font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Projects list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#0F172A]">Мои заявки</h2>
        </div>

        {projects.length === 0 ? (
          <Card hover={false} padding="lg">
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-[15px] text-[#0F172A] font-medium mb-1">Заявок пока нет</p>
              <p className="text-[13px] text-[#64748B] mb-5">
                Вы ещё не подавали заявки. Нажмите «Подать заявку»
              </p>
              <Link href="/submit">
                <Button size="sm">Подать заявку</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((project, i) => {
              const statusCfg = statusConfig[project.status];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <Card hover padding="md" className="cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* Title & badges */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                              {typeLabels[project.type]}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.className}`}>
                              {statusCfg.label}
                            </span>
                          </div>
                          <h3 className="text-[15px] font-semibold text-[#0F172A] truncate">
                            {project.title}
                          </h3>
                          {project.studentName && (
                            <p className="text-[12px] text-[#64748B] mt-0.5">
                              Ученик: {project.studentName}
                            </p>
                          )}
                          <p className="text-[12px] text-[#94A3B8] mt-0.5">
                            {project.schoolName} · {project.grade} класс
                          </p>
                        </div>

                        {/* Right side: metrics */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Votes */}
                          <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                              <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                            {project._count.votes}
                          </div>

                          {/* Jury score */}
                          {project.juryScore != null && (
                            <div className="flex items-center gap-1.5 text-[13px] text-[#F59E0B] font-semibold">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              {project.juryScore}/10
                            </div>
                          )}

                          {/* Date */}
                          <span className="text-[12px] text-[#94A3B8] hidden sm:block">
                            {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>

                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
