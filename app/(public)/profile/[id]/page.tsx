'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PublicProject {
  id: string;
  title: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  studentName: string | null;
  createdAt: string;
  _count: { votes: number };
}

interface PublicUser {
  id: string;
  name: string | null;
  role: string;
  createdAt: string;
  projects: PublicProject[];
  _count: { projects: number };
}

// ── Config ────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; gradient: string }> = {
  STUDENT: { label: 'Оқушы',   color: 'bg-blue-50 text-blue-700 border border-blue-200',    gradient: 'from-blue-400 to-blue-600'   },
  TEACHER: { label: 'Мұғалім', color: 'bg-green-50 text-green-700 border border-green-200',  gradient: 'from-green-400 to-green-600' },
  JURY:    { label: 'Қазы',    color: 'bg-amber-50 text-amber-700 border border-amber-200',  gradient: 'from-amber-400 to-amber-600' },
  ADMIN:   { label: 'Әкімші',  color: 'bg-red-50 text-red-700 border border-red-200',        gradient: 'from-red-400 to-red-600'     },
};

const STATUS_MAP: Record<string, { label: string; dot: string }> = {
  APPROVED: { label: 'Мақұлданды', dot: 'bg-green-400' },
  WINNER:   { label: 'Жеңімпаз',  dot: 'bg-amber-400' },
};

const TYPE_MAP: Record<string, string> = {
  VIDEO: 'Бейне', RESEARCH: 'Зерттеу', ART: 'Өнер',
  INVENTION: 'Өнертабыс', APP: 'Қосымша', OTHER: 'Басқа',
};

function initials(name?: string | null) {
  if (!name?.trim()) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Page ──────────────────────────────────────────────

export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setNotFound(true); return; }
        setUser(data.user);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  // ── Loading ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#E2E8F0]" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-[#E2E8F0] rounded" />
              <div className="h-4 w-24 bg-[#E2E8F0] rounded" />
              <div className="h-3 w-36 bg-[#E2E8F0] rounded" />
            </div>
          </div>
        </div>
        {[1,2,3].map(i => <div key={i} className="h-20 bg-[#E2E8F0] rounded-2xl" />)}
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Пайдаланушы табылмады</h2>
        <p className="text-[14px] text-[#64748B] mb-6">Мұндай профиль жоқ немесе жойылған</p>
        <Link href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] text-white text-[14px] font-medium hover:bg-[#0369A1] transition-colors">
          Жобаларға оралу
        </Link>
      </div>
    );
  }

  const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.STUDENT;
  const winnerCount = user.projects.filter(p => p.status === 'WINNER').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="space-y-4">

        {/* ── Profile header ── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleCfg.gradient}
              flex items-center justify-center shrink-0 shadow-sm`}>
              <span className="text-[28px] font-bold text-white">{initials(user.name)}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-[22px] font-bold text-[#0F172A]">
                  {user.name || <span className="text-[#CBD5E1] font-normal">Аты-жөні жоқ</span>}
                </h1>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleCfg.color}`}>
                  {roleCfg.label}
                </span>
              </div>
              <p className="text-[13px] text-[#94A3B8]">
                Қатысушы:{' '}
                {new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Stats mini */}
            <div className="flex gap-6 sm:flex-col sm:gap-2 sm:text-right shrink-0">
              <div>
                <div className="text-[22px] font-bold text-[#0284C7] leading-none">{user._count.projects}</div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">жоба</div>
              </div>
              {winnerCount > 0 && (
                <div>
                  <div className="text-[22px] font-bold text-amber-500 leading-none">{winnerCount}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">жеңімпаз</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Projects ── */}
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A] mb-3 px-1">
            Жобалар
            {user.projects.length > 0 && (
              <span className="ml-2 text-[13px] font-normal text-[#94A3B8]">({user.projects.length})</span>
            )}
          </h2>

          {user.projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
              <p className="text-[14px] text-[#94A3B8]">Жарияланған жобалар жоқ</p>
            </div>
          ) : (
            <div className="space-y-2">
              {user.projects.map((project, i) => {
                const st = STATUS_MAP[project.status];
                return (
                  <motion.div key={project.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}>
                    <Link href={`/projects/${project.id}`}>
                      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4
                        hover:border-[#0284C7]/30 hover:shadow-sm transition-all group">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full
                                bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                                {TYPE_MAP[project.type] ?? project.type}
                              </span>
                              {st && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
                                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                  {st.label}
                                </span>
                              )}
                              {project.status === 'WINNER' && (
                                <span className="text-[11px] font-bold text-amber-500">
                                  Жеңімпаз
                                </span>
                              )}
                            </div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A] truncate
                              group-hover:text-[#0284C7] transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-[12px] text-[#94A3B8] mt-0.5">
                              {project.schoolName} · {project.grade} сынып
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                              </svg>
                              {project._count.votes}
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="#CBD5E1" strokeWidth="2"
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
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
