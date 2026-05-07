import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const approvedFilter = { status: { in: ['APPROVED', 'WINNER'] as ('APPROVED' | 'WINNER')[] } };

    const [totalProjects, totalVotes, totalUsers, schoolGroups, regionStats, typeStats] =
      await Promise.all([
        prisma.project.count({ where: approvedFilter }),
        prisma.vote.count(),
        prisma.user.count(),
        // Уникальные школы — groupBy schoolName
        prisma.project.groupBy({ by: ['schoolName'], where: approvedFilter }),
        prisma.project.groupBy({ by: ['region'], _count: { id: true }, where: approvedFilter }),
        prisma.project.groupBy({ by: ['type'], _count: { id: true }, where: approvedFilter }),
      ]);

    return NextResponse.json(
      {
        totalProjects,
        totalVotes,
        totalUsers,
        totalSchools: schoolGroups.length,
        regionStats: regionStats.map((r) => ({ region: r.region, count: r._count.id })),
        typeStats:   typeStats.map((t)   => ({ type: t.type,     count: t._count.id })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
