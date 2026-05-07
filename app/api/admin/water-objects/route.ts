import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { waterBasinValues } from '@/lib/validators';

const REGIONS = [
  'ASTANA','ALMATY','SHYMKENT','AKTOBE','KARAGANDA','MANGYSTAU','TURKESTAN',
  'ZHAMBYL','ALMATY_REGION','ATYRAU','AKTAU','PAVLODAR','SEMEY','TALDYKORGAN',
  'KYZYLORDA','TARAZ','PETROPAVLOVSK','ORAL','KOSTANAY',
] as const;

const TYPES = ['RIVER','LAKE','RESERVOIR','CANAL','GROUNDWATER','GLACIER','OTHER'] as const;

const waterObjectSchema = z.object({
  id:          z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  name:        z.string().min(2).max(200),
  nameKz:      z.string().max(200).optional().nullable(),
  nameEn:      z.string().max(200).optional().nullable(),
  basin:       z.enum(waterBasinValues),
  type:        z.enum(TYPES),
  region:      z.enum(REGIONS).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  qazsuUrl:    z.string().url().max(500).optional().nullable(),
});

const updateSchema = waterObjectSchema.partial().omit({ id: true });

// GET /api/admin/water-objects?basin=&search=
export async function GET(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const basin = searchParams.get('basin');
  const search = searchParams.get('search');

  const where: Prisma.WaterObjectWhereInput = {};
  if (basin && (waterBasinValues as readonly string[]).includes(basin)) {
    where.basin = basin as Prisma.WaterObjectWhereInput['basin'];
  }
  if (search) {
    where.OR = [
      { name:   { contains: search, mode: 'insensitive' } },
      { nameKz: { contains: search, mode: 'insensitive' } },
      { id:     { contains: search, mode: 'insensitive' } },
    ];
  }

  const [objects, total] = await Promise.all([
    prisma.waterObject.findMany({
      where,
      orderBy: [{ basin: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { projects: true } } },
    }),
    prisma.waterObject.count({ where }),
  ]);
  return NextResponse.json({ objects, total });
}

// POST /api/admin/water-objects
export async function POST(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const result = waterObjectSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }
  const existing = await prisma.waterObject.findUnique({ where: { id: result.data.id } });
  if (existing) {
    return NextResponse.json({ error: 'ID уже существует' }, { status: 409 });
  }
  const obj = await prisma.waterObject.create({ data: result.data });
  return NextResponse.json({ object: obj }, { status: 201 });
}

// PATCH /api/admin/water-objects?id=...
export async function PATCH(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }
  const obj = await prisma.waterObject.update({ where: { id }, data: result.data })
    .catch(() => null);
  if (!obj) return NextResponse.json({ error: 'Объект не найден' }, { status: 404 });
  return NextResponse.json({ object: obj });
}

// DELETE /api/admin/water-objects?id=...
export async function DELETE(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Нет id' }, { status: 400 });

  // Защита: если есть проекты с этим объектом — сначала отвяжем их (set null)
  await prisma.project.updateMany({
    where: { waterObjectId: id },
    data: { waterObjectId: null },
  });
  await prisma.waterObject.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
