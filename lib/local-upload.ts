import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/** Сохраняет файл в public/uploads и возвращает публичный URL (без S3). */
export async function saveUploadLocal(
  buffer: Buffer,
  ext: string,
  userId: string
): Promise<string> {
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'bin';
  const dir = path.join(process.cwd(), 'public', 'uploads', userId);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;
  const fp = path.join(dir, name);
  await writeFile(fp, buffer);
  return `/uploads/${userId}/${name}`;
}
