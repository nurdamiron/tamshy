import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from '@/lib/auth';
import { checkRateLimit, formLimiter } from '@/lib/ratelimit';
import { contestSubmitSchema } from '@/lib/validators';
import { submitToContest } from '@/lib/services/contest';
import { ServiceError, HTTP_STATUS } from '@/lib/services/errors';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const blocked = await checkRateLimit(req, formLimiter);
    if (blocked) return blocked;

    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();
    const result = contestSubmitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const submission = await submitToContest(params.id, payload.userId, result.data);
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    console.error('Submit contest error:', error);
    return NextResponse.json({ error: 'Ошибка подачи заявки' }, { status: 500 });
  }
}
