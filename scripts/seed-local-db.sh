#!/usr/bin/env bash
# Локальная БД с полным сидом (Unsplash-обложки и т.д.).
# Требуется: Docker Desktop запущен → затем: npm run db:local
# Или только этот скрипт после: docker compose up -d db
set -euo pipefail
cd "$(dirname "$0")/.."

export DATABASE_URL="${DATABASE_URL:-postgresql://tamshy:tamshy@127.0.0.1:5432/tamshy}"
export DIRECT_URL="${DIRECT_URL:-postgresql://tamshy:tamshy@127.0.0.1:5432/tamshy}"

echo "→ prisma db push ($DATABASE_URL)"
npx prisma db push
echo "→ prisma db seed"
npx prisma db seed
echo "✓ Готово. Для dev укажи в .env.local:"
echo '  DATABASE_URL="postgresql://tamshy:tamshy@127.0.0.1:5432/tamshy"'
echo '  DIRECT_URL="postgresql://tamshy:tamshy@127.0.0.1:5432/tamshy"'
