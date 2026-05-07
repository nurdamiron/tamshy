#!/bin/bash
# scripts/cron-news-ingest.sh
#
# Ежедневный ингест новостей министерства водных ресурсов с gov.kz.
# Запускается через cron на EC2 (см. /etc/cron.d/tamshy-news).
#
# Что делает:
#   1. Собирает URL'ы новостей с первых страниц листинга (по умолчанию 2 страницы).
#   2. Прогоняет ingest-govkz-news через Playwright/chromium.
#   3. Записи дублируются по fileUrl — повторный запуск только обновит существующие.
#
# Логи: /var/log/tamshy-news.log (cron rotation в /etc/logrotate.d/tamshy-news рекомендуется отдельно).
# Lock-файл: предотвращает двойной запуск, если предыдущий ещё выполняется.

set -euo pipefail

APP_DIR="${APP_DIR:-/app}"
LOG_FILE="${LOG_FILE:-/var/log/tamshy-news.log}"
LOCK_FILE="${LOCK_FILE:-/tmp/tamshy-news-ingest.lock}"
PAGES="${PAGES:-2}"  # сколько страниц листинга обходить

# ── Lock ───────────────────────────────────────────────────────────────────
exec 9> "$LOCK_FILE"
if ! flock -n 9; then
  echo "[$(date -Iseconds)] другой запуск уже идёт, выходим" >> "$LOG_FILE"
  exit 0
fi

# ── Run ────────────────────────────────────────────────────────────────────
{
  echo ""
  echo "==================================================="
  echo "[$(date -Iseconds)] start news ingest (PAGES=$PAGES)"
  echo "==================================================="

  cd "$APP_DIR"

  # Загружаем env (DATABASE_URL и т.д.)
  if [[ -f .env.production ]]; then
    set -a
    # shellcheck disable=SC1091
    . .env.production
    set +a
  else
    echo "ERROR: $APP_DIR/.env.production не найден"
    exit 1
  fi

  URLS_FILE=$(mktemp)
  trap 'rm -f "$URLS_FILE"' EXIT

  echo "-- собираю URLs..."
  PAGES="$PAGES" NODE_OPTIONS=--max-old-space-size=1024 \
    npx tsx scripts/govkz-list-urls.ts > "$URLS_FILE"
  COUNT=$(wc -l < "$URLS_FILE")
  echo "-- собрано $COUNT URL'ов"

  if [[ "$COUNT" -eq 0 ]]; then
    echo "WARN: ноль URL'ов — листинг недоступен или selector сломан"
    exit 0
  fi

  echo "-- ingest..."
  NODE_OPTIONS=--max-old-space-size=1024 \
    npx tsx scripts/ingest-govkz-news.ts --mode=playwright --file="$URLS_FILE"

  echo "[$(date -Iseconds)] done"
} >> "$LOG_FILE" 2>&1
