import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';
import { saveUploadLocal } from '@/lib/local-upload';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';
import { checkRateLimit, uploadLimiter } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

function s3UploadEnabled(): boolean {
  if (process.env.UPLOAD_LOCAL_ONLY === '1' || process.env.DISABLE_S3 === '1') return false;
  return !!process.env.AWS_ACCESS_KEY_ID?.trim();
}

/**
 * Определяет реальный MIME-тип по magic bytes буфера.
 * Не полагаемся на Content-Type из заголовка — он легко подделывается.
 */
function detectMimeFromBuffer(buf: Buffer): string | null {
  // PDF: %PDF → 25 50 44 46
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return 'application/pdf';
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return 'image/png';
  }
  // WebP: RIFF....WEBP (байты 0-3 = RIFF, байты 8-11 = WEBP)
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf.length > 11 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return 'image/webp';
  }
  // MP4 / MOV: имеют 'ftyp' box на offset 4
  if (
    buf.length > 8 &&
    buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70
  ) {
    // Различаем QuickTime (.mov) по бренду 'qt  '
    const brand = buf.slice(8, 12).toString('ascii');
    return brand === 'qt  ' ? 'video/quicktime' : 'video/mp4';
  }
  return null;
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

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const buffer = Buffer.from(await file.arrayBuffer());

    // Проверяем реальный тип по magic bytes (не доверяем Content-Type из запроса)
    const detectedMime = detectMimeFromBuffer(buffer);

    const ADMIN_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const isAdminImageUpload = payload.role === 'ADMIN' && detectedMime !== null && ADMIN_IMAGE_TYPES.includes(detectedMime);

    if (!detectedMime || (!ACCEPTED_FILE_TYPES.includes(detectedMime) && !isAdminImageUpload)) {
      return NextResponse.json({ error: 'Недопустимый тип файла' }, { status: 400 });
    }

    const s3Key = isAdminImageUpload
      ? `admin/${Date.now()}.${ext}`
      : `projects/${payload.userId}/${Date.now()}.${ext}`;

    const url = s3UploadEnabled()
      ? await uploadToS3(buffer, s3Key, detectedMime)
      : await saveUploadLocal(buffer, ext, payload.userId);

    return NextResponse.json({ url });
  } catch (error) {
    logger.error({ err: String(error) }, 'Upload error');
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
