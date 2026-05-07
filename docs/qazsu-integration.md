# Tamshy ↔ Qazsu — Integration Spec

Дата: 2026-05-07
Статус: MVP v1 (реализован), v2/v3 — backlog
Контакты: НАО «ИАЦ водных ресурсов» / команда Tamshy

---

## 1. One-pager (для ИАЦ / Министерства)

**Tamshy = молодежный engagement layer над экосистемой Qazsu.**

- Qazsu решает учет, мониторинг и управление водными ресурсами РК (8 водохозяйственных бассейнов, 250+ ГТС, 334 гидропоста).
- Tamshy решает массовое вовлечение школьников в культуру водосбережения (конкурсы, проекты, экспертная оценка).
- Связка даёт сквозной цикл: **официальные данные → школьный проект → общественное участие → витрина решений → региональная аналитика**.

### Что получает министерство
1. **Цифровизация** — каждый проект привязан к региону, бассейну, водному объекту, типу проблемы.
2. **Экопросвещение** — школы получают готовую проектную механику с официальным контекстом.
3. **Молодежная инициатива** — citizen-science канал для министерства.
4. **Публичный showcase** — раздел "Молодежные водные решения" в Qazsu.
5. **KPI по регионам** — сколько проектов, по каким темам, в каких бассейнах.

### 3 этапа интеграции
- **MVP v1 (реализовано):** deeplink из Qazsu → Tamshy с предзаполнением, поля бассейна/темы/объекта, витрина проектов, флаг публикации, фильтрация.
- **Pilot v2 (backlog):** master-справочники в Qazsu, периодическая синхронизация, единая аналитика по регионам.
- **Full v3 (backlog):** SSO, роль "эксперт Qazsu", двусторонняя публикация, dashboards для министерства, карта проектов поверх ГИС Qazsu.

### Риски
- **Персональные данные несовершеннолетних** — в Qazsu передаём только обезличенные/агрегированные метрики и публично-разрешённые материалы. ID заявок, не ФИО.
- **Авторские права** — права у авторов; Tamshy получает неисключительную безвозмездную лицензию (см. /terms).
- **Зрелость данных** — Qazsu = authoritative source, Tamshy = participation layer. Не смешивать.

---

## 2. User flow

### Flow A — Qazsu → Tamshy (deeplink)
1. Пользователь открывает карту/объект в Qazsu.
2. Видит CTA "Создать школьный проект по этому объекту".
3. Переходит на `/submit` с query-параметрами.
4. Форма автоматически:
   - показывает badge "Сіз Qazsu платформасынан келдіңіз";
   - предзаполняет регион, бассейн, тему, ID водного объекта;
   - сохраняет deeplink на объект Qazsu (`qazsuRefUrl`).
5. Учитель/представитель завершает регистрацию (OTP), команду, описание, файл.
6. После публикации проект имеет `sourceSystem=QAZSU` и snapshot контекста.

### Flow B — Tamshy внутри
1. Учитель начинает подачу проекта обычным путём.
2. На шаге 3 видит опциональные селекты "Су бассейні" и "Су тақырыбы".
3. Может привязать проект к бассейну/теме без deeplink.

### Flow C — Витрина в Qazsu
1. Эксперты ставят `APPROVED` или `WINNER`.
2. Админ Tamshy переключает `publishToQazsu=true` (в админ-панели).
3. Проект появляется в `/qazsu/showcase` и в публичном API `/api/qazsu/showcase`.
4. Qazsu может встроить эту витрину как iframe или fetch'ить API.

---

## 3. Deeplink contract

URL шаблон:
```
https://tamshy.kz/submit?source=qazsu&campaign=tamshy-2026
  &region=ALMATY_REGION
  &basin=BALKHASH_ALAKOL
  &water_object=ili-river
  &problem_type=WATER_QUALITY
  &ref_url=https%3A%2F%2Fqazsu.gov.kz%2F%23%2Fobject%2Fili-river
```

