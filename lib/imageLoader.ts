"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader that points at our own resizer (app/api/img/route.ts)
 * instead of Vercel Image Optimization, whose quota is exhausted.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  return `/api/img?url=${encodeURIComponent(src)}&w=${width}&q=85`;
}
