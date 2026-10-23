/**
 * Shared by the next/image loader (lib/imageLoader.ts) and our resizer
 * (app/api/img/route.ts). Widths and qualities must match next.config.ts →
 * images.deviceSizes + imageSizes and images.qualities: next/image only asks
 * for those.
 */

export const IMAGE_WIDTHS = [64, 128, 256, 384, 640, 1080, 1600, 2048];
/** One quality for the whole site: above Next's default 75, so no visible loss. */
export const IMAGE_QUALITIES = [85];

export function isAllowedImageHost(hostname: string): boolean {
  return (
    hostname === "images.unsplash.com" ||
    hostname === "picsum.photos" ||
    hostname.endsWith(".amazonaws.com")
  );
}
