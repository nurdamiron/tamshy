import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { toggleVote } from '@/lib/services/project';
import { ServiceError, HTTP_STATUS } from '@/lib/services/errors';
import { logger } from '@/lib/logger';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const result = await toggleVote(params.id, user.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    logger.error({ err: String(error), projectId: params.id }, 'Vote error');
    return NextResponse.json({ error: 'Ошибка голосования' }, { status: 500 });
  }
}
