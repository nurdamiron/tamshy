import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalProjects, totalVotes, totalUsers, regionStats, typeStats] = await Promise.all([
      prisma.project.count({ where: { status: { in: ['APPROVED', 'WINNER'] } } }),
      prisma.vote.count(),
      prisma.user.count(),
      prisma.project.groupBy({
        by: ['region'],
        _count: { id: true },
        where: { status: { in: ['APPROVED', 'WINNER'] } },
      }),
      prisma.project.groupBy({
        by: ['type'],
        _count: { id: true },
        where: { status: { in: ['APPROVED', 'WINNER'] } },
      }),
    ]);

    return NextResponse.json({
      totalProjects,
      totalVotes,
      totalUsers,
      totalSchools: totalProjects, // approximate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      regionStats: regionStats.map((r: any) => ({
        region: r.region,
        count: r._count.id,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeStats: typeStats.map((t: any) => ({
        type: t.type,
        count: t._count.id,
      })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
