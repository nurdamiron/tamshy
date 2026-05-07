// prisma/seed-water-objects.ts
// Справочник водных объектов для интеграции Qazsu↔Tamshy.
// Source: qazsu.gov.kz (картографический модуль), 8 BVI Казахстана.
// Запускается как часть основного seed (prisma/seed.ts) или отдельно.

import { PrismaClient } from '@prisma/client';

type WaterObjectSeed = {
  id: string;
  name: string;
  nameKz?: string;
  nameEn?: string;
  basin:
    | 'URAL_CASPIAN' | 'ARAL_SYRDARYA' | 'BALKHASH_ALAKOL' | 'IRTYSH'
    | 'ESIL' | 'NURA_SARYSU' | 'TOBOL_TURGAY' | 'SHU_TALAS';
  type: 'RIVER' | 'LAKE' | 'RESERVOIR' | 'CANAL' | 'GROUNDWATER' | 'GLACIER' | 'OTHER';
  region?:
    | 'ASTANA' | 'ALMATY' | 'SHYMKENT' | 'AKTOBE' | 'KARAGANDA'
    | 'MANGYSTAU' | 'TURKESTAN' | 'ZHAMBYL' | 'ALMATY_REGION'
    | 'ATYRAU' | 'AKTAU' | 'PAVLODAR' | 'SEMEY' | 'TALDYKORGAN'
    | 'KYZYLORDA' | 'TARAZ' | 'PETROPAVLOVSK' | 'ORAL' | 'KOSTANAY';
  description?: string;
};

