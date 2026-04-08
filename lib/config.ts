/**
 * lib/config.ts — единственное место, где читается process.env
 *
 * Использование:
 *   import { config } from '@/lib/config';
 *   config.db.url          // DATABASE_URL
 *   config.s3.bucket       // AWS_S3_BUCKET_NAME
 *   config.auth.jwtSecret  // JWT_SECRET
 *
 * Правила:
 *   - Импортировать только в серверном коде (API routes, Server Components, lib/)
 *   - НЕ импортировать в 'use client' компонентах
 *   - Для браузера используй config.public.*  (NEXT_PUBLIC_*)
 */

type AppEnv = 'local' | 'staging' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ── helpers ──────────────────────────────────────────────────────────────────

function required(key: string): string {
  const val = process.env[key];
  if (!val?.trim()) {
    throw new Error(
      `[config] Missing required env var: ${key}\n` +
      `  → Copy .env.example to .env.local and fill in the value.`
    );
  }
  return val.trim();
}

function optional(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

function optionalBool(key: string, fallback = false): boolean {
  const val = process.env[key]?.trim();
  if (!val) return fallback;
  return val === '1' || val.toLowerCase() === 'true';
}

function optionalInt(key: string, fallback: number): number {
  const val = process.env[key]?.trim();
  const n = parseInt(val || '', 10);
  return isNaN(n) ? fallback : n;
}

// ── config object ─────────────────────────────────────────────────────────────

function buildConfig() {
  const appEnv = optional('APP_ENV', 'local') as AppEnv;
  const isProduction = appEnv === 'production';

  return {
    // ── app ────────────────────────────────────────────────────
    app: {
      env: appEnv,
      port: optionalInt('APP_PORT', 4004),
      isLocal: appEnv === 'local',
      isStaging: appEnv === 'staging',
      isProduction,
      logLevel: optional('LOG_LEVEL', isProduction ? 'info' : 'debug') as LogLevel,
      allowedOrigins: optional(
        'ALLOWED_ORIGINS',
        'http://localhost:4004'
      ).split(',').map((o) => o.trim()).filter(Boolean),
    },

    // ── public (browser-safe, NEXT_PUBLIC_*) ───────────────────
    public: {
      appUrl: optional('NEXT_PUBLIC_APP_URL', 'http://localhost:4004'),
    },

    // ── database ───────────────────────────────────────────────
    db: {
      url: required('DATABASE_URL'),
      // DIRECT_URL нужен при PgBouncer/RDS Proxy; если не задан — берём DATABASE_URL
      directUrl: optional('DIRECT_URL') || required('DATABASE_URL'),
    },

    // ── auth ───────────────────────────────────────────────────
    auth: {
      jwtSecret: required('JWT_SECRET'),
      cookieName: 'tamshy-token',
      tokenTtlSeconds: 7 * 24 * 60 * 60, // 7 дней
    },

    // ── AWS S3 ─────────────────────────────────────────────────
    s3: {
      region: optional('AWS_REGION', 'eu-north-1'),
      accessKeyId: optional('AWS_ACCESS_KEY_ID'),
      secretAccessKey: optional('AWS_SECRET_ACCESS_KEY'),
      // поддерживаем оба варианта имени переменной
      bucket: optional('AWS_S3_BUCKET_NAME') || optional('AWS_S3_BUCKET', 'tamshy-uploads'),
      localOnly: optionalBool('UPLOAD_LOCAL_ONLY'),
      // S3 включён, если есть ключи И не форсирован локальный режим
      get enabled() {
        return !this.localOnly && !!this.accessKeyId && !!this.secretAccessKey;
      },
    },

    // ── SMS (Mobizon) ──────────────────────────────────────────
    sms: {
      apiKey: optional('MOBIZON_API_KEY'),
      // dev-режим: ключ не задан → OTP = 000000, SMS не отправляются
      get devMode() {
        return !this.apiKey;
      },
    },

    // ── Rate limiting (Upstash Redis) ──────────────────────────
    redis: {
      url: optional('UPSTASH_REDIS_REST_URL'),
      token: optional('UPSTASH_REDIS_REST_TOKEN'),
      get enabled() {
        return !!this.url && !!this.token;
      },
    },
  } as const;
}

// ── singleton ─────────────────────────────────────────────────────────────────
// В Next.js модули кэшируются — config строится один раз при старте.

let _config: ReturnType<typeof buildConfig> | null = null;

function getConfig(): ReturnType<typeof buildConfig> {
  if (!_config) {
    _config = buildConfig();
  }
  return _config;
}

export const config = getConfig();
export type AppConfig = typeof config;