| Параметр | Тип | Источник | Поле в Project |
|---|---|---|---|
| `source` | enum | Qazsu | `sourceSystem` (DIRECT/QAZSU/PARTNER) |
| `campaign` | string | Qazsu | `sourceCampaign` |
| `region` | enum Region | Qazsu | `region` (предзаполнение, можно изменить) |
| `basin` | enum WaterBasin | Qazsu | `basin` |
| `water_object` или `water_object_id` | id | Qazsu | `waterObjectId` (FK на WaterObject) |
| `problem_type` или `problem` | enum WaterProblemType | Qazsu | `problemType` |
| `ref_url` или `qazsu_ref` | URL | Qazsu | `qazsuRefUrl` (deeplink назад) |

Все параметры опциональны. Невалидные значения молча игнорируются.

---

## 4. API contract

### Reference data (для интеграции и для UI)

**`GET /api/qazsu/basins`** — 8 водохозяйственных бассейнов
```json
{ "basins": [ { "code": "BALKHASH_ALAKOL", "label": "Балхаш-Алакольский" }, ... ] }
```

**`GET /api/qazsu/problem-types`** — таксономия водных проблем (11 категорий)
```json
{ "problems": [ { "code": "WATER_QUALITY", "label": "Качество воды" }, ... ] }
```

**`GET /api/qazsu/water-objects?basin=&region=&type=`** — справочник водных объектов
```json
{
  "objects": [
    {
      "id": "ili-river",
      "name": "Иле",
      "nameKz": "Іле",
      "basin": "BALKHASH_ALAKOL",
      "type": "RIVER",
      "region": "ALMATY_REGION",
      "description": "Главная река бассейна Балхаш...",
      "qazsuUrl": null
    }
  ]
}
```

### Submission

**`POST /api/projects`** — приём проектов с qazsu-полями
```json
{
  "title": "...",
  "description": "...",
  "type": "RESEARCH",
  "schoolName": "...",
  "region": "ALMATY_REGION",
  "teacherName": "...",
  "students": [{ "name": "...", "grade": 9 }],

  "sourceSystem": "QAZSU",
  "sourceCampaign": "tamshy-2026",
  "basin": "BALKHASH_ALAKOL",
  "waterObjectId": "ili-river",
  "problemType": "WATER_QUALITY",
  "qazsuRefUrl": "https://qazsu.gov.kz/#/object/ili-river"
}
```
Если `waterObjectId` указан — сервис подтягивает объект из БД и пишет `qazsuSnapshot` (защита от будущих переименований).

### Filters (publicly accessible projects)

**`GET /api/projects?basin=BALKHASH_ALAKOL&problem=WATER_QUALITY&water_object=ili-river&source=QAZSU`**

