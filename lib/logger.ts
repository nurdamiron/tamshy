/**
 * lib/logger.ts — структурированное логирование
 *
 * Выводит JSON-строки, которые удобно парсить в CloudWatch / Datadog / Vercel.
 * В dev-режиме форматирует вывод для удобства чтения.
 *
 * Использование:
 *   import { logger } from '@/lib/logger';
 *   logger.error({ err: error, userId: 'abc' }, 'Vote failed');
 *   logger.info({ projectId: 'xyz' }, 'Project created');
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

const isDev = process.env.NODE_ENV === 'development';
const LOG_LEVEL = (process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info')) as LogLevel;

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[LOG_LEVEL];
}

function serialize(level: LogLevel, ctx: LogContext, msg: string): string {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...ctx,
  };

  // В dev — читаемый формат
  if (isDev) {
    const prefix = `[${level.toUpperCase()}]`;
    const ctxStr = Object.keys(ctx).length
      ? ' ' + JSON.stringify(ctx)
      : '';
    return `${prefix} ${msg}${ctxStr}`;
  }

  return JSON.stringify(entry);
}

function log(level: LogLevel, ctx: LogContext, msg: string): void {
  if (!shouldLog(level)) return;

  const line = serialize(level, ctx, msg);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (ctx: LogContext, msg: string) => log('debug', ctx, msg),
  info:  (ctx: LogContext, msg: string) => log('info',  ctx, msg),
  warn:  (ctx: LogContext, msg: string) => log('warn',  ctx, msg),
  error: (ctx: LogContext, msg: string) => log('error', ctx, msg),
};
