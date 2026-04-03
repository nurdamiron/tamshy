import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';
import { saveUploadLocal } from '@/lib/local-upload';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';
import { checkRateLimit, uploadLimiter } from '@/lib/ratelimit';

function s3UploadEnabled(): boolean {
  if (process.env.UPLOAD_LOCAL_ONLY === '1' || process.env.DISABLE_S3 === '1') return false;
  return !!process.env.AWS_ACCESS_KEY_ID?.trim();
}

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, uploadLimiter);
    if (blocked) return blocked;

    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Файл слишком большой (макс 100МБ)' }, { status: 400 });
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Недопустимый тип файла' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const buffer = Buffer.from(await file.arrayBuffer());

    const url = s3UploadEnabled()
      ? await uploadToS3(buffer, `projects/${payload.userId}/${Date.now()}.${ext}`, file.type)
      : await saveUploadLocal(buffer, ext, payload.userId);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
