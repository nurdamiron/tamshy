import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from '@/lib/auth';
import { updateMeSchema } from '@/lib/validators';
import { getUserWithProjects, updateUserName } from '@/lib/services/user';
import { ServiceError, HTTP_STATUS } from '@/lib/services/errors';

export async function GET(req: NextRequest) {
  try {
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const data = await getUserWithProjects(payload.userId, page);

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        consentEmail: data.user.consentEmail,
        createdAt: data.user.createdAt,
      },
      projects: data.projects,
      totalProjects: data.totalProjects,
      projectCounts: data.projectCounts,
      projectPages: data.projectPages,
      projectPage: data.projectPage,
      contestSubmissions: data.contestSubmissions,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    console.error('Get me error:', error);
    return NextResponse.json({ error: 'Ошибка получения данных' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateMeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const user = await updateUserName(payload.userId, result.data.name);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    console.error('Update me error:', error);
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
