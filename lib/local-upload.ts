import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOADS_BASE = path.join(process.cwd(), '.uploads');

/**
 * Сохраняет файл в .uploads/{keyPath} (вне директории public).
 * Возвращает URL вида /api/files/{keyPath} — доступ только через auth-прокси.
 *
 * keyPath совпадает с s3Key: "admin/123.jpg" или "projects/{userId}/123.jpg"
 */
export async function saveUploadLocal(buffer: Buffer, keyPath: string): Promise<string> {
  const fullPath = path.resolve(UPLOADS_BASE, keyPath);

  // Защита от path traversal: итоговый путь должен быть внутри UPLOADS_BASE
  if (!fullPath.startsWith(UPLOADS_BASE + path.sep)) {
    throw new Error('Invalid upload path');
  }

  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);

  return `/api/files/${keyPath}`;
}
