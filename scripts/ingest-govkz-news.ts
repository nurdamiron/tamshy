// scripts/ingest-govkz-news.ts
//
// Импорт новостей из gov.kz/memleket/entities/water в таблицу News.
//
// ВАЖНО: gov.kz — SPA, контент рендерится на клиенте через React.
// Простой fetch HTML возвращает только пустой <div id="root">. Поэтому
// скрипт работает в двух режимах:
//
//   1) auto      — пытается достать og:* мета-теги (часто их нет — будет skip)
//   2) playwright — headless-браузер, ждёт рендера и берёт DOM
//      (требует `npm i -D playwright && npx playwright install chromium`)
//
// Запуск:
//   echo "https://www.gov.kz/memleket/entities/water/press/news/details/963003?lang=ru" | \
//     npx tsx scripts/ingest-govkz-news.ts --mode=auto
//
//   # из файла со списком URL'ов
//   npx tsx scripts/ingest-govkz-news.ts --mode=playwright --file=scripts/govkz-urls.txt
//
//   # dry-run (не пишет в БД)
//   npx tsx scripts/ingest-govkz-news.ts --mode=auto --dry-run
//
// URL'ы можно собирать из:
//   - https://www.gov.kz/memleket/entities/water/press/news/1?lang=ru (visual)
//   - https://qazsu.gov.kz (партнёрские релизы)
//   - https://www.instagram.com/su_resurstari_ministrligi/ (см. docs/qazsu-ingest.md)

import { PrismaClient, NewsCategory } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const prisma = new PrismaClient();

const args = parseArgs(process.argv.slice(2));
const MODE: 'auto' | 'playwright' = (args.mode === 'playwright' ? 'playwright' : 'auto');
const DRY_RUN = !!args['dry-run'];
const FILE = args.file as string | undefined;

type Extracted = {
  url: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
};

// ── Mode A: og:* meta tags through fetch ────────────────────────────────────
async function extractAuto(url: string): Promise<Extracted> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (TamshyIngest/1.0)' },
  });
  const html = await res.text();
  const get = (re: RegExp) => {
    const m = html.match(re);
    return m ? decodeHtml(m[1].trim()) : null;
  };
  return {
    url,
    title:       get(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
              ?? get(/<meta\s+name="title"\s+content="([^"]+)"/i)
              ?? get(/<title>([^<]+)<\/title>/i),
    description: get(/<meta\s+property="og:description"\s+content="([^"]+)"/i)
              ?? get(/<meta\s+name="description"\s+content="([^"]+)"/i),
    imageUrl:    get(/<meta\s+property="og:image"\s+content="([^"]+)"/i),
    publishedAt: null,
  };
}

// ── Mode B: Playwright (headless browser) ───────────────────────────────────
// Установка:
//   npm i -D playwright
//   npx playwright install chromium
async function extractPlaywright(url: string): Promise<Extracted> {
  // Dynamic import: playwright — опциональная dev-зависимость,
  // не должна попадать в обычный build. Типы тут — any, потому что
  // пакет может быть не установлен.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let chromium: any;
  try {
    chromium = (await import('playwright')).chromium;
  } catch {
    throw new Error(
      'Playwright не установлен. Запусти:\n' +
      '  npm i -D playwright\n' +
      '  npx playwright install chromium\n' +
      'Либо используй --mode=auto.',
    );
  }
  const browser: any = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  try {
    const ctx: any = await browser.newContext({
      locale: 'ru-RU',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
                 '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1440, height: 900 },
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      },
    });
    const page: any = await ctx.newPage();
    // Замаскироваться от detection: убрать navigator.webdriver
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    // domcontentloaded быстрее чем networkidle и реже триггерит таймауты на SPA
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    // Дать SPA время отрисовать контент (gov.kz ~3s)
    await page.waitForTimeout(4000);
    // gov.kz рендерит карточку новости в .news-detail или подобном; берём весь body text.
    const title: string = await page.title();
    // og:image ставится сервером — после рендера может появиться
    const imageUrl: string | null = await page.locator('meta[property="og:image"]').first()
      .getAttribute('content').catch(() => null);
    // основной текст: первый <article> или main блок
    const bodyText: string = await page.locator('article, main, .news-detail, [class*=newsDetail]')
      .first().innerText({ timeout: 5000 })
      .catch(async () => await page.locator('body').innerText());
    // Дата на gov.kz обычно в формате "DD.MM.YYYY"
    const dateMatch = bodyText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    const publishedAt = dateMatch
      ? new Date(`${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`)
      : null;
    const description = bodyText.slice(0, 500).replace(/\s+/g, ' ').trim();
    return { url, title, description, imageUrl, publishedAt };
  } finally {
    await browser.close();
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// ── Main ────────────────────────────────────────────────────────────────────
async function readUrls(): Promise<string[]> {
  if (FILE) {
    return readFileSync(FILE, 'utf-8')
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http'));
  }
  // stdin
  const rl = createInterface({ input: process.stdin });
  const urls: string[] = [];
  for await (const line of rl) {
    const t = line.trim();
    if (t.startsWith('http')) urls.push(t);
  }
  return urls;
}

async function main() {
  const urls = await readUrls();
  if (urls.length === 0) {
    console.error('Нет URL для импорта. Передай через stdin или --file=path.txt');
    process.exit(1);
  }
  console.log(`Импорт ${urls.length} URL'ов в режиме=${MODE}, dry-run=${DRY_RUN}`);

  let imported = 0, skipped = 0, failed = 0;
  for (const url of urls) {
    try {
      const ext = MODE === 'playwright'
        ? await extractPlaywright(url)
        : await extractAuto(url);

      if (!ext.title) {
        console.warn(`  ⚠ skip (нет title): ${url}`);
        skipped++;
        continue;
      }

      // Категория по эвристике: фото в URL → PHOTO, видео → VIDEO, иначе NEWS
      const category: NewsCategory =
        /video|youtube/i.test(url) ? 'VIDEO' :
        /photo|gallery/i.test(url) ? 'PHOTO' : 'NEWS';

      const dataObj = {
        title: ext.title.slice(0, 290),
        content: (ext.description ?? '').slice(0, 49000) || ext.title,
        category,
        imageUrl: ext.imageUrl,
        fileUrl: url,                                   // ссылка на оригинал
        createdAt: ext.publishedAt ?? new Date(),
      };

      if (DRY_RUN) {
        console.log(`  ▷ would import: ${ext.title.slice(0, 80)}`);
      } else {
        // Идемпотентность по fileUrl: если уже импортировали — обновим, иначе создадим
        const existing = await prisma.news.findFirst({ where: { fileUrl: url } });
        if (existing) {
          await prisma.news.update({ where: { id: existing.id }, data: dataObj });
          console.log(`  ↻ updated: ${ext.title.slice(0, 80)}`);
        } else {
          await prisma.news.create({ data: dataObj });
          console.log(`  ✓ imported: ${ext.title.slice(0, 80)}`);
        }
      }
      imported++;
    } catch (e) {
      console.error(`  ✗ failed: ${url} — ${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\nИтого: ${imported} импортировано, ${skipped} пропущено, ${failed} ошибок`);
}

// ── helpers ─────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) out[m[1]] = m[2] ?? true;
  }
  return out;
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

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