export const WATER_OBJECTS: WaterObjectSeed[] = [
  // ── Балхаш-Алакольский бассейн ──
  { id: 'ili-river',                 name: 'Иле',                          nameKz: 'Іле',                 nameEn: 'Ili',          basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION', description: 'Главная река бассейна Балхаш, трансграничная (КНР→РК).' },
  { id: 'balkhash-lake',             name: 'Балхаш',                       nameKz: 'Балқаш',              nameEn: 'Balkhash',     basin: 'BALKHASH_ALAKOL', type: 'LAKE',      region: 'ALMATY_REGION', description: 'Полупресное-полусоленое озеро, находится под угрозой обмеления.' },
  { id: 'alakol-lake',               name: 'Алаколь',                      nameKz: 'Алакөл',              basin: 'BALKHASH_ALAKOL', type: 'LAKE',      region: 'ALMATY_REGION' },
  { id: 'sasykkol-lake',             name: 'Сасықкөл',                     nameKz: 'Сасықкөл',            basin: 'BALKHASH_ALAKOL', type: 'LAKE',      region: 'ALMATY_REGION' },
  { id: 'kapchagay-reservoir',       name: 'Капчагайское водохранилище',   nameKz: 'Қапшағай',            basin: 'BALKHASH_ALAKOL', type: 'RESERVOIR', region: 'ALMATY_REGION' },
  { id: 'bartogai-reservoir',        name: 'Бартогайское водохранилище',   nameKz: 'Бартоғай',            basin: 'BALKHASH_ALAKOL', type: 'RESERVOIR', region: 'ALMATY_REGION' },
  { id: 'karatal-river',             name: 'Каратал',                      nameKz: 'Қаратал',             basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION' },
  { id: 'aksu-river',                name: 'Аксу',                         nameKz: 'Ақсу',                basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION' },
  { id: 'lepsy-river',               name: 'Лепсы',                        nameKz: 'Лепсі',               basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION' },
  { id: 'kaskelen-river',            name: 'Каскелен',                     nameKz: 'Қаскелең',            basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION' },
  { id: 'turgen-river',              name: 'Тургень',                      nameKz: 'Түрген',              basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY_REGION' },
  { id: 'bolshoy-almatinka',         name: 'Большая Алматинка',            nameKz: 'Үлкен Алматы',        basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY' },
  { id: 'maliy-almatinka',           name: 'Малая Алматинка',              nameKz: 'Кіші Алматы',         basin: 'BALKHASH_ALAKOL', type: 'RIVER',     region: 'ALMATY' },
  { id: 'tuyuksu-glacier',           name: 'Ледник Туюксу',                nameKz: 'Тұйықсу мұздығы',     basin: 'BALKHASH_ALAKOL', type: 'GLACIER',   region: 'ALMATY_REGION', description: 'Опорный ледник Заилийского Алатау, наблюдается с 1957.' },

  // ── Арало-Сырдарьинский бассейн ──
  { id: 'syrdarya-river',            name: 'Сырдарья',                     nameKz: 'Сырдария',            nameEn: 'Syr Darya',    basin: 'ARAL_SYRDARYA',   type: 'RIVER',     region: 'KYZYLORDA',     description: 'Трансграничная река, ключевая для южного Казахстана.' },
  { id: 'aral-sea',                  name: 'Аральское море (Малое)',       nameKz: 'Арал теңізі',         nameEn: 'Aral Sea',     basin: 'ARAL_SYRDARYA',   type: 'LAKE',      region: 'KYZYLORDA',     description: 'Северная (Малая) часть; восстанавливается после Кокаральской дамбы.' },
  { id: 'kokaral-dam',               name: 'Кокаральская плотина',         nameKz: 'Көкарал бөгеті',      basin: 'ARAL_SYRDARYA',   type: 'CANAL',     region: 'KYZYLORDA',     description: 'Спасает Малый Арал от высыхания.' },
  { id: 'shardara-reservoir',        name: 'Шардаринское водохранилище',   nameKz: 'Шардара',             basin: 'ARAL_SYRDARYA',   type: 'RESERVOIR', region: 'TURKESTAN' },
  { id: 'koksaray-counter-reservoir',name: 'Коксарайский контррегулятор',  nameKz: 'Көксарай',            basin: 'ARAL_SYRDARYA',   type: 'RESERVOIR', region: 'TURKESTAN' },
  { id: 'arys-river',                name: 'Арысь',                        nameKz: 'Арыс',                basin: 'ARAL_SYRDARYA',   type: 'RIVER',     region: 'TURKESTAN' },
  { id: 'keles-river',               name: 'Келес',                        nameKz: 'Келес',               basin: 'ARAL_SYRDARYA',   type: 'RIVER',     region: 'TURKESTAN' },
  { id: 'bugun-reservoir',           name: 'Бугуньское водохранилище',     nameKz: 'Бұғын',               basin: 'ARAL_SYRDARYA',   type: 'RESERVOIR', region: 'TURKESTAN' },

  // ── Жайык-Каспийский бассейн ──
  { id: 'ural-river',                name: 'Жайык (Урал)',                 nameKz: 'Жайық',               nameEn: 'Ural',         basin: 'URAL_CASPIAN',    type: 'RIVER',     region: 'ATYRAU',        description: 'Трансграничная река (РФ→РК), впадает в Каспий.' },
  { id: 'caspian-sea',               name: 'Каспийское море',              nameKz: 'Каспий теңізі',       nameEn: 'Caspian Sea',  basin: 'URAL_CASPIAN',    type: 'LAKE',      region: 'MANGYSTAU',     description: 'Бессточный солёный водоём; уровень снижается.' },
  { id: 'emba-river',                name: 'Эмба',                         nameKz: 'Жем',                 basin: 'URAL_CASPIAN',    type: 'RIVER',     region: 'ATYRAU' },
  { id: 'temir-river',               name: 'Темир',                        nameKz: 'Темір',               basin: 'URAL_CASPIAN',    type: 'RIVER',     region: 'AKTOBE' },
  { id: 'ilek-river',                name: 'Илек',                         nameKz: 'Елек',                basin: 'URAL_CASPIAN',    type: 'RIVER',     region: 'AKTOBE' },
  { id: 'kargaly-reservoir',         name: 'Каргалинское водохранилище',   nameKz: 'Қарғалы',             basin: 'URAL_CASPIAN',    type: 'RESERVOIR', region: 'AKTOBE' },
  { id: 'aktobe-reservoir',          name: 'Актюбинское водохранилище',    nameKz: 'Ақтөбе',              basin: 'URAL_CASPIAN',    type: 'RESERVOIR', region: 'AKTOBE' },
  { id: 'kushum-reservoir',          name: 'Кушумское водохранилище',      nameKz: 'Құшым',               basin: 'URAL_CASPIAN',    type: 'RESERVOIR', region: 'ORAL' },
  { id: 'volga-ural-canal',          name: 'Канал Волга-Урал',             nameKz: 'Еділ-Жайық каналы',   basin: 'URAL_CASPIAN',    type: 'CANAL',     region: 'ATYRAU' },

  // ── Иртышский бассейн ──
  { id: 'irtysh-river',              name: 'Ертіс (Иртыш)',                nameKz: 'Ертіс',               nameEn: 'Irtysh',       basin: 'IRTYSH',          type: 'RIVER',     region: 'PAVLODAR',      description: 'Крупнейшая трансграничная река (КНР→РК→РФ).' },
  { id: 'bukhtarma-reservoir',       name: 'Бухтарминское водохранилище',  nameKz: 'Бұқтырма',            basin: 'IRTYSH',          type: 'RESERVOIR', region: 'SEMEY' },
  { id: 'shulbinsk-reservoir',       name: 'Шульбинское водохранилище',    nameKz: 'Шүлбі',               basin: 'IRTYSH',          type: 'RESERVOIR', region: 'SEMEY' },
  { id: 'ust-kamenogorsk-reservoir', name: 'Усть-Каменогорское водохранилище', basin: 'IRTYSH',          type: 'RESERVOIR', region: 'SEMEY' },
  { id: 'zaisan-lake',               name: 'Зайсан',                       nameKz: 'Зайсан',              basin: 'IRTYSH',          type: 'LAKE',      region: 'SEMEY' },
  { id: 'markakol-lake',             name: 'Маркаколь',                    nameKz: 'Марқакөл',            basin: 'IRTYSH',          type: 'LAKE',      region: 'SEMEY' },
  { id: 'tobol-irtysh-canal',        name: 'Канал Иртыш-Караганда',        nameKz: 'Ертіс-Қарағанды каналы', basin: 'IRTYSH',       type: 'CANAL',     region: 'KARAGANDA',     description: 'Магистральный канал длиной 458 км; снабжает Караганду и Астану.' },
  { id: 'kurchum-river',             name: 'Курчум',                       nameKz: 'Күршім',              basin: 'IRTYSH',          type: 'RIVER',     region: 'SEMEY' },
  { id: 'uba-river',                 name: 'Уба',                          nameKz: 'Уба',                 basin: 'IRTYSH',          type: 'RIVER',     region: 'SEMEY' },

  // ── Есіль (Ишимский) бассейн ──
  { id: 'esil-river',                name: 'Есіль (Ишим)',                 nameKz: 'Есіл',                nameEn: 'Ishim',        basin: 'ESIL',            type: 'RIVER',     region: 'ASTANA' },
  { id: 'astana-reservoir',          name: 'Астанинское водохранилище',    nameKz: 'Астана су қоймасы',   basin: 'ESIL',            type: 'RESERVOIR', region: 'ASTANA' },
  { id: 'sergeyevsk-reservoir',      name: 'Сергеевское водохранилище',    nameKz: 'Сергеев',             basin: 'ESIL',            type: 'RESERVOIR', region: 'PETROPAVLOVSK' },
  { id: 'vyacheslavsk-reservoir',    name: 'Вячеславское водохранилище',   nameKz: 'Вячеслав',            basin: 'ESIL',            type: 'RESERVOIR', region: 'ASTANA' },
  { id: 'silety-river',              name: 'Силеты',                       nameKz: 'Сілеті',              basin: 'ESIL',            type: 'RIVER',     region: 'PAVLODAR' },

  // ── Нура-Сарысуский бассейн ──
  { id: 'nura-river',                name: 'Нура',                         nameKz: 'Нұра',                basin: 'NURA_SARYSU',     type: 'RIVER',     region: 'KARAGANDA' },
  { id: 'sarysu-river',              name: 'Сарысу',                       nameKz: 'Сарысу',              basin: 'NURA_SARYSU',     type: 'RIVER',     region: 'KARAGANDA' },
  { id: 'samarkand-reservoir',       name: 'Самаркандское водохранилище',  nameKz: 'Самарқан',            basin: 'NURA_SARYSU',     type: 'RESERVOIR', region: 'KARAGANDA' },
  { id: 'fedorovsky-reservoir',      name: 'Фёдоровское водохранилище',    nameKz: 'Фёдоров',             basin: 'NURA_SARYSU',     type: 'RESERVOIR', region: 'KARAGANDA' },
  { id: 'kengir-reservoir',          name: 'Кенгирское водохранилище',     nameKz: 'Кеңгір',              basin: 'NURA_SARYSU',     type: 'RESERVOIR', region: 'KARAGANDA' },
  { id: 'tengiz-lake',               name: 'Тенгиз',                       nameKz: 'Теңіз',               basin: 'NURA_SARYSU',     type: 'LAKE',      region: 'KARAGANDA',     description: 'Бессточное солёное озеро, объект Рамсарской конвенции.' },

  // ── Тобол-Тургайский бассейн ──
  { id: 'tobol-river',               name: 'Тобол',                        nameKz: 'Тобыл',               nameEn: 'Tobol',        basin: 'TOBOL_TURGAY',    type: 'RIVER',     region: 'KOSTANAY' },
  { id: 'turgay-river',              name: 'Тургай',                       nameKz: 'Торғай',              basin: 'TOBOL_TURGAY',    type: 'RIVER',     region: 'KOSTANAY' },
  { id: 'irgiz-river',               name: 'Иргиз',                        nameKz: 'Ырғыз',               basin: 'TOBOL_TURGAY',    type: 'RIVER',     region: 'AKTOBE' },
  { id: 'verkhne-tobolsk-reservoir', name: 'Верхне-Тобольское водохранилище', nameKz: 'Жоғарғы Тобыл',    basin: 'TOBOL_TURGAY',    type: 'RESERVOIR', region: 'KOSTANAY' },
  { id: 'karatomar-reservoir',       name: 'Каратомарское водохранилище',  nameKz: 'Қаратомар',           basin: 'TOBOL_TURGAY',    type: 'RESERVOIR', region: 'KOSTANAY' },
  { id: 'amangeldy-reservoir',       name: 'Амангельдинское водохранилище',nameKz: 'Амангелді',           basin: 'TOBOL_TURGAY',    type: 'RESERVOIR', region: 'KOSTANAY' },

  // ── Шу-Таласский бассейн ──
  { id: 'shu-river',                 name: 'Шу',                           nameKz: 'Шу',                  basin: 'SHU_TALAS',       type: 'RIVER',     region: 'ZHAMBYL',       description: 'Трансграничная река (КР→РК).' },
  { id: 'talas-river',               name: 'Талас',                        nameKz: 'Талас',               basin: 'SHU_TALAS',       type: 'RIVER',     region: 'ZHAMBYL' },
  { id: 'aspara-river',              name: 'Аспара',                       nameKz: 'Аспара',              basin: 'SHU_TALAS',       type: 'RIVER',     region: 'ZHAMBYL' },
  { id: 'tasotkel-reservoir',        name: 'Тасөткель',                    nameKz: 'Тасөткел',            basin: 'SHU_TALAS',       type: 'RESERVOIR', region: 'ZHAMBYL' },
  { id: 'tertkul-reservoir',         name: 'Тертколь',                     nameKz: 'Тертколь',            basin: 'SHU_TALAS',       type: 'RESERVOIR', region: 'ZHAMBYL' },
  { id: 'kirov-reservoir-talas',     name: 'Кировское водохранилище (Талас)', nameKz: 'Киров',            basin: 'SHU_TALAS',       type: 'RESERVOIR', region: 'ZHAMBYL' },

  // ── Подземные воды (несколько ключевых месторождений) ──
  { id: 'kokzhide-aquifer',          name: 'Кокжидинское месторождение подземных вод', nameKz: 'Көкжиде', basin: 'URAL_CASPIAN',    type: 'GROUNDWATER', region: 'AKTOBE' },
  { id: 'tassay-aquifer',            name: 'Тассайское месторождение подземных вод',   nameKz: 'Тассай',  basin: 'ARAL_SYRDARYA',   type: 'GROUNDWATER', region: 'TURKESTAN' },
];

export async function seedWaterObjects(prisma: PrismaClient) {
  for (const wo of WATER_OBJECTS) {
    await prisma.waterObject.upsert({
      where: { id: wo.id },
      update: {
        name: wo.name,
        nameKz: wo.nameKz ?? null,
        nameEn: wo.nameEn ?? null,
        basin: wo.basin,
        type: wo.type,
        region: wo.region ?? null,
        description: wo.description ?? null,
      },
      create: {
        id: wo.id,
        name: wo.name,
        nameKz: wo.nameKz ?? null,
        nameEn: wo.nameEn ?? null,
        basin: wo.basin,
        type: wo.type,
        region: wo.region ?? null,
        description: wo.description ?? null,
      },
    });
  }
  console.log(`  ✓ ${WATER_OBJECTS.length} water objects (Qazsu reference)`);
}

// Standalone usage: `npx tsx prisma/seed-water-objects.ts`
if (require.main === module) {
  const prisma = new PrismaClient();
  seedWaterObjects(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