Все параметры опциональны. Возвращает только APPROVED/WINNER (если статус не указан jury/admin'ом).

### Showcase (для встраивания в Qazsu)

**`GET /api/qazsu/showcase?basin=&problem=&region=&page=`**

Публичная витрина. Возвращает только проекты с `publishToQazsu=true` и статусом APPROVED/WINNER. **Не возвращает ПД** (нет ФИО ученика, учителя, телефона).

```json
{
  "projects": [
    {
      "id": "...",
      "title": "...",
      "summary": "...",
      "type": "RESEARCH",
      "status": "WINNER",
      "thumbnailUrl": "...",
      "region": "ALMATY_REGION",
      "basin": "BALKHASH_ALAKOL",
      "problemType": "WATER_QUALITY",
      "schoolName": "СШ №42",
      "publishedToQazsuAt": "2026-05-07T12:34:56.000Z",
      "waterObject": { "id": "ili-river", "name": "Иле", "type": "RIVER" }
    }
  ],
  "total": 12,
  "pages": 1,
  "page": 1
}
```

### Admin

**`PATCH /api/projects/:id`** с `{ "_qazsuPublish": true | false }` — переключение публикации в витрине Qazsu (только ADMIN, только APPROVED/WINNER).

---

## 5. Data model

### Enums (новые)
```prisma
enum SourceSystem      { DIRECT QAZSU PARTNER }
enum WaterBasin        { URAL_CASPIAN ARAL_SYRDARYA BALKHASH_ALAKOL IRTYSH ESIL NURA_SARYSU TOBOL_TURGAY SHU_TALAS }
enum WaterObjectType   { RIVER LAKE RESERVOIR CANAL GROUNDWATER GLACIER OTHER }
enum WaterProblemType  { WATER_QUALITY WATER_SCARCITY IRRIGATION LOSSES MONITORING EDUCATION TRANSBOUNDARY FLOOD GROUNDWATER INNOVATION OTHER }
```

### Project — новые поля
| Поле | Тип | Назначение |
|---|---|---|
| `sourceSystem` | SourceSystem (DIRECT) | Откуда пришла заявка |
| `sourceCampaign` | String? | Маркетинговая кампания |
| `basin` | WaterBasin? | Водохозяйственный бассейн |
| `waterObjectId` | String? FK | Конкретный объект (Иле, Балхаш...) |
| `problemType` | WaterProblemType? | Тип водной проблемы |
| `qazsuRefUrl` | String? | Deeplink назад в Qazsu |
| `qazsuSnapshot` | Json? | Снэпшот контекста на момент подачи |
| `publishToQazsu` | Boolean false | Флаг витрины |
| `publishedToQazsuAt` | DateTime? | Когда опубликовано |

### WaterObject (новая таблица — справочник)
```prisma
model WaterObject {
  id          String          @id   // напр. "ili-river"
  name        String
  nameKz      String?
  nameEn      String?
  basin       WaterBasin
  type        WaterObjectType
  region      Region?
  description String?         @db.Text
  qazsuUrl    String?
  createdAt   DateTime        @default(now())
  projects    Project[]
}
```

Seed: `prisma/seed-water-objects.ts` (~28 объектов: реки, озёра, водохранилища, каналы по 8 бассейнам).

### Индексы
- `Project_basin_idx`
- `Project_problemType_idx`
- `Project_sourceSystem_idx`
- `Project_publishToQazsu_idx` (partial WHERE publishToQazsu=true)
- `WaterObject_basin_idx`, `WaterObject_region_idx`

---

## 6. KPI dashboard (что меряем)

- Кол-во проектов из Qazsu (`sourceSystem=QAZSU`)
- Кол-во проектов с привязкой к бассейну/объекту/проблеме
- Распределение по 8 бассейнам и 11 темам
- Кол-во проектов в витрине Qazsu (`publishToQazsu=true`)
- Регионы-лидеры (топ-5 по числу заявок)
- Конверсия deeplink → submitted (через `sourceCampaign`)

Все эти срезы доступны через `/api/projects?...` и `/api/qazsu/showcase?...` или прямые SQL-запросы.

---

## 7. Что выкатывать

### Технически (этот спринт)
- [x] Prisma schema + migration
- [x] Seed справочника водных объектов
- [x] API endpoints `/api/qazsu/*`
- [x] Submit form: deeplink params + опциональные селекты
- [x] Витрина `/qazsu/showcase`
- [x] Admin: тогл `publishToQazsu`, фильтр по бассейну, столбцы Источник/Бассейн
- [ ] Применить SQL-миграцию в RDS (требует prometric/master)
- [ ] Запустить seed water objects в prod

### Контент (для запуска)
- [ ] Согласовать с ИАЦ официальные названия объектов
- [ ] Получить от Qazsu deeplink-структуру для встраивания
- [ ] Подготовить лендинг-баннер "Tamshy на основе данных Qazsu"
- [ ] Юр. согласование: какие поля можно публиковать в витрине

### Pilot
Начать с 1–2 бассейнов (Балхаш-Алакольский + Арало-Сырдарьинский) — там уже есть знаковые объекты (Иле, Балхаш, Сырдарья, Аральское море), и эти регионы (Алматинская, Кызылорда, Туркестан) исторически активны на Tamshy.
