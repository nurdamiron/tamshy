-- =============================================================================
-- scripts/create-indexes.sql
-- Индексы для оптимизации производительности Tamshy
--
-- Запуск: psql $DATABASE_URL -f scripts/create-indexes.sql
-- Или через RDS Query Editor / pgAdmin от имени владельца таблиц.
--
-- ВАЖНО: требуются права владельца таблиц или суперпользователя.
-- В Vercel + RDS Postgres запускать от имени мастер-пользователя.
-- Все индексы используют CONCURRENTLY — не блокируют таблицу при создании.
-- =============================================================================

-- ── Project ───────────────────────────────────────────────────────────────────
-- Основной запрос /api/projects: фильтрация по status + сортировка по createdAt
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_status_created
  ON "Project" (status, "createdAt" DESC);

-- Фильтрация по типу проекта и статусу
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_type_status
  ON "Project" (type, status);

-- Фильтрация по региону и статусу
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_region_status
  ON "Project" (region, status);

-- JOIN с User (author) и запросы в /cabinet
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_author
  ON "Project" ("authorId");

-- ── Vote ──────────────────────────────────────────────────────────────────────
-- Быстрый COUNT(*) при голосовании (дополнение к UNIQUE-индексу)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vote_project
  ON "Vote" ("projectId");

-- ── News ──────────────────────────────────────────────────────────────────────
-- Фильтрация по категории + сортировка по дате
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_category_created
  ON "News" (category, "createdAt" DESC);

-- ── Material ──────────────────────────────────────────────────────────────────
-- Фильтрация по типу и аудитории
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_material_type_audience
  ON "Material" (type, audience);

-- Быстрый поиск featured-материалов (для главной страницы)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_material_featured
  ON "Material" (featured) WHERE featured = true;

-- Сортировка по популярности
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_material_downloads
  ON "Material" (downloads DESC);

-- ── ContestSubmission ─────────────────────────────────────────────────────────
-- Фильтрация по статусу в /admin/submissions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_status
  ON "ContestSubmission" (status, "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_contest
  ON "ContestSubmission" ("contestId");

-- ── User ──────────────────────────────────────────────────────────────────────
-- Поиск по имени в /admin/users (уже есть unique на phone)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_name
  ON "User" (name) WHERE name IS NOT NULL;

-- =============================================================================
-- Проверка созданных индексов:
-- SELECT indexname, tablename FROM pg_indexes
--   WHERE schemaname = 'public'
--   ORDER BY tablename, indexname;
-- =============================================================================
