'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import PageHeader from '@/components/layout/PageHeader';
import { regionLabels } from '@/lib/validators';
import { PROJECT_TYPES } from '@/lib/constants';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('jury');
  const tTypes = useTranslations('types');
  const tCommon = useTranslations('common');
  const tRegions = useTranslations('regions');

  const regionOptions = [
    { value: 'all', label: t('allRegions') },
    ...Object.entries(regionLabels).map(([value, label]) => ({ value, label: tRegions(value) || label })),
  ];

  const typeOptions = [
    { value: 'all', label: t('allTypes') },
    ...PROJECT_TYPES.map((pt) => ({ value: pt.value, label: tTypes(pt.value) })),
  ];

  const statusOptions = [
    { value: 'PENDING', label: t('statusPending') },
    { value: 'APPROVED', label: t('statusApproved') },
    { value: 'REJECTED', label: t('statusRejected') },
    { value: 'WINNER', label: t('statusWinner') },
  ];

  const [projects, setProjects] = useState<JuryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchProjects = useCallback(async (p = 1, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        status,
        ...(type !== 'all' && { type }),
        ...(region !== 'all' && { region }),
      });
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects((prev) => append ? [...prev, ...(data.projects || [])] : (data.projects || []));
      setTotalPages(data.pages ?? 1);
      setPage(p);
    } catch {
      // handle error
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, region, status]);

  useEffect(() => {
    setPage(1);
    fetchProjects(1, false);
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
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('pending'), value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: t('approved'), value: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('rejected'), value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
          { label: t('winners'), value: stats.winner, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <Card key={stat.label} hover={false} padding="md">
            <div className={`text-[28px] font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[13px] text-[#64748B] mt-1">{stat.label}</div>
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
              <div className="h-5 w-3/4 bg-[#E2E8F0] rounded mb-2" />
              <div className="h-4 w-1/2 bg-[#E2E8F0] rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[16px] text-[#64748B]">{t('noProjects')}</p>
        </div>
      ) : (
        <>
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
                        {tTypes(project.type)}
                      </Badge>
                      <Badge variant={statusToBadge[project.status] || 'pending'}>
                        {statusOptions.find(s => s.value === project.status)?.label || project.status}
                      </Badge>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A] truncate">
                      {project.title}
                    </h3>
                    <div className="text-[12px] text-[#64748B] mt-1">
                      {project.author?.name || tCommon('defaultAuthor')} · {tRegions(project.region) || regionLabels[project.region]} · {project.schoolName} · {project.grade} {tCommon('class')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {project.juryScore && (
                      <span className="text-[14px] font-bold text-[#F5A623]">{project.juryScore}/10</span>
                    )}
                    <span className="text-[13px] text-[#64748B]">{project._count.votes} {t('votes')}</span>
                    <Button size="sm" variant="secondary" onClick={() => openScoreModal(project)}>
                      {t('evaluate')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        {page < totalPages && (
          <div className="text-center mt-6">
            <Button variant="secondary" onClick={() => fetchProjects(page + 1, true)} loading={loadingMore}>
              Загрузить ещё
            </Button>
          </div>
        )}
        </>
      )}

      {/* Score Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('modalTitle')}>
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#0F172A] mb-1">{selectedProject.title}</h4>
              <p className="text-[13px] text-[#64748B] line-clamp-3">{selectedProject.description}</p>
            </div>

            {(selectedProject.fileUrl || selectedProject.videoUrl) && (
              <div className="flex gap-2">
                {selectedProject.fileUrl && (
                  <a href={selectedProject.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[#0284C7] hover:underline">
                    {t('openFile')}
                  </a>
                )}
                {selectedProject.videoUrl && (
                  <a href={selectedProject.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[#0284C7] hover:underline">
                    {t('watchVideo')}
                  </a>
                )}
              </div>
            )}

            <div>
              <label className="text-[13px] font-medium text-[#0F172A] block mb-1.5">
                {t('scoreLabel')}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-[44px] w-full px-3 rounded-lg border border-[#E2E8F0] text-[24px] font-bold text-center text-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              />
            </div>

            <Textarea
              label={t('commentLabel')}
              placeholder={t('commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Select
              label={t('statusLabel')}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: 'APPROVED', label: t('approve') },
                { value: 'REJECTED', label: t('reject') },
                { value: 'WINNER', label: t('winner') },
              ]}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button
                onClick={submitScore}
                loading={submitting}
                disabled={!score || !comment || comment.length < 10}
                className="flex-1"
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
