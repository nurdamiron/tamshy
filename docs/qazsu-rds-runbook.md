# Runbook: применить Qazsu-миграцию в RDS

Дата: 2026-05-07
Связанные документы: [qazsu-integration.md](./qazsu-integration.md), [qazsu-ingest.md](./qazsu-ingest.md)

Этот runbook описывает **точные команды**, чтобы залить миграцию `20260507_qazsu_integration` и реальные данные в production-БД на AWS RDS PostgreSQL.

---

## 0. Предусловия

- [ ] У тебя есть пароль пользователя **prometric** для prod RDS (см. memory `rds_master_creds.md`, актуально с 2026-04-13).
- [ ] `DIRECT_URL` известен (из Vercel env или `.env.local`). Это прямое подключение к RDS, минуя pooler.
- [ ] Локально установлен `psql`: `brew install libpq && brew link --force libpq`.
- [ ] Из репозитория Tamshy на ветке `main` (или твоей feature branch с этими изменениями).

> **Важно:** все DDL — идемпотентны (`CREATE TYPE ... EXCEPTION WHEN duplicate_object`, `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`). Повторный запуск безопасен.

---

## 1. Проверка состояния

```bash
# Из корня репозитория
cd /Users/nurdauletakhmatov/Desktop/tamshy

# Загрузи DIRECT_URL в shell (или используй ENV из Vercel)
export DIRECT_URL="postgresql://prometric:<password>@<host>.rds.amazonaws.com:5432/<db>?sslmode=require"

# Проверка коннекта
psql "$DIRECT_URL" -c "SELECT current_user, current_database(), now();"
```

Ожидаемо: `prometric | tamshy | <timestamp>`.

---

## 2. Применить миграцию

```bash
# DDL: новые enum'ы, таблица WaterObject, поля Project, индексы
psql "$DIRECT_URL" -f prisma/migrations/20260507_qazsu_integration/migration.sql
```

**Что делает:**
- Создаёт enum `SourceSystem`, `WaterBasin`, `WaterObjectType`, `WaterProblemType`
- Создаёт таблицу `WaterObject` + 2 индекса
- Добавляет 9 колонок в `Project`
- Создаёт 4 индекса (включая partial index по `publishToQazsu = true`)

**Проверка:**

```bash
psql "$DIRECT_URL" <<'SQL'
-- Должно вернуть 9 строк
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Project' AND column_name IN (
  'sourceSystem','sourceCampaign','basin','waterObjectId','problemType',
  'qazsuRefUrl','qazsuSnapshot','publishToQazsu','publishedToQazsuAt'
)
ORDER BY column_name;

-- Должно вернуть 1
SELECT count(*) AS water_objects FROM "WaterObject";

-- Должно показать 4 индекса
SELECT indexname FROM pg_indexes
WHERE tablename = 'Project' AND indexname LIKE '%basin%' OR indexname LIKE '%publishToQazsu%';
SQL
```

---

## 3. Залить справочник водных объектов (~70 шт.)

```bash
# Использует DIRECT_URL из ENV
npx tsx prisma/seed-water-objects.ts
```

Ожидаемый вывод:
```
  ✓ 70+ water objects (Qazsu reference)
```

**Проверка:**
```bash
psql "$DIRECT_URL" -c 'SELECT basin, count(*) FROM "WaterObject" GROUP BY basin ORDER BY 1;'
```

---

## 4. Backfill существующих проектов

Сначала dry-run, посмотреть что будет обновлено:

```bash
npx tsx scripts/backfill-qazsu.ts
```

Если результат адекватный — применяем:

```bash
# Только basin для всех проектов
npx tsx scripts/backfill-qazsu.ts --apply

# Опционально: автоматически опубликовать всех WINNER в витрину Qazsu
npx tsx scripts/backfill-qazsu.ts --apply --publish-winners
```

После этого `/admin/qazsu-stats` сразу покажет реальные цифры по бассейнам, регионам и победителям.

---

## 5. Обновить Prisma client на сервере

Vercel / прод-деплой автоматически делает `prisma generate` при `npm run build`. Локально — то же самое после pull:

```bash
npx prisma generate
```

После этого новые типы (`WaterBasin`, `WaterObjectType`, ...) доступны в коде.

---

## 6. Откат (rollback)

Если что-то пошло не так:

```sql
-- Удалить новые колонки (необратимо для данных, но схема вернётся к pre-migration)
ALTER TABLE "Project"
  DROP COLUMN IF EXISTS "sourceSystem",
  DROP COLUMN IF EXISTS "sourceCampaign",
  DROP COLUMN IF EXISTS "basin",
  DROP COLUMN IF EXISTS "waterObjectId",
  DROP COLUMN IF EXISTS "problemType",
  DROP COLUMN IF EXISTS "qazsuRefUrl",
  DROP COLUMN IF EXISTS "qazsuSnapshot",
  DROP COLUMN IF EXISTS "publishToQazsu",
  DROP COLUMN IF EXISTS "publishedToQazsuAt";

DROP TABLE IF EXISTS "WaterObject";
DROP TYPE IF EXISTS "SourceSystem";
DROP TYPE IF EXISTS "WaterBasin";
DROP TYPE IF EXISTS "WaterObjectType";
DROP TYPE IF EXISTS "WaterProblemType";
```

> **Перед откатом** убедись, что нет проектов, ссылающихся на удаляемые колонки/таблицы — иначе FK constraint выкинет ошибку. На практике лучше сначала восстановить данные из бэкапа RDS snapshot.

---

## 7. После миграции — что станет работать

| Endpoint / страница | До миграции | После миграции |
|---|---|---|
| `/api/qazsu/basins` | ✅ (статика) | ✅ |
| `/api/qazsu/problem-types` | ✅ (статика) | ✅ |
| `/api/qazsu/water-objects` | 500 (нет таблицы) | ✅ возвращает 70+ объектов |
| `/api/qazsu/showcase` | 500 (нет колонок) | ✅ |
| `/api/admin/qazsu-stats` | 500 (нет колонок) | ✅ |
| `/qazsu/showcase` | пустая | ✅ с проектами после `--publish-winners` |
| `/admin/qazsu-stats` | пустая | ✅ с реальными цифрами после backfill |
| `/submit?source=qazsu&...` | работает, но без БД-связи | ✅ полная связка с WaterObject |

---

## 8. Контрольный чек-лист

- [ ] `psql "$DIRECT_URL" -c "SELECT 1"` → ок
- [ ] `psql "$DIRECT_URL" -f prisma/migrations/20260507_qazsu_integration/migration.sql` → без ошибок
- [ ] `npx tsx prisma/seed-water-objects.ts` → ✓ 70+ water objects
- [ ] `npx tsx scripts/backfill-qazsu.ts --apply --publish-winners` → ✓ N проектов
- [ ] `curl https://tamshy.kz/api/qazsu/water-objects | jq '.objects | length'` → 70+
- [ ] `curl https://tamshy.kz/api/qazsu/showcase | jq '.total'` → > 0
- [ ] Открыть `/qazsu/showcase` в браузере → видны карточки победителей
- [ ] Открыть `/admin/qazsu-stats` → реальные распределения по бассейнам
