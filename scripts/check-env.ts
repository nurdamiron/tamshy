#!/usr/bin/env tsx
/**
 * scripts/check-env.ts — проверяет наличие всех переменных окружения.
 *
 * Использование:
 *   npx tsx scripts/check-env.ts              # проверяет APP_ENV из process.env (по умолчанию local)
 *   npx tsx scripts/check-env.ts --env staging
 *   npx tsx scripts/check-env.ts --env production
 *
 * Завершается с exit code 1 если чего-то не хватает.
 * Используется в CI перед deploy (см. .github/workflows/ci.yml).
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Загружаем .env файл если передан --file ────────────────────────────────
const args = process.argv.slice(2);
const envFlagIdx = args.indexOf('--env');
const fileFlagIdx = args.indexOf('--file');

const targetEnv = (envFlagIdx !== -1 ? args[envFlagIdx + 1] : null)
  ?? process.env.APP_ENV
  ?? 'local';

const envFile = fileFlagIdx !== -1 ? args[fileFlagIdx + 1] : null;

if (envFile) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      const value = rest.join('=').replace(/^["']|["']$/g, '');
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

// ── helpers (объявлены до использования) ──────────────────────────────────

const SAFE_DISPLAY_KEYS = new Set([
  'APP_ENV', 'APP_PORT', 'AWS_REGION', 'LOG_LEVEL',
  'NEXT_PUBLIC_APP_URL', 'ALLOWED_ORIGINS',
]);

function maskValue(key: string, val: string): string {
  if (SAFE_DISPLAY_KEYS.has(key)) return val;
  if (val.length <= 8) return '***';
  return val.slice(0, 4) + '***' + val.slice(-2);
}

// ── Определение required/optional по окружению ────────────────────────────

type VarSpec = {
  key: string;
  description: string;
  required: boolean;
  envs: ('local' | 'staging' | 'production')[];
};

const VARS: VarSpec[] = [
  // App
  { key: 'APP_ENV',             description: 'local | staging | production',                required: false, envs: ['local', 'staging', 'production'] },
  { key: 'NEXT_PUBLIC_APP_URL', description: 'Публичный URL приложения',                    required: false, envs: ['staging', 'production'] },
  { key: 'ALLOWED_ORIGINS',     description: 'Разрешённые CORS origins через запятую',      required: false, envs: ['staging', 'production'] },
  { key: 'LOG_LEVEL',           description: 'debug | info | warn | error',                 required: false, envs: ['local', 'staging', 'production'] },

  // Database
  { key: 'DATABASE_URL',        description: 'PostgreSQL connection string',                required: true,  envs: ['local', 'staging', 'production'] },
  { key: 'DIRECT_URL',          description: 'Прямой URL к БД (для Prisma без pooler)',     required: false, envs: ['staging', 'production'] },

  // Auth
  { key: 'JWT_SECRET',          description: 'Секрет для подписи JWT (мин. 32 символа)',    required: true,  envs: ['local', 'staging', 'production'] },

  // AWS S3
  { key: 'AWS_REGION',          description: 'AWS регион (eu-north-1)',                     required: false, envs: ['staging', 'production'] },
  { key: 'AWS_ACCESS_KEY_ID',   description: 'AWS ключ доступа',                            required: true,  envs: ['staging', 'production'] },
  { key: 'AWS_SECRET_ACCESS_KEY', description: 'AWS секретный ключ',                        required: true,  envs: ['staging', 'production'] },
  { key: 'AWS_S3_BUCKET_NAME',  description: 'Имя S3 бакета',                              required: true,  envs: ['staging', 'production'] },

  // SMS (без ключа — dev-режим OTP 000000, SMS не отправляются)
  { key: 'MOBIZON_API_KEY',     description: 'API ключ Mobizon (без него SMS отключены)',   required: false, envs: ['staging', 'production'] },

  // Redis (без него rate limiting отключён — допустимо)
  { key: 'UPSTASH_REDIS_REST_URL',   description: 'Upstash Redis REST URL (rate limiting)', required: false, envs: ['staging', 'production'] },
  { key: 'UPSTASH_REDIS_REST_TOKEN', description: 'Upstash Redis REST Token',               required: false, envs: ['staging', 'production'] },
];

// ── Проверка ───────────────────────────────────────────────────────────────

const env = targetEnv as 'local' | 'staging' | 'production';

const BOLD  = '\x1b[1m';
const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN  = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}🔍 Tamshy — проверка переменных окружения${RESET}`);
console.log(`   Окружение: ${BOLD}${env}${RESET}\n`);

const relevantVars = VARS.filter((v) => v.envs.includes(env));

// Дедупликация по ключу (берём первую запись)
const seen = new Set<string>();
const uniqueVars = relevantVars.filter((v) => {
  if (seen.has(v.key)) return false;
  seen.add(v.key);
  return true;
});

const missing: VarSpec[] = [];
const warnings: VarSpec[] = [];
const ok: VarSpec[] = [];

for (const spec of uniqueVars) {
  const val = process.env[spec.key]?.trim();
  if (!val) {
    if (spec.required) {
      missing.push(spec);
    } else {
      warnings.push(spec);
    }
  } else {
    ok.push(spec);
  }
}

// ── Вывод результатов ──────────────────────────────────────────────────────

for (const v of ok) {
  const masked = maskValue(v.key, process.env[v.key]!);
  console.log(`  ${GREEN}✓${RESET} ${v.key.padEnd(32)} ${masked}`);
}

for (const v of warnings) {
  console.log(`  ${YELLOW}⚠${RESET} ${v.key.padEnd(32)} ${YELLOW}не задана${RESET} (необязательна) — ${v.description}`);
}

for (const v of missing) {
  console.log(`  ${RED}✗${RESET} ${v.key.padEnd(32)} ${RED}ОТСУТСТВУЕТ${RESET} — ${v.description}`);
}

// ── Итог ───────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));

if (missing.length > 0) {
  console.log(`\n${RED}${BOLD}✗ Не хватает ${missing.length} обязательных переменных:${RESET}`);
  for (const v of missing) {
    console.log(`  ${RED}→ ${v.key}${RESET}`);
  }
  console.log(`\n  Добавь их в .env.local или через secrets manager.\n`);
  process.exit(1);
} else if (warnings.length > 0) {
  console.log(`\n${YELLOW}${BOLD}⚠  Все обязательные переменные заданы.${RESET}`);
  console.log(`${YELLOW}   ${warnings.length} необязательных не задано (OK для окружения "${env}").${RESET}\n`);
  process.exit(0);
} else {
  console.log(`\n${GREEN}${BOLD}✓  Все переменные заданы. Окружение готово.${RESET}\n`);
  process.exit(0);
}

