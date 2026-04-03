#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Поднимаем Postgres (docker compose)..."
docker compose up -d db

echo "→ Ждём healthcheck..."
for i in $(seq 1 40); do
  if docker compose exec -T db pg_isready -U tamshy -d tamshy >/dev/null 2>&1; then
    echo "→ База готова."
    exit 0
  fi
  sleep 1
done
echo "Таймаут: контейнер db не ответил." >&2
exit 1
