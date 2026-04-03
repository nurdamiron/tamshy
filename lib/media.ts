/**
 * Локальные медиа из public/media (без Unsplash/S3 в сиде и на главной).
 * Имя файла: unsplash-{photoId}.jpg
 */
export function mediaUrl(photoId: string): string {
  return `/media/unsplash-${photoId}.jpg`;
}
