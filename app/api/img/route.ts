import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import sharp from "sharp";
import {
  IMAGE_QUALITIES,
  IMAGE_WIDTHS,
  isAllowedImageHost,
} from "@/lib/imageConfig";

/**
 * Our own image resizer, used instead of Vercel Image Optimization: that
 * quota is exhausted and answers 402 (see next.config.ts). Every photo is
 * resized to WebP once per width/quality and then served from Vercel's CDN
 * cache for a year, so the function runs only on a cache miss.
 *
 * Anything that goes wrong redirects to the original file: a guest sees a
 * heavier photo, never a broken one.
 */

export const runtime = "nodejs";

const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const YEAR = 60 * 60 * 24 * 365;

function fallback(target: string) {
  const res = NextResponse.redirect(target, 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const src = params.get("url") ?? "";
  const width = Number(params.get("w"));
  const quality = Number(params.get("q"));

  if (
    !IMAGE_WIDTHS.includes(width) ||
    !IMAGE_QUALITIES.includes(quality)
  ) {
    return new NextResponse("Bad width or quality", { status: 400 });
  }

  let source: URL;
  if (src.startsWith("/") && !src.startsWith("//")) {
    if (src.startsWith("/api/")) {
      return new NextResponse("Bad url", { status: 400 });
    }
    source = new URL(src, request.nextUrl.origin);
  } else {
    try {
      source = new URL(src);
    } catch {
      return new NextResponse("Bad url", { status: 400 });
    }
    if (source.protocol !== "https:" || !isAllowedImageHost(source.hostname)) {
      return new NextResponse("Host not allowed", { status: 400 });
    }
  }

  try {
    const upstream = await fetch(source, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const type = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !type.startsWith("image/")) {
      return fallback(source.href);
    }
    // Vector and animated images are passed through untouched.
    if (type.includes("svg") || type.includes("gif")) {
      return fallback(source.href);
    }
    const input = Buffer.from(await upstream.arrayBuffer());
    if (input.byteLength > MAX_SOURCE_BYTES) {
      return fallback(source.href);
    }

    const output = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${YEAR}, immutable`,
        "CDN-Cache-Control": `public, s-maxage=${YEAR}`,
      },
    });
  } catch {
    return fallback(source.href);
  }
}
