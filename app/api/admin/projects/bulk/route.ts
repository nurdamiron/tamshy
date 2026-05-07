import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ProjectStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import {
  waterBasinValues,
  waterProblemValues,
} from '@/lib/validators';

// POST /api/admin/projects/bulk
// body: { ids: string[], action: ..., value?: any }

const ACTIONS = [
  'approve',          // status → APPROVED
  'reject',           // status → REJECTED
  'mark_winner',      // status → WINNER
  'mark_pending',     // status → PENDING (откатить)
  'publish',          // publishToQazsu = true (только для APPROVED/WINNER)
  'unpublish',        // publishToQazsu = false
  'set_basin',        // value: WaterBasin
  'set_problem',      // value: WaterProblemType
  'clear_basin',      // basin = null
  'clear_problem',    // problemType = null
] as const;

const bodySchema = z.object({
  ids: z.array(z.string()).min(1).max(500),
  action: z.enum(ACTIONS),
  value: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { ids, action, value } = parsed.data;
  let updated = 0;

  switch (action) {
    case 'approve':       updated = await setStatus(ids, 'APPROVED'); break;
    case 'reject':        updated = await setStatus(ids, 'REJECTED'); break;
    case 'mark_winner':   updated = await setStatus(ids, 'WINNER'); break;
    case 'mark_pending':  updated = await setStatus(ids, 'PENDING'); break;

    case 'publish':       updated = await setPublishToQazsu(ids, true); break;
    case 'unpublish':     updated = await setPublishToQazsu(ids, false); break;

    case 'set_basin': {
      if (!value || !(waterBasinValues as readonly string[]).includes(value)) {
        return NextResponse.json({ error: 'Некорректный basin' }, { status: 400 });
      }
      const r = await prisma.project.updateMany({
        where: { id: { in: ids } },
        data: { basin: value as never },
      });
      updated = r.count;
      break;
    }
    case 'clear_basin': {
      const r = await prisma.project.updateMany({
        where: { id: { in: ids } },
        data: { basin: null },
      });
      updated = r.count;
      break;
    }
    case 'set_problem': {
      if (!value || !(waterProblemValues as readonly string[]).includes(value)) {
        return NextResponse.json({ error: 'Некорректный problemType' }, { status: 400 });
      }
      const r = await prisma.project.updateMany({
        where: { id: { in: ids } },
        data: { problemType: value as never },
      });
      updated = r.count;
      break;
    }
    case 'clear_problem': {
      const r = await prisma.project.updateMany({
        where: { id: { in: ids } },
        data: { problemType: null },
      });
      updated = r.count;
      break;
    }
  }

  return NextResponse.json({ updated, action });
}

async function setStatus(ids: string[], status: ProjectStatus): Promise<number> {
  const r = await prisma.project.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  return r.count;
}

async function setPublishToQazsu(ids: string[], publish: boolean): Promise<number> {
  // publishToQazsu разрешено только для APPROVED/WINNER — фильтруем здесь
  if (publish) {
    const r = await prisma.project.updateMany({
      where: {
        id: { in: ids },
        status: { in: ['APPROVED', 'WINNER'] },
      },
      data: {
        publishToQazsu: true,
        publishedToQazsuAt: new Date(),
      },
    });
    return r.count;
  } else {
    const r = await prisma.project.updateMany({
      where: { id: { in: ids } },
      data: {
        publishToQazsu: false,
        publishedToQazsuAt: null,
      },
    });
    return r.count;
  }
}
