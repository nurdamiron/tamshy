import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import type { NewsCategory } from '@prisma/client';

// POST /api/admin/news-import
// Body: { url: string, mode?: 'preview' | 'save', category?: NewsCategory, override?: { title?, content?, imageUrl? } }
// Возвращает: { extracted: {...}, news?: NewsObject }
//
// preview — fetch'нём og: meta-теги и вернём пользователю для редактирования.
// save — создадим запись в News (идемпотентно по fileUrl).
export async function POST(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const url: string | undefined = body.url;
    const mode: 'preview' | 'save' = body.mode ?? 'preview';
    const override = (body.override ?? {}) as Partial<{ title: string; content: string; imageUrl: string }>;

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: 'Укажи валидный URL (http/https)' }, { status: 400 });
    }
    if (url.length > 1000) {
      return NextResponse.json({ error: 'URL слишком длинный' }, { status: 400 });
    }

    // 1. Fetch HTML и парсинг og: meta-тегов.
    //    Мы не используем headless-браузер — это серверный endpoint, runtime
    //    Vercel/Node не позволяет тащить chromium. Если og: меток нет (SPA) —
    //    админ заполняет поля вручную через override.
    let extracted: {
      title: string | null;
      description: string | null;
      imageUrl: string | null;
      siteName: string | null;
    } = { title: null, description: null, imageUrl: null, siteName: null };

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TamshyImporter/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'ru-RU,ru;q=0.9,kk;q=0.8,en;q=0.7',
        },
        signal: AbortSignal.timeout(10_000),
      });
      const html = await res.text();
      extracted = parseMetaTags(html);
    } catch (e) {
      // Если fetch упал (WAF/timeout) — продолжаем с пустыми extracted,
      // админ заполнит вручную через override.
      console.warn('news-import fetch failed:', (e as Error).message);
    }

    // 2. Подмешиваем override от админа (имеет приоритет)
    const final = {
      title: override.title ?? extracted.title ?? '',
      content: override.content ?? extracted.description ?? '',
      imageUrl: override.imageUrl ?? extracted.imageUrl,
    };

    if (mode === 'preview') {
      return NextResponse.json({ extracted, suggested: final });
    }

    // 3. mode=save: проверяем минимальные поля + создаём/обновляем News
    if (!final.title || final.title.length < 3) {
      return NextResponse.json(
        { error: 'Title пустой — нужен ≥3 символа (в override или из meta-тегов)' },
        { status: 400 },
      );
    }
    if (!final.content || final.content.length < 10) {
      return NextResponse.json(
        { error: 'Content пустой — нужен ≥10 символов' },
        { status: 400 },
      );
    }

    const category: NewsCategory =
      (body.category as NewsCategory | undefined) ??
      inferCategory(url, extracted.siteName);

    const dataObj = {
      title: final.title.slice(0, 290),
      content: final.content.slice(0, 49_000),
      category,
      imageUrl: final.imageUrl ?? null,
      fileUrl: url,
    };

    // Идемпотентность по fileUrl
    const existing = await prisma.news.findFirst({ where: { fileUrl: url } });
    const news = existing
      ? await prisma.news.update({ where: { id: existing.id }, data: dataObj })
      : await prisma.news.create({ data: dataObj });

    return NextResponse.json({ news, updated: !!existing }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error('news-import error:', error);
    return NextResponse.json({ error: 'Ошибка импорта' }, { status: 500 });
  }
}

// ── helpers ─────────────────────────────────────────────────────────────────
function parseMetaTags(html: string) {
  const get = (re: RegExp) => {
    const m = html.match(re);
    return m ? decodeHtml(m[1].trim()) : null;
  };
  return {
    title:
      get(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ??
      get(/<meta\s+name="title"\s+content="([^"]+)"/i) ??
      get(/<title>([^<]+)<\/title>/i),
    description:
      get(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ??
      get(/<meta\s+name="description"\s+content="([^"]+)"/i),
    imageUrl: get(/<meta\s+property="og:image"\s+content="([^"]+)"/i),
    siteName: get(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i),
  };
}

function inferCategory(url: string, siteName: string | null): NewsCategory {
  if (/youtube|video|youtu\.be|vimeo/i.test(url)) return 'VIDEO';
  if (/instagram|gallery|photo/i.test(url)) return 'PHOTO';
  if (/report|otchet|отчёт/i.test(url)) return 'REPORT';
  if (siteName && /youtube|vimeo/i.test(siteName)) return 'VIDEO';
  return 'NEWS';
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
