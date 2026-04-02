'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Badge, { getTypeLabel, getStatusLabel } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import PageHeader from '@/components/layout/PageHeader';
import { regionLabels } from '@/lib/validators';
import { PROJECT_TYPES } from '@/lib/constants';

const regionOptions = [
  { value: 'all', label: 'Все регионы' },
  ...Object.entries(regionLabels).map(([value, label]) => ({ value, label })),
];

const typeOptions = [
  { value: 'all', label: 'Все типы' },
  ...PROJECT_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

const statusOptions = [
  { value: 'PENDING', label: 'На модерации' },
  { value: 'APPROVED', label: 'Одобрённые' },
  { value: 'REJECTED', label: 'Отклонённые' },
  { value: 'WINNER', label: 'Победители' },
];

interface JuryProject {
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
  createdAt: string;
  author: { id: string; name: string | null };
  _count: { votes: number };
}

const typeToBadge: Record<string, 'video' | 'research' | 'art' | 'invention' | 'app' | 'other'> = {
  VIDEO: 'video', RESEARCH: 'research', ART: 'art',
  INVENTION: 'invention', APP: 'app', OTHER: 'other',
};

const statusToBadge: Record<string, 'pending' | 'approved' | 'rejected' | 'winner'> = {
  PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected', WINNER: 'winner',
};

export default function JuryPage() {
  const [projects, setProjects] = useState<JuryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');
  const [region, setRegion] = useState('all');
  const [status, setStatus] = useState('PENDING');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<JuryProject | null>(null);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState('APPROVED');
  const [submitting, setSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, winner: 0 });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        status,
        ...(type !== 'all' && { type }),
        ...(region !== 'all' && { region }),
      });
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects);
    } catch {
      // handle error
    }
    setLoading(false);
  }, [type, region, status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'WINNER'];
        const counts = await Promise.all(
          statuses.map(async (s) => {
            const res = await fetch(`/api/projects?status=${s}&page=1`);
            const data = await res.json();
            return { status: s, count: data.total };
          })
        );
        setStats({
          pending: counts.find(c => c.status === 'PENDING')?.count || 0,
          approved: counts.find(c => c.status === 'APPROVED')?.count || 0,
          rejected: counts.find(c => c.status === 'REJECTED')?.count || 0,
          winner: counts.find(c => c.status === 'WINNER')?.count || 0,
        });
      } catch {
        // handle error
      }
    };
    fetchStats();
  }, []);

  const openScoreModal = (project: JuryProject) => {
    setSelectedProject(project);
    setScore(project.juryScore?.toString() || '');
    setComment('');
    setNewStatus('APPROVED');
    setModalOpen(true);
  };

  const submitScore = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: parseInt(score),
          comment,
          status: newStatus,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchProjects();
      }
    } catch {
      // handle error
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Панель жюри"
        subtitle="Модерация и оценка проектов"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'На модерации', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Одобрено', value: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Отклонено', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Победители', value: stats.winner, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <Card key={stat.label} hover={false} padding="md">
            <div className={`text-[28px] font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[13px] text-[#5A7A6E] mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="w-40">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} />
        </div>
        <div className="w-40">
          <Select value={type} onChange={(e) => setType(e.target.value)} options={typeOptions} />
        </div>
        <div className="w-44">
          <Select value={region} onChange={(e) => setRegion(e.target.value)} options={regionOptions} />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-5 w-3/4 bg-[#E2EDE9] rounded mb-2" />
              <div className="h-4 w-1/2 bg-[#E2EDE9] rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[16px] text-[#5A7A6E]">Нет проектов для отображения</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover={false} padding="none">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={typeToBadge[project.type] || 'other'}>
                        {getTypeLabel(project.type)}
                      </Badge>
                      <Badge variant={statusToBadge[project.status] || 'pending'}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#111B17] truncate">
                      {project.title}
                    </h3>
                    <div className="text-[12px] text-[#5A7A6E] mt-1">
                      {project.author?.name || 'Автор'} · {regionLabels[project.region]} · {project.schoolName} · {project.grade} класс
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {project.juryScore && (
                      <span className="text-[14px] font-bold text-[#F5A623]">{project.juryScore}/10</span>
                    )}
                    <span className="text-[13px] text-[#5A7A6E]">{project._count.votes} голосов</span>
                    <Button size="sm" variant="secondary" onClick={() => openScoreModal(project)}>
                      Оценить
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Score Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Оценка проекта">
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#111B17] mb-1">{selectedProject.title}</h4>
              <p className="text-[13px] text-[#5A7A6E] line-clamp-3">{selectedProject.description}</p>
            </div>

            {(selectedProject.fileUrl || selectedProject.videoUrl) && (
              <div className="flex gap-2">
                {selectedProject.fileUrl && (
                  <a href={selectedProject.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[#1D9E75] hover:underline">
                    Открыть файл
                  </a>
                )}
                {selectedProject.videoUrl && (
                  <a href={selectedProject.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[#1D9E75] hover:underline">
                    Смотреть видео
                  </a>
                )}
              </div>
            )}

            <div>
              <label className="text-[13px] font-medium text-[#111B17] block mb-1.5">
                Оценка (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-[44px] w-full px-3 rounded-lg border border-[#E2EDE9] text-[24px] font-bold text-center text-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]"
              />
            </div>

            <Textarea
              label="Комментарий жюри"
              placeholder="Ваш комментарий к проекту..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Select
              label="Статус"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: 'APPROVED', label: 'Одобрить' },
                { value: 'REJECTED', label: 'Отклонить' },
                { value: 'WINNER', label: 'Победитель' },
              ]}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">
                Отмена
              </Button>
              <Button
                onClick={submitScore}
                loading={submitting}
                disabled={!score || !comment || comment.length < 10}
                className="flex-1"
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
