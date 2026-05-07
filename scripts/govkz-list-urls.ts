// scripts/govkz-list-urls.ts
//
// Откроет страницу-листинг новостей министерства водных ресурсов
// и выведет все найденные URL'ы новостей в stdout (по одному на строку).
//
// Usage:
//   npx tsx scripts/govkz-list-urls.ts > scripts/govkz-urls.txt
//
// Требует Playwright + chromium (см. ingest-govkz-news.ts).

const LIST_URL_TEMPLATE = 'https://www.gov.kz/memleket/entities/water/press/news/{page}?lang=ru';
const PAGES = parseInt(process.env.PAGES || '3', 10);

async function main() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let chromium: any;
  try {
    chromium = (await import('playwright')).chromium;
  } catch {
    console.error('playwright не установлен. npm i -D playwright');
    process.exit(1);
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
    });
    const page: any = await ctx.newPage();
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    const all = new Set<string>();
    for (let p = 1; p <= PAGES; p++) {
      const url = LIST_URL_TEMPLATE.replace('{page}', String(p));
      console.error(`[${p}/${PAGES}] fetching ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(4000);
      const links: string[] = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((h) => h.includes('/memleket/entities/water/press/news/details/'));
      });
      for (const l of links) all.add(l);
    }

    for (const u of [...all].sort()) console.log(u);
    console.error(`\n=== итого ${all.size} URL'ов ===`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
