import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';

// GET /api/admin/qazsu-stats
// Сводная аналитика интеграции Qazsu для админ-дашборда.
export async function GET() {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const [
      total,
      fromQazsu,
      withBasin,
      withProblem,
      withWaterObject,
      published,
      byBasin,
      byProblem,
      byRegion,
      bySource,
      byStatus,
      topWaterObjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { sourceSystem: 'QAZSU' } }),
      prisma.project.count({ where: { basin: { not: null } } }),
      prisma.project.count({ where: { problemType: { not: null } } }),
      prisma.project.count({ where: { waterObjectId: { not: null } } }),
      prisma.project.count({ where: { publishToQazsu: true } }),
      prisma.project.groupBy({
        by: ['basin'],
        where: { basin: { not: null } },
        _count: { _all: true },
      }),
      prisma.project.groupBy({
        by: ['problemType'],
        where: { problemType: { not: null } },
        _count: { _all: true },
      }),
      prisma.project.groupBy({
        by: ['region'],
        _count: { _all: true },
        orderBy: { _count: { region: 'desc' } },
        take: 10,
      }),
      prisma.project.groupBy({
        by: ['sourceSystem'],
        _count: { _all: true },
      }),
      prisma.project.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.project.groupBy({
        by: ['waterObjectId'],
        where: { waterObjectId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { waterObjectId: 'desc' } },
        take: 10,
      }),
    ]);

    // Подтянем имена top water objects одним запросом
    const ids = topWaterObjects.map((x) => x.waterObjectId).filter((x): x is string => !!x);
    const wos = ids.length
      ? await prisma.waterObject.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true, basin: true },
        })
      : [];
    const woMap = new Map(wos.map((w) => [w.id, w]));

    return NextResponse.json({
      totals: {
        total,
        fromQazsu,
        withBasin,
        withProblem,
        withWaterObject,
        published,
      },
      byBasin: byBasin.map((b) => ({ basin: b.basin, count: b._count._all })),
      byProblem: byProblem.map((p) => ({ problemType: p.problemType, count: p._count._all })),
      byRegion: byRegion.map((r) => ({ region: r.region, count: r._count._all })),
      bySource: bySource.map((s) => ({ source: s.sourceSystem, count: s._count._all })),
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      topWaterObjects: topWaterObjects.map((w) => ({
        id: w.waterObjectId,
        name: w.waterObjectId ? woMap.get(w.waterObjectId)?.name ?? w.waterObjectId : '',
        basin: w.waterObjectId ? woMap.get(w.waterObjectId)?.basin ?? null : null,
        count: w._count._all,
      })),
    });
  } catch (error) {
    console.error('Qazsu stats error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки статистики' }, { status: 500 });
  }
}
