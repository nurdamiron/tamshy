import { prisma } from '@/lib/prisma';
import { ServiceError } from './errors';
import { sendProjectSubmittedEmail, sendProjectStatusEmail } from '@/lib/email';
import type { z } from 'zod';
import type { projectSchema } from '@/lib/validators';
import type { ProjectStatus, Prisma } from '@prisma/client';

export async function createProject(
  authorId: string,
  data: Omit<z.infer<typeof projectSchema>, 'students'> & {
    studentName?: string;
    grade: number;
    teamMembers?: { name: string; grade: number }[];
  },
) {
  const { students: _s, waterObjectId, basin, problemType, sourceSystem, ...rest } =
    data as typeof data & { students?: unknown };
  void _s;

  // Проверка дублей: тот же автор + то же название
  const duplicate = await prisma.project.findFirst({
    where: {
      authorId,
      title: { equals: data.title, mode: 'insensitive' },
    },
  });
  if (duplicate) {
    throw new ServiceError('CONFLICT', 'Проект с таким названием уже существует');
  }

  // Если указан waterObjectId — подтягиваем справочник и формируем snapshot.
  // Snapshot хранит контекст на момент подачи: переименование объекта в будущем
  // не сломает связь конкретной заявки с её темой.
  let qazsuSnapshot: Prisma.InputJsonValue | undefined;
  let resolvedBasin = basin ?? null;
  if (waterObjectId) {
    const wo = await prisma.waterObject.findUnique({ where: { id: waterObjectId } });
    if (!wo) {
      throw new ServiceError('BAD_REQUEST', 'Указанный водный объект не найден');
    }
    resolvedBasin = resolvedBasin ?? wo.basin;
    qazsuSnapshot = {
      waterObjectId: wo.id,
      name: wo.name,
      nameKz: wo.nameKz,
      basin: wo.basin,
      type: wo.type,
      region: wo.region,
      capturedAt: new Date().toISOString(),
    };
  }

  const project = await prisma.project.create({
    data: {
      ...rest,
      authorId,
      sourceSystem: sourceSystem ?? 'DIRECT',
      basin: resolvedBasin ?? undefined,
      waterObjectId: waterObjectId ?? undefined,
      problemType: problemType ?? undefined,
      qazsuSnapshot,
    },
  });

  // Email-подтверждение учителю (всегда, если есть email)
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: { email: true, name: true },
  });

  if (author?.email) {
    sendProjectSubmittedEmail({
      teacherEmail: author.email,
      teacherName: author.name,
      projectTitle: project.title,
      studentName: project.studentName,
      schoolName: project.schoolName,
    }).catch(() => {});
  }

  return project;
}

export async function toggleVote(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) throw new ServiceError('NOT_FOUND', 'Проект не найден');
  if (project.status !== 'APPROVED' && project.status !== 'WINNER') {
    throw new ServiceError('BAD_REQUEST', 'Голосование недоступно');
  }
  if (project.authorId === userId) {
    throw new ServiceError('BAD_REQUEST', 'Нельзя голосовать за свой проект');
  }

  const existing = await prisma.vote.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (existing) {
    const [, count] = await prisma.$transaction([
      prisma.vote.delete({ where: { id: existing.id } }),
      prisma.vote.count({ where: { projectId } }),
    ]);
    return { voted: false, count };
  }

  const [, count] = await prisma.$transaction([
    prisma.vote.create({ data: { projectId, userId } }),
    prisma.vote.count({ where: { projectId } }),
  ]);
  return { voted: true, count };
}

export async function scoreProject(
  projectId: string,
  data: { score: number; comment: string; status: ProjectStatus },
) {
  const existing = await prisma.project.findUnique({
    where: { id: projectId },
    include: { author: { select: { email: true, name: true } } },
  });

  if (!existing) throw new ServiceError('NOT_FOUND', 'Проект не найден');

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { juryScore: data.score, juryComment: data.comment, status: data.status },
  });

  // Уведомляем всегда при смене статуса (не только при consentEmail)
  if (
    existing.status !== data.status &&
    existing.author.email &&
    ['APPROVED', 'REJECTED', 'WINNER'].includes(data.status)
  ) {
    sendProjectStatusEmail({
      teacherEmail: existing.author.email,
      teacherName: existing.author.name,
      projectTitle: existing.title,
      status: data.status,
    }).catch(() => {});
  }

  return project;
}
