import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';

// GET /api/admin/export?type=projects|submissions|water-objects|news[&filter=...]
// Возвращает CSV с правильными заголовками и UTF-8 BOM (для Excel).

const SUPPORTED_TYPES = ['projects', 'submissions', 'water-objects', 'news'] as const;
type ExportType = typeof SUPPORTED_TYPES[number];

export async function GET(req: NextRequest) {
  const payload = await getVerifiedPayload();
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const type = req.nextUrl.searchParams.get('type') as ExportType | null;
  if (!type || !SUPPORTED_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `type должен быть одним из: ${SUPPORTED_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  let csv: string;
  let filename: string;

  switch (type) {
    case 'projects':       ({ csv, filename } = await exportProjects(req)); break;
    case 'submissions':    ({ csv, filename } = await exportSubmissions(req)); break;
    case 'water-objects':  ({ csv, filename } = await exportWaterObjects()); break;
    case 'news':           ({ csv, filename } = await exportNews()); break;
  }

  // UTF-8 BOM для Excel + content-disposition для скачивания
  return new NextResponse('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

// ── Exports ─────────────────────────────────────────────────────────────────

async function exportProjects(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get('status');
  const basin = sp.get('basin');
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (basin) where.basin = basin;

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { votes: true } },
      waterObject: { select: { name: true } },
    },
  });

  const rows = projects.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    status: p.status,
    region: p.region,
    school: p.schoolName,
    teacher: p.teacherName,
    student: p.studentName ?? '',
    grade: p.grade,
    sourceSystem: p.sourceSystem,
    basin: p.basin ?? '',
    waterObject: p.waterObject?.name ?? '',
    problemType: p.problemType ?? '',
    publishToQazsu: p.publishToQazsu ? 'true' : 'false',
    juryScore: p.juryScore ?? '',
    votes: p._count.votes,
    createdAt: p.createdAt.toISOString(),
    authorEmail: p.author.email ?? '',
    fileUrl: p.fileUrl ?? '',
    videoUrl: p.videoUrl ?? '',
  }));

  return {
    csv: toCsv(rows),
    filename: `tamshy-projects-${todayStr()}.csv`,
  };
}

async function exportSubmissions(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get('status');
  const where = status ? { status: status as 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' } : {};

  const subs = await prisma.contestSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { contest: { select: { title: true } } },
  });

  const rows = subs.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    email: s.email,
    phone: s.phone,
    institution: s.institution,
    region: s.region,
    birthDate: s.birthDate,
    contest: s.contest.title,
    status: s.status,
    fileUrl: s.fileUrl ?? '',
    createdAt: s.createdAt.toISOString(),
  }));

  return {
    csv: toCsv(rows),
    filename: `tamshy-submissions-${todayStr()}.csv`,
  };
}

async function exportWaterObjects() {
  const objects = await prisma.waterObject.findMany({
    orderBy: [{ basin: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { projects: true } } },
  });

  const rows = objects.map((o) => ({
    id: o.id,
    name: o.name,
    nameKz: o.nameKz ?? '',
    nameEn: o.nameEn ?? '',
    basin: o.basin,
    type: o.type,
    region: o.region ?? '',
    description: o.description ?? '',
    qazsuUrl: o.qazsuUrl ?? '',
    projectsCount: o._count.projects,
  }));

  return {
    csv: toCsv(rows),
    filename: `tamshy-water-objects-${todayStr()}.csv`,
  };
}

async function exportNews() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const rows = news.map((n) => ({
    id: n.id,
    title: n.title,
    category: n.category,
    viewCount: n.viewCount,
    imageUrl: n.imageUrl ?? '',
    fileUrl: n.fileUrl ?? '',
    createdAt: n.createdAt.toISOString(),
    contentLength: n.content.length,
  }));

  return {
    csv: toCsv(rows),
    filename: `tamshy-news-${todayStr()}.csv`,
  };
}

// ── CSV helpers ─────────────────────────────────────────────────────────────

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','));
  }
  return lines.join('\r\n');
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // Если есть запятая, кавычка или перенос — оборачиваем в кавычки и экранируем кавычки удвоением
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
