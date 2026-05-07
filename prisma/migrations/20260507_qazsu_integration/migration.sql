-- =============================================================================
-- Qazsu integration migration (2026-05-07)
--
-- Adds: SourceSystem, WaterBasin, WaterObjectType, WaterProblemType enums.
--       Qazsu fields on Project. WaterObject reference table.
--
-- Запуск от имени владельца (postgres master, либо prometric):
--   psql $DIRECT_URL -f prisma/migrations/20260507_qazsu_integration/migration.sql
--
-- Все DDL — идемпотентны (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- =============================================================================

-- ── Enums ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "SourceSystem" AS ENUM ('DIRECT', 'QAZSU', 'PARTNER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "WaterBasin" AS ENUM (
    'URAL_CASPIAN', 'ARAL_SYRDARYA', 'BALKHASH_ALAKOL', 'IRTYSH',
    'ESIL', 'NURA_SARYSU', 'TOBOL_TURGAY', 'SHU_TALAS'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "WaterObjectType" AS ENUM (
    'RIVER', 'LAKE', 'RESERVOIR', 'CANAL', 'GROUNDWATER', 'GLACIER', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "WaterProblemType" AS ENUM (
    'WATER_QUALITY', 'WATER_SCARCITY', 'IRRIGATION', 'LOSSES',
    'MONITORING', 'EDUCATION', 'TRANSBOUNDARY', 'FLOOD',
    'GROUNDWATER', 'INNOVATION', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── WaterObject reference table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "WaterObject" (
  "id"          TEXT PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "nameKz"      TEXT,
  "nameEn"      TEXT,
  "basin"       "WaterBasin" NOT NULL,
  "type"        "WaterObjectType" NOT NULL,
  "region"      "Region",
  "description" TEXT,
  "qazsuUrl"    TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "WaterObject_basin_idx"  ON "WaterObject"("basin");
CREATE INDEX IF NOT EXISTS "WaterObject_region_idx" ON "WaterObject"("region");

-- ── Project: qazsu integration fields ───────────────────────────────────────
ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "sourceSystem"       "SourceSystem"     NOT NULL DEFAULT 'DIRECT',
  ADD COLUMN IF NOT EXISTS "sourceCampaign"     TEXT,
  ADD COLUMN IF NOT EXISTS "basin"              "WaterBasin",
  ADD COLUMN IF NOT EXISTS "waterObjectId"      TEXT,
  ADD COLUMN IF NOT EXISTS "problemType"        "WaterProblemType",
  ADD COLUMN IF NOT EXISTS "qazsuRefUrl"        TEXT,
  ADD COLUMN IF NOT EXISTS "qazsuSnapshot"      JSONB,
  ADD COLUMN IF NOT EXISTS "publishToQazsu"     BOOLEAN            NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedToQazsuAt" TIMESTAMP(3);

-- FK Project.waterObjectId → WaterObject.id (SET NULL on delete, чтобы не терять проекты)
DO $$ BEGIN
  ALTER TABLE "Project"
    ADD CONSTRAINT "Project_waterObjectId_fkey"
    FOREIGN KEY ("waterObjectId") REFERENCES "WaterObject"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Индексы для аналитики и фильтрации.
-- CONCURRENTLY вынесено в scripts/create-indexes.sql (требует прав DBA),
-- но базовые индексы создаём через обычный CREATE INDEX IF NOT EXISTS.
CREATE INDEX IF NOT EXISTS "Project_basin_idx"         ON "Project"("basin");
CREATE INDEX IF NOT EXISTS "Project_problemType_idx"   ON "Project"("problemType");
CREATE INDEX IF NOT EXISTS "Project_sourceSystem_idx"  ON "Project"("sourceSystem");
CREATE INDEX IF NOT EXISTS "Project_publishToQazsu_idx" ON "Project"("publishToQazsu") WHERE "publishToQazsu" = true;

-- =============================================================================
-- Проверка:
--   SELECT column_name, data_type
--   FROM information_schema.columns
--   WHERE table_name = 'Project' AND column_name LIKE ANY (ARRAY[
--     'sourceSystem','basin','waterObjectId','problemType',
--     'qazsuRefUrl','qazsuSnapshot','publishToQazsu','publishedToQazsuAt'
--   ]) ORDER BY column_name;
--
--   SELECT count(*) FROM "WaterObject";
-- =============================================================================
