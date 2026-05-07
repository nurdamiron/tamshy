#!/usr/bin/env node
/**
 * Скачивает изображения для public/media (см. lib/media.ts и prisma/seed.ts).
 * Запуск: npm run download-media
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'media');

const ids = [
  // --- Уже загруженные (вода, природа) ---
  '1437482078695-73f5ca6c96e2',
  '1498084393753-b411b2d26b34',
  '1542601906990-b4d3fb778b09',
  '1525087740718-9e0f2c58c7ef',
  '1465146344425-f00d5f5c8f07',
  '1447752875215-b2761acb3c5d',
  '1527066236128-2ff79f7b9705',
  '1592656094267-764a45160876',
  '1506544777-64cfbe1142df',
  '1507525428034-b723cf961d3e',
  '1534447677768-be436bb09401',
  '1469122312224-c5846569feb1',
  '1423483641154-5411ec9c0ddf',
  '1510442650500-93217e634e4c',
  '1522204523234-8729aa6e3d5f',
  '1470071459604-3b5ec3a7fe05',
  '1497436072909-60f360e1d4b1',
  '1500530855697-b586d89ba3ee',
  '1506905925346-21bda4d32df4',
  '1439066615861-d1af74d74000',

  // --- Новые: чистая вода, реки, озёра ---
  '1559825481-12a05cc00344', // водная гладь
  '1548502032-5a7c29e8b8d5', // вода крупный план
  '1544551763-46a013bb70d5', // прозрачная вода
  '1540202404-1b927e27fa8b', // горное озеро
  '1474552226712-ac7898c3b53c', // водопад / ручей
  '1504711434969-e33886168f5c', // реки / ландшафт

  // --- Новые: экология, природа Казахстана, степь ---
  '1568702846914-96b305d2aaeb', // природный ландшафт
  '1551201602-1710a26b5a37', // экосистема
  '1580977251946-8f37c2fe1e29', // водоём / природа
  '1589993965851-5d6e9aba4d86', // вода / экология

  // --- Новые: образование, дети, наука ---
  '1503454537-68bcc64f64a9', // дети в школе
  '1577896852-0b1e32b0a66e', // обучение / наука
  '1564507004688-6a9e17b0f0e7', // лабораторные исследования
  '1563986303-5cfc4882c455', // анализ воды / исследование
];

const urls = [...new Set(ids)].map(
  (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`
);

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, { headers: { 'User-Agent': 'tamshy-media-fetch/1.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const loc = res.headers.location;
          file.close();
          try {
            fs.unlinkSync(destPath);
          } catch {
            /* ignore */
          }
          if (!loc) return reject(new Error('redirect without location'));
          return download(loc, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(destPath);
          } catch {
            /* ignore */
          }
          return reject(new Error(`HTTP ${res.statusCode} ${url}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        file.close();
        try {
          fs.unlinkSync(destPath);
        } catch {
          /* ignore */
        }
        reject(err);
      });
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const url of urls) {
    const m = url.match(/photo-([^?]+)/);
    const id = m ? m[1] : null;
    if (!id) continue;
    const dest = path.join(outDir, `unsplash-${id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
      console.log('skip', path.basename(dest));
      continue;
    }
    console.log('→', id);
    try {
      await download(url, dest);
    } catch (err) {
      console.warn('  skip (error):', err.message);
    }
  }

  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const pdfDest = path.join(outDir, 'dummy.pdf');
  if (!fs.existsSync(pdfDest) || fs.statSync(pdfDest).size < 100) {
    console.log('→ dummy.pdf');
    await download(pdfUrl, pdfDest);
  }

  console.log('✓ done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
