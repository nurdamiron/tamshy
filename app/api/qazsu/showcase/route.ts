import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { waterBasinValues, waterProblemValues } from '@/lib/validators';

// GET /api/qazsu/showcase?basin=&problem=&region=&page=1
// Публичная витрина одобренных проектов с publishToQazsu=true.
// Не возвращает ПД учеников/учителей — только школу, регион, бассейн, объект.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;

  const basin = searchParams.get('basin');
  const problem = searchParams.get('problem');
  const region = searchParams.get('region');

  const where: Prisma.ProjectWhereInput = {
    publishToQazsu: true,
    status: { in: ['APPROVED', 'WINNER'] },
  };
  if (basin && (waterBasinValues as readonly string[]).includes(basin)) {
    where.basin = basin as Prisma.ProjectWhereInput['basin'];
  }
  if (problem && (waterProblemValues as readonly string[]).includes(problem)) {
    where.problemType = problem as Prisma.ProjectWhereInput['problemType'];
  }
  if (region) where.region = region as Prisma.ProjectWhereInput['region'];

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ status: 'asc' }, { publishedToQazsuAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        status: true,
        thumbnailUrl: true,
        videoUrl: true,
        region: true,
        basin: true,
        waterObjectId: true,
        problemType: true,
        schoolName: true,           // публично-разрешено
        publishedToQazsuAt: true,
        createdAt: true,
        waterObject: { select: { id: true, name: true, type: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json(
    { projects, total, pages: Math.ceil(total / perPage), page },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' } },
  );
}
