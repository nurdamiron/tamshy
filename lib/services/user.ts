import { prisma } from '@/lib/prisma';
import { ServiceError } from './errors';

const CABINET_PROJECTS_PER_PAGE = 10;

export async function getUserWithProjects(userId: string, page: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ServiceError('NOT_FOUND', 'Пользователь не найден');

  const [projects, totalProjects, statusGroups, contestSubmissions] = await Promise.all([
    prisma.project.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * CABINET_PROJECTS_PER_PAGE,
      take: CABINET_PROJECTS_PER_PAGE,
      include: { _count: { select: { votes: true } } },
    }),
    prisma.project.count({ where: { authorId: userId } }),
    prisma.project.groupBy({
      by: ['status'],
      where: { authorId: userId },
      _count: { _all: true },
    }),
    prisma.contestSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        contest: { select: { title: true, type: true, deadline: true } },
      },
    }),
  ]);

  const projectCounts = { PENDING: 0, APPROVED: 0, REJECTED: 0, WINNER: 0 };
  for (const g of statusGroups) {
    if (g.status in projectCounts) {
      projectCounts[g.status as keyof typeof projectCounts] = g._count._all;
    }
  }

  return {
    user,
    projects,
    totalProjects,
    projectCounts,
    projectPages: Math.ceil(totalProjects / CABINET_PROJECTS_PER_PAGE),
    projectPage: page,
    contestSubmissions,
  };
}

export async function updateUserName(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, name: true, email: true, role: true },
  });
}
