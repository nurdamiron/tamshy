'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Badge, { getTypeLabel, getStatusLabel } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { regionLabels } from '@/lib/validators';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  region: string;
  schoolName: string;
  grade: number;
  teacherName: string;
  fileUrl: string | null;
  videoUrl: string | null;
  juryScore: number | null;
  juryComment: string | null;
  createdAt: string;
  author: { id: string; name: string | null; phone: string };
  _count: { votes: number };
}

const typeToBadge: Record<string, 'video' | 'research' | 'art' | 'invention' | 'app' | 'other'> = {
  VIDEO: 'video', RESEARCH: 'research', ART: 'art',
  INVENTION: 'invention', APP: 'app', OTHER: 'other',
};

const statusToBadge: Record<string, 'pending' | 'approved' | 'rejected' | 'winner'> = {
  PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected', WINNER: 'winner',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        const data = await res.json();
        setProject(data.project);
        setVoteCount(data.project._count.votes);
      } catch {
        // handle error
      }
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  const handleVote = async () => {
    setVoting(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/vote`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setVoted(data.voted);
        setVoteCount(data.count);
      }
    } catch {
      // handle error
    }
    setVoting(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 bg-[#E2EDE9] rounded" />
          <div className="h-5 w-1/3 bg-[#E2EDE9] rounded" />
          <div className="h-40 bg-[#E2EDE9] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-[20px] font-semibold text-[#111B17]">Проект не найден</h2>
        <p className="text-[14px] text-[#5A7A6E] mt-2">Возможно, он был удалён или ещё не одобрен</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back */}
        <a href="/projects" className="inline-flex items-center gap-1 text-[13px] text-[#5A7A6E] hover:text-[#1D9E75] mb-6 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Все проекты
        </a>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={typeToBadge[project.type] || 'other'}>
            {getTypeLabel(project.type)}
          </Badge>
          <Badge variant={statusToBadge[project.status] || 'pending'}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] leading-tight mb-4">
          {project.title}
        </h1>

        {/* Meta info */}
        <Card hover={false} padding="md" className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
            <div>
              <span className="text-caption text-[#5A7A6E] block mb-1">Автор</span>
              <span className="text-[#111B17] font-medium">{project.author.name || 'Участник'}</span>
            </div>
            <div>
              <span className="text-caption text-[#5A7A6E] block mb-1">Школа</span>
              <span className="text-[#111B17] font-medium">{project.schoolName}</span>
            </div>
            <div>
              <span className="text-caption text-[#5A7A6E] block mb-1">Регион</span>
              <span className="text-[#111B17] font-medium">{regionLabels[project.region]}</span>
            </div>
            <div>
              <span className="text-caption text-[#5A7A6E] block mb-1">Класс</span>
              <span className="text-[#111B17] font-medium">{project.grade} класс</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#E2EDE9] text-[13px]">
            <span className="text-[#5A7A6E]">Учитель-куратор: </span>
            <span className="text-[#111B17] font-medium">{project.teacherName}</span>
          </div>
        </Card>

        {/* Description */}
        <div className="prose prose-sm max-w-none mb-6">
          <h3 className="text-[16px] font-semibold text-[#111B17] mb-3">Описание проекта</h3>
          <p className="text-[15px] text-[#111B17] leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* File */}
        {(project.fileUrl || project.videoUrl) && (
          <Card hover={false} padding="md" className="mb-6">
            <h3 className="text-[14px] font-semibold text-[#111B17] mb-3">Материалы проекта</h3>
            {project.fileUrl && (
              <a
                href={project.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F8FAF9] border border-[#E2EDE9] hover:border-[#1D9E75] transition-colors text-[14px] text-[#111B17]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Скачать файл
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F8FAF9] border border-[#E2EDE9] hover:border-[#1D9E75] transition-colors text-[14px] text-[#111B17] ml-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Смотреть видео
              </a>
            )}
          </Card>
        )}

        {/* Jury evaluation */}
        {project.juryScore && (
          <Card hover={false} padding="md" className="mb-6 border-l-4 border-l-[#F5A623]">
            <h3 className="text-[14px] font-semibold text-[#111B17] mb-2">Оценка жюри</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[28px] font-bold text-[#F5A623]">{project.juryScore}</span>
              <span className="text-[14px] text-[#5A7A6E]">/ 10</span>
            </div>
            {project.juryComment && (
              <p className="text-[14px] text-[#5A7A6E] italic">&quot;{project.juryComment}&quot;</p>
            )}
          </Card>
        )}

        {/* Vote button */}
        <div className="flex items-center gap-4 py-6 border-t border-[#E2EDE9]">
          <Button
            variant={voted ? 'primary' : 'secondary'}
            onClick={handleVote}
            loading={voting}
            className="min-w-[160px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {voted ? 'Вы проголосовали' : 'Голосовать'}
          </Button>
          <div className="text-center">
            <div className="text-[24px] font-bold text-[#1D9E75]">{voteCount}</div>
            <div className="text-[12px] text-[#5A7A6E]">голосов</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
