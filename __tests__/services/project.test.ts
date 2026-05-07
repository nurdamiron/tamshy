import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { toggleVote, createProject, scoreProject } from '@/lib/services/project';
import { ServiceError } from '@/lib/services/errors';
import type { ProjectStatus } from '@prisma/client';

const p = prisma as unknown as {
  project:      { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  vote:         { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

beforeEach(() => vi.clearAllMocks());

// ── toggleVote ────────────────────────────────────────────────────────────────
describe('toggleVote', () => {
  const projectId = 'proj-1';
  const userId    = 'user-1';

  it('throws NOT_FOUND when project does not exist', async () => {
    p.project.findUnique.mockResolvedValue(null);

    await expect(toggleVote(projectId, userId))
      .rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('throws BAD_REQUEST when project is PENDING', async () => {
    p.project.findUnique.mockResolvedValue({ id: projectId, status: 'PENDING', authorId: 'other' });

    await expect(toggleVote(projectId, userId))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Голосование недоступно' });
  });

  it('throws BAD_REQUEST when user votes on own project', async () => {
    p.project.findUnique.mockResolvedValue({ id: projectId, status: 'APPROVED', authorId: userId });

    await expect(toggleVote(projectId, userId))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Нельзя голосовать за свой проект' });
  });

  it('removes existing vote and returns voted=false', async () => {
    p.project.findUnique.mockResolvedValue({ id: projectId, status: 'APPROVED', authorId: 'other' });
    p.vote.findUnique.mockResolvedValue({ id: 'vote-1' });
    p.$transaction.mockResolvedValue([null, 4]);

    const result = await toggleVote(projectId, userId);

    expect(result).toEqual({ voted: false, count: 4 });
    expect(p.$transaction).toHaveBeenCalledOnce();
  });

  it('creates new vote and returns voted=true', async () => {
    p.project.findUnique.mockResolvedValue({ id: projectId, status: 'WINNER', authorId: 'other' });
    p.vote.findUnique.mockResolvedValue(null);
    p.$transaction.mockResolvedValue([null, 5]);

    const result = await toggleVote(projectId, userId);

    expect(result).toEqual({ voted: true, count: 5 });
    expect(p.$transaction).toHaveBeenCalledOnce();
  });
});

// ── createProject ─────────────────────────────────────────────────────────────
describe('createProject', () => {
  it('creates project with authorId injected', async () => {
    const data = {
      title: 'Тест', description: 'a'.repeat(100), type: 'RESEARCH' as const,
      schoolName: 'Школа', region: 'ASTANA' as const, teacherName: 'Учитель', grade: 8,
    };
    const created = { id: 'proj-new', ...data, authorId: 'user-1' };
    (p as unknown as { project: { findFirst: ReturnType<typeof vi.fn> } })
      .project.findFirst.mockResolvedValue(null);
    p.project.create.mockResolvedValue(created);

    const result = await createProject('user-1', data);

    expect(p.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ ...data, authorId: 'user-1' }),
    });
    expect(result).toEqual(created);
  });
});

// ── scoreProject ──────────────────────────────────────────────────────────────
describe('scoreProject', () => {
  const projectId = 'proj-1';
  const scoreData = { score: 8, comment: 'Хорошая работа', status: 'APPROVED' as ProjectStatus };

  it('throws NOT_FOUND when project does not exist', async () => {
    p.project.findUnique.mockResolvedValue(null);

    await expect(scoreProject(projectId, scoreData))
      .rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('updates project and returns it', async () => {
    const existing = {
      id: projectId,
      status: 'PENDING',
      author: { phone: '+77001234567', consentSms: false },
    };
    const updated = { id: projectId, ...scoreData };

    p.project.findUnique.mockResolvedValue(existing);
    p.project.update.mockResolvedValue(updated);

    const result = await scoreProject(projectId, scoreData);

    expect(p.project.update).toHaveBeenCalledWith({
      where: { id: projectId },
      data: { juryScore: 8, juryComment: 'Хорошая работа', status: 'APPROVED' },
    });
    expect(result).toEqual(updated);
  });

  it('sends SMS when status changes and consent given', async () => {
    const { sendNotification } = await import('@/lib/sms');
    const existing = {
      id: projectId,
      status: 'PENDING',
      author: { phone: '+77001234567', consentSms: true },
    };
    p.project.findUnique.mockResolvedValue(existing);
    p.project.update.mockResolvedValue({ id: projectId });

    await scoreProject(projectId, scoreData);

    // Ждём микротаски (.catch не блокирует)
    await new Promise((r) => setTimeout(r, 0));
    expect(sendNotification).toHaveBeenCalledWith('+77001234567', expect.stringContaining('одобрен'));
  });

  it('does NOT send SMS when consent is false', async () => {
    const { sendNotification } = await import('@/lib/sms');
    vi.clearAllMocks();
    const existing = {
      id: projectId,
      status: 'PENDING',
      author: { phone: '+77001234567', consentSms: false },
    };
    p.project.findUnique.mockResolvedValue(existing);
    p.project.update.mockResolvedValue({ id: projectId });

    await scoreProject(projectId, scoreData);
    await new Promise((r) => setTimeout(r, 0));

    expect(sendNotification).not.toHaveBeenCalled();
  });
});
