import { prisma } from '@/lib/prisma';
import { ServiceError } from './errors';
import { sendSubmissionNotification } from '@/lib/email';
import type { z } from 'zod';
import type { contestSubmitSchema } from '@/lib/validators';

export async function submitToContest(
  contestId: string,
  userId: string,
  data: z.infer<typeof contestSubmitSchema>,
) {
  const contest = await prisma.contest.findUnique({ where: { id: contestId } });

  if (!contest) throw new ServiceError('NOT_FOUND', 'Конкурс не найден');
  if (contest.status !== 'ACTIVE') throw new ServiceError('BAD_REQUEST', 'Конкурс завершён');
  if (new Date() > contest.deadline) throw new ServiceError('BAD_REQUEST', 'Срок подачи истёк');

  const duplicate = await prisma.contestSubmission.findFirst({
    where: { contestId, userId },
  });
  if (duplicate) throw new ServiceError('CONFLICT', 'Вы уже подали заявку на этот конкурс');

  const submission = await prisma.contestSubmission.create({
    data: { contestId, userId, ...data },
  });

  // Отправляем email асинхронно — не блокируем ответ при сбое
  sendSubmissionNotification({
    contestTitle: contest.title,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    institution: data.institution,
    region: data.region,
  }).catch((err) => console.error('[email] sendSubmissionNotification failed:', err));

  return submission;
}
