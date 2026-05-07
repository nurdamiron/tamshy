import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload, getVerifiedPayload } from '@/lib/auth';
import { juryScoreSchema, adminScoreSchema } from '@/lib/validators';
import { scoreProject } from '@/lib/services/project';
import { ServiceError, HTTP_STATUS } from '@/lib/services/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await getTokenPayload();

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { votes: true } },
        waterObject: { select: { id: true, name: true, nameKz: true, type: true, basin: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
    }

    const isPublic = project.status === 'APPROVED' || project.status === 'WINNER';
    const isOwner = payload?.userId === project.authorId;
    const canSeeAll = payload && ['JURY', 'ADMIN'].includes(payload.role);

    if (!isPublic && !isOwner && !canSeeAll) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
    }

    // Проверяем голосовал ли текущий пользователь
    let userVoted = false;
    if (payload?.userId) {
      const vote = await prisma.vote.findUnique({
        where: { projectId_userId: { projectId: params.id, userId: payload.userId } },
      });
      userVoted = !!vote;
    }

    return NextResponse.json({ project, userVoted });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();

    // ── Редактирование учителем (только PENDING, только автор) ──
    if (body._teacherEdit === true) {
      const project = await prisma.project.findUnique({ where: { id: params.id } });
      if (!project) return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
      if (project.authorId !== payload.userId) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
      if (project.status !== 'PENDING') return NextResponse.json({ error: 'Нельзя редактировать после проверки' }, { status: 400 });

      const { _teacherEdit: _, ...fields } = body;
      const updated = await prisma.project.update({
        where: { id: params.id },
        data: {
          title: fields.title,
          summary: fields.summary ?? null,
          description: fields.description,
          studentName: fields.studentName || null,
          grade: fields.grade,
          teamMembers: fields.teamMembers ?? null,
        },
      });
      return NextResponse.json({ project: updated });
    }

    // ── Admin: переключение публикации в витрине Qazsu ──
    if (body._qazsuPublish !== undefined) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
      }
      const target = await prisma.project.findUnique({
        where: { id: params.id },
        select: { status: true },
      });
      if (!target) return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
      if (!['APPROVED', 'WINNER'].includes(target.status)) {
        return NextResponse.json(
          { error: 'Публиковать в Qazsu можно только одобренные проекты' },
          { status: 400 },
        );
      }
      const publish = Boolean(body._qazsuPublish);
      const project = await prisma.project.update({
        where: { id: params.id },
        data: {
          publishToQazsu: publish,
          publishedToQazsuAt: publish ? new Date() : null,
        },
      });
      return NextResponse.json({ project });
    }

    // ── Оценка жюри / администратора ──
    if (payload.role !== 'JURY' && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const schema = payload.role === 'ADMIN' ? adminScoreSchema : juryScoreSchema;
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const project = await scoreProject(params.id, result.data);
    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
