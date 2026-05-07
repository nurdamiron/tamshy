// scripts/backfill-qazsu.ts
//
// Backfill Qazsu-полей в существующих проектах.
//   1. Проставляет basin по region (если пусто).
//   2. По флагу --publish-winners выставляет publishToQazsu=true для WINNER.
//
// Запуск:
//   npx tsx scripts/backfill-qazsu.ts                  # dry-run
//   npx tsx scripts/backfill-qazsu.ts --apply          # применить basin
//   npx tsx scripts/backfill-qazsu.ts --apply --publish-winners
//
// Идемпотентно: повторный запуск ничего не ломает.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Region → Basin ───────────────────────────────────────────────────────────
// Маппинг основан на гидрографии Казахстана и зонах ответственности 8 БВИ.
// Где регион пересекается с двумя бассейнами — выбран доминирующий.
const REGION_TO_BASIN: Record<string, string> = {
  ASTANA:          'ESIL',
  ALMATY:          'BALKHASH_ALAKOL',
  ALMATY_REGION:   'BALKHASH_ALAKOL',
  TALDYKORGAN:     'BALKHASH_ALAKOL',
  SHYMKENT:        'ARAL_SYRDARYA',
  TURKESTAN:       'ARAL_SYRDARYA',
  KYZYLORDA:       'ARAL_SYRDARYA',
  TARAZ:           'SHU_TALAS',
  ZHAMBYL:         'SHU_TALAS',
  ATYRAU:          'URAL_CASPIAN',
  ORAL:            'URAL_CASPIAN',
  AKTAU:           'URAL_CASPIAN',
  MANGYSTAU:       'URAL_CASPIAN',
  AKTOBE:          'URAL_CASPIAN',
  PAVLODAR:        'IRTYSH',
  SEMEY:           'IRTYSH',
  KARAGANDA:       'NURA_SARYSU',
  KOSTANAY:        'TOBOL_TURGAY',
  PETROPAVLOVSK:   'ESIL',
};

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const PUBLISH_WINNERS = args.has('--publish-winners');

async function main() {
  const projects = await prisma.project.findMany({
    select: { id: true, region: true, basin: true, status: true, publishToQazsu: true, title: true },
  });
  console.log(`Найдено проектов: ${projects.length}`);

  // 1. Backfill basin
  let basinUpdates = 0;
  for (const p of projects) {
    if (p.basin) continue;
    const inferred = REGION_TO_BASIN[p.region as string];
    if (!inferred) continue;
    basinUpdates++;
    if (APPLY) {
      await prisma.project.update({
        where: { id: p.id },
        data: { basin: inferred as never },
      });
    }
  }
  console.log(`Basin backfill: ${basinUpdates} проектов ${APPLY ? 'обновлено' : '(dry-run)'}`);

  // 2. publishToQazsu для WINNER
  if (PUBLISH_WINNERS) {
    const winnersToPublish = projects.filter((p) => p.status === 'WINNER' && !p.publishToQazsu);
    console.log(`Победителей не в витрине: ${winnersToPublish.length}`);
    if (APPLY) {
      const now = new Date();
      for (const p of winnersToPublish) {
        await prisma.project.update({
          where: { id: p.id },
          data: { publishToQazsu: true, publishedToQazsuAt: now },
        });
      }
      console.log(`✓ Опубликовано в витрине Qazsu: ${winnersToPublish.length}`);
    } else {
      console.log(`(dry-run) Будет опубликовано: ${winnersToPublish.length}`);
    }
  }

  // 3. Краткий summary текущего состояния
  const [totalQazsu, totalWithBasin, totalPublished] = await Promise.all([
    prisma.project.count({ where: { sourceSystem: 'QAZSU' } }),
    prisma.project.count({ where: { basin: { not: null } } }),
    prisma.project.count({ where: { publishToQazsu: true } }),
  ]);
  console.log('\n── Текущее состояние ─────────────────');
  console.log(`Из Qazsu (sourceSystem):   ${totalQazsu}`);
  console.log(`С привязкой к бассейну:    ${totalWithBasin}`);
  console.log(`В витрине publishToQazsu:  ${totalPublished}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
