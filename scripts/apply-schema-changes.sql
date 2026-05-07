-- =============================================================================
-- scripts/apply-schema-changes.sql
-- Изменения схемы из аудита безопасности (2026-04-10)
--
-- Запуск от имени ВЛАДЕЛЬЦА таблиц (postgres master):
--   psql $DIRECT_URL -f scripts/apply-schema-changes.sql
--
-- Все ALTER TABLE выполняются с IF NOT EXISTS — безопасно запускать повторно.
-- =============================================================================

-- ── 1. User.tokenVersion ──────────────────────────────────────────────────────
-- Используется для инвалидации JWT после смены роли пользователя.
-- При смене роли через /api/admin/users инкрементируется → все активные
-- сессии пользователя становятся невалидными.

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- ── 2. ContestSubmission.userId ───────────────────────────────────────────────
-- Привязывает заявку на конкурс к аккаунту пользователя (было анонимно).
-- NULL допускается для заявок, поданных до этого изменения.

ALTER TABLE "ContestSubmission"
  ADD COLUMN IF NOT EXISTS "userId" TEXT;

ALTER TABLE "ContestSubmission"
  ADD CONSTRAINT IF NOT EXISTS "ContestSubmission_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL;

-- Индекс для быстрой проверки дублирования заявок (contestId + userId)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_user_contest
  ON "ContestSubmission" ("contestId", "userId")
  WHERE "userId" IS NOT NULL;

-- ── 3. Email-авторизация (заменяет SMS OTP) ───────────────────────────────────
-- Добавлено 2026-04-13: переход с phone/SMS на email/OTP

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "email" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"
  ON "User"("email");

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "consentEmail" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "consentEmailAt" TIMESTAMP(3);

-- =============================================================================
-- Проверка:
--   SELECT column_name, data_type, column_default, is_nullable
--   FROM information_schema.columns
--   WHERE table_name IN ('User', 'ContestSubmission')
--     AND column_name IN ('tokenVersion', 'userId', 'email', 'consentEmail', 'consentEmailAt')
--   ORDER BY table_name, column_name;
-- =============================================================================
