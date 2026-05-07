import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { submitToContest } from '@/lib/services/contest';

const p = prisma as unknown as {
  contest:           { findUnique: ReturnType<typeof vi.fn> };
  contestSubmission: { findFirst: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
};

beforeEach(() => vi.clearAllMocks());

const validData = {
  fullName:    'Жанар Сейткали',
  birthDate:   '2005-03-15',
  email:       'test@example.com',
  phone:       '+77771234567',
  institution: 'НИШ Алматы',
  region:      'ALMATY' as const,
};

describe('submitToContest', () => {
  const contestId = 'contest-1';
  const userId    = 'user-1';

  it('throws NOT_FOUND when contest does not exist', async () => {
    p.contest.findUnique.mockResolvedValue(null);

    await expect(submitToContest(contestId, userId, validData))
      .rejects.toMatchObject({ code: 'NOT_FOUND', message: 'Конкурс не найден' });
  });

  it('throws BAD_REQUEST when contest is COMPLETED', async () => {
    p.contest.findUnique.mockResolvedValue({
      id: contestId,
      status: 'COMPLETED',
      deadline: new Date(Date.now() + 86400_000),
    });

    await expect(submitToContest(contestId, userId, validData))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Конкурс завершён' });
  });

  it('throws BAD_REQUEST when deadline has passed', async () => {
    p.contest.findUnique.mockResolvedValue({
      id: contestId,
      status: 'ACTIVE',
      deadline: new Date(Date.now() - 1000), // в прошлом
    });

    await expect(submitToContest(contestId, userId, validData))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Срок подачи истёк' });
  });

  it('throws CONFLICT when user already submitted', async () => {
    p.contest.findUnique.mockResolvedValue({
      id: contestId,
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 86400_000),
    });
    p.contestSubmission.findFirst.mockResolvedValue({ id: 'sub-1' });

    await expect(submitToContest(contestId, userId, validData))
      .rejects.toMatchObject({ code: 'CONFLICT', message: 'Вы уже подали заявку на этот конкурс' });
  });

  it('creates submission when all checks pass', async () => {
    const contest = {
      id: contestId,
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 86400_000),
    };
    const created = { id: 'sub-new', contestId, userId, ...validData };

    p.contest.findUnique.mockResolvedValue(contest);
    p.contestSubmission.findFirst.mockResolvedValue(null);
    p.contestSubmission.create.mockResolvedValue(created);

    const result = await submitToContest(contestId, userId, validData);

    expect(p.contestSubmission.create).toHaveBeenCalledWith({
      data: { contestId, userId, ...validData },
    });
    expect(result).toEqual(created);
  });
});
