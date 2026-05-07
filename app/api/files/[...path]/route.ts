import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { getTokenPayload } from '@/lib/auth';

const UPLOADS_BASE = path.join(process.cwd(), '.uploads');

const MIME_BY_EXT: Record<string, string> = {
  pdf:  'application/pdf',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  mp4:  'video/mp4',
  mov:  'video/quicktime',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Любой файл требует авторизации
  const payload = await getTokenPayload();
  if (!payload) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  // Склеиваем сегменты пути
  const keyPath = params.path.join('/');

  // Файлы admin/ доступны только ADMIN
  if (keyPath.startsWith('admin/') && payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  // Защита от path traversal
  const fullPath = path.resolve(UPLOADS_BASE, keyPath);
  if (!fullPath.startsWith(UPLOADS_BASE + path.sep)) {
    return NextResponse.json({ error: 'Недопустимый путь' }, { status: 400 });
  }

  try {
    const buffer = await readFile(fullPath);
    const ext = path.extname(keyPath).slice(1).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${path.basename(keyPath)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
  }
}
