'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { regionLabels, basinLabels, problemLabels } from '@/lib/validators';
// Note: basinLabels/problemLabels imported only for type-checking the project field union types.
// Actual rendering uses t('basins.*') / t('problems.*') for i18n.

interface TeamMember { name: string; grade: number }

interface ProjectDetail {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  teacherName: string;
  studentName: string | null;
  teamMembers: TeamMember[] | null;
  fileUrl: string | null;
  videoUrl: string | null;
  juryScore: number | null;
  juryComment: string | null;
  createdAt: string;
  author: { id: string; name: string | null };
  _count: { votes: number };
  // Qazsu integration
  sourceSystem: 'DIRECT' | 'QAZSU' | 'PARTNER' | null;
  basin: keyof typeof basinLabels | null;
  problemType: keyof typeof problemLabels | null;
  qazsuRefUrl: string | null;
  waterObject: { id: string; name: string; nameKz: string | null; type: string; basin: string } | null;
}

// ── Config ────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
  PENDING:  { label: 'Қарастырылуда', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-400' },
  APPROVED: { label: 'Мақұлданды',    color: 'bg-green-50 text-green-700 border border-green-200',   dot: 'bg-green-400'  },
  REJECTED: { label: 'Қабылданбады', color: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-400'    },
  WINNER:   { label: 'Жеңімпаз',     color: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400'  },
};

const TYPE_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  VIDEO:     { label: 'Бейне',      color: 'text-blue-600 bg-blue-50',   icon: <polygon points="5 3 19 12 5 21 5 3"/> },
  RESEARCH:  { label: 'Зерттеу',    color: 'text-purple-600 bg-purple-50', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
  ART:       { label: 'Өнер',       color: 'text-amber-600 bg-amber-50',  icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></> },
  INVENTION: { label: 'Өнертабыс', color: 'text-orange-600 bg-orange-50', icon: <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.5 4.5 0 0012 3.5 4.5 4.5 0 007.5 11.5c.76.76 1.23 1.52 1.41 2.5"/></> },
  APP:       { label: 'Қосымша',    color: 'text-teal-600 bg-teal-50',   icon: <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></> },
  OTHER:     { label: 'Басқа',      color: 'text-slate-600 bg-slate-50', icon: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></> },
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide">{label}</span>
      <span className="text-[14px] font-medium text-[#0F172A] break-words" style={{ overflowWrap: 'anywhere' }}>
        {value}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────

export default function ProjectDetailPage() {
  const params = useParams();
  const tRegions = useTranslations('regions');
  const tD = useTranslations('projectDetail');
  const tQazsu = useTranslations('qazsu');
  const tBasins = useTranslations('basins');
  const tProblems = useTranslations('problems');

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${params.id}`).then(r => r.json()),
      fetch('/api/me').then(r => r.ok ? r.json() : null),
    ]).then(([projectData, meData]) => {
      if (projectData.error) { setNotFound(true); return; }
      setProject(projectData.project);
      setVoteCount(projectData.project._count.votes);
      setVoted(projectData.userVoted ?? false);
      if (meData?.user) {
        setIsLoggedIn(true);
        setIsOwner(meData.user.id === projectData.project.author.id);
      } else {
        setIsLoggedIn(false);
      }
    }).catch(() => setNotFound(true))
    .finally(() => setLoading(false));
  }, [params.id]);

  const handleVote = async () => {
    setVoting(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/vote`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) { setVoted(data.voted); setVoteCount(data.count); }
    } catch { /* */ }
    setVoting(false);
  };

  // ── Loading ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-5 w-24 bg-[#E2E8F0] rounded" />
        <div className="h-8 w-3/4 bg-[#E2E8F0] rounded" />
        <div className="h-4 w-1/2 bg-[#E2E8F0] rounded" />
        <div className="h-40 bg-[#E2E8F0] rounded-2xl" />
        <div className="h-32 bg-[#E2E8F0] rounded-2xl" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Жоба табылмады</h2>
        <p className="text-[14px] text-[#64748B] mb-6">Жоба жойылған немесе әлі мақұлданбаған</p>
        <Link href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] text-white text-[14px] font-medium hover:bg-[#0369A1] transition-colors">
          Барлық жобалар
        </Link>
      </div>
    );
  }

  const status = STATUS_MAP[project.status] ?? STATUS_MAP.PENDING;
  const typeMeta = TYPE_MAP[project.type] ?? TYPE_MAP.OTHER;
  const canVote = project.status === 'APPROVED' || project.status === 'WINNER';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

        {/* Back */}
        <Link href="/projects"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0284C7] mb-6 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Барлық жобалар
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5 min-w-0 overflow-hidden">

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Type badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${typeMeta.color}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {typeMeta.icon}
                  </svg>
                  {typeMeta.label}
                </span>
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                {/* Winner ribbon */}
                {project.status === 'WINNER' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Жеңімпаз
                  </span>
                )}
              </div>

              <h1 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] leading-tight mb-2 break-words"
                style={{ overflowWrap: 'anywhere' }}>
                {project.title}
              </h1>

              {project.studentName && (
                <p className="text-[14px] text-[#64748B]">
                  Оқушы: <span className="font-medium text-[#0F172A]">{project.studentName}</span>
                </p>
              )}
            </div>

            {/* Summary / Аннотация */}
            {project.summary && (
              <div className="bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] p-5">
                <h3 className="text-[13px] font-semibold text-[#0284C7] mb-2 uppercase tracking-wide">
                  Аннотация
                </h3>
                <p className="text-[15px] text-[#0F172A] leading-relaxed italic break-words"
                  style={{ overflowWrap: 'anywhere' }}>
                  {project.summary}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Жоба сипаттамасы
              </h3>
              <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-line break-words"
                style={{ overflowWrap: 'anywhere' }}>
                {project.description}
              </p>
            </div>

            {/* Files */}
            {(project.fileUrl || project.videoUrl) && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Материалдар
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.fileUrl && (
                    <a href={project.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC]
                        border border-[#E2E8F0] hover:border-[#0284C7] hover:bg-[#F0F9FF]
                        transition-all text-[13px] font-medium text-[#0F172A]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Файлды жүктеу
                    </a>
                  )}
                  {project.videoUrl && (
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC]
                        border border-[#E2E8F0] hover:border-[#0284C7] hover:bg-[#F0F9FF]
                        transition-all text-[13px] font-medium text-[#0F172A]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Бейнені қарау
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Jury evaluation */}
            {project.juryScore != null && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Қазылар бағасы
                </h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[40px] font-bold text-amber-500 leading-none">{project.juryScore}</span>
                  <span className="text-[18px] text-amber-400 font-medium">/10</span>
                </div>
                {/* Score bar */}
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                    style={{ width: `${project.juryScore * 10}%` }} />
                </div>
                {project.juryComment && (
                  <p className="text-[13px] text-[#64748B] italic leading-relaxed border-t border-amber-200 pt-3">
                    &ldquo;{project.juryComment}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Vote */}
            {canVote && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                {isLoggedIn === false ? (
                  /* Не залогинен → приглашение войти */
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">{tD('loginToVote')}</p>
                      <p className="text-[12px] text-[#94A3B8] mt-0.5">{tD('loginToVoteDesc')}</p>
                    </div>
                    <Link href="/login"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold
                        bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors shrink-0">
                      {tD('loginBtn')}
                    </Link>
                  </div>
                ) : isOwner ? (
                  /* Свой проект */
                  <p className="text-[14px] text-[#94A3B8] text-center py-1">{tD('ownProjectVote')}</p>
                ) : (
                  /* Голосование */
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">{tD('voteTitle')}</p>
                      <p className="text-[12px] text-[#94A3B8] mt-0.5">{tD('voteDesc')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-[26px] font-bold text-[#0284C7] leading-none">{voteCount}</div>
                        <div className="text-[11px] text-[#94A3B8]">{tD('votes')}</div>
                      </div>
                      <button onClick={handleVote} disabled={voting}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold
                          transition-all disabled:opacity-50
                          ${voted
                            ? 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                            : 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] hover:bg-[#E0F2FE]'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                          <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                        </svg>
                        {voting ? '...' : voted ? tD('votedBtn') : tD('voteBtn')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4 min-w-0">

            {/* Meta card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4">
              <h3 className="text-[13px] font-semibold text-[#94A3B8] uppercase tracking-wide">
                Жоба туралы
              </h3>

              <MetaRow label="Мұғалім"
                value={
                  <Link href={`/profile/${project.author.id}`}
                    className="text-[#0284C7] hover:underline">
                    {project.author.name || project.teacherName}
                  </Link>
                }
              />

              {/* Команда */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide">
                  Команда
                </span>
                <div className="space-y-1.5 mt-1">
                  {project.studentName && (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white text-[10px]
                        font-bold flex items-center justify-center shrink-0">1</span>
                      <span className="text-[13px] text-[#0F172A] font-medium break-words"
                        style={{ overflowWrap: 'anywhere' }}>
                        {project.studentName}
                        <span className="text-[#94A3B8] font-normal ml-1">· {project.grade} сынып</span>
                      </span>
                    </div>
                  )}
                  {Array.isArray(project.teamMembers) && project.teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#64748B] text-[10px]
                        font-bold flex items-center justify-center shrink-0">{i + 2}</span>
                      <span className="text-[13px] text-[#0F172A] break-words"
                        style={{ overflowWrap: 'anywhere' }}>
                        {m.name}
                        <span className="text-[#94A3B8] ml-1">· {m.grade} сынып</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <MetaRow label="Мектеп" value={project.schoolName} />
              <MetaRow label="Аймақ" value={tRegions(project.region) || regionLabels[project.region]} />
              <MetaRow label="Тапсырылды"
                value={new Date(project.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              />
            </div>

            {/* Qazsu context (sidebar) */}
            {(project.basin || project.problemType || project.waterObject || project.qazsuRefUrl) && (
              <div className="bg-white rounded-2xl border border-[#BAE6FD] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  <h3 className="text-[13px] font-semibold text-[#0284C7] uppercase tracking-wide">
                    {tQazsu('contextTitle')}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.basin && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F9FF] text-[#0284C7]">
                      {tBasins(project.basin)}
                    </span>
                  )}
                  {project.problemType && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                      {tProblems(project.problemType)}
                    </span>
                  )}
                </div>
                {project.waterObject && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide">
                      {tQazsu('waterObject')}
                    </span>
                    <span className="text-[14px] font-medium text-[#0F172A]">
                      {project.waterObject.nameKz || project.waterObject.name}
                    </span>
                  </div>
                )}
                {project.qazsuRefUrl && (
                  <a href={project.qazsuRefUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0284C7] hover:underline">
                    {tQazsu('openInQazsu')}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Votes widget (sidebar) */}
            {canVote && (
              <div className="bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] p-5 text-center">
                <div className="text-[36px] font-bold text-[#0284C7] leading-none">{voteCount}</div>
                <div className="text-[12px] text-[#64748B] mt-1">берілген дауыс</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
