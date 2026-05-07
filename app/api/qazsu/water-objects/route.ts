import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { waterBasinValues } from '@/lib/validators';

// GET /api/qazsu/water-objects?basin=BALKHASH_ALAKOL&region=ALMATY_REGION&type=RIVER
// Справочник водных объектов. Поддерживает фильтрацию по бассейну/региону/типу.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const basin = searchParams.get('basin');
  const region = searchParams.get('region');
  const type = searchParams.get('type');

  const where: Prisma.WaterObjectWhereInput = {};
  if (basin && (waterBasinValues as readonly string[]).includes(basin)) {
    where.basin = basin as Prisma.WaterObjectWhereInput['basin'];
  }
  if (region) where.region = region as Prisma.WaterObjectWhereInput['region'];
  if (type) where.type = type as Prisma.WaterObjectWhereInput['type'];

  const objects = await prisma.waterObject.findMany({
    where,
    orderBy: [{ basin: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      nameKz: true,
      nameEn: true,
      basin: true,
      type: true,
      region: true,
      description: true,
      qazsuUrl: true,
    },
  });

  return NextResponse.json(
    { objects },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  );
}
