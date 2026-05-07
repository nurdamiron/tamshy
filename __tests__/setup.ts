import { vi } from 'vitest';

// Мок Prisma — все тесты изолированы от реальной БД
vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
      findFirst:  vi.fn(),
      create:     vi.fn(),
      update:     vi.fn(),
      findMany:   vi.fn(),
      count:      vi.fn(),
      groupBy:    vi.fn(),
    },
    vote: {
      findUnique: vi.fn(),
      create:     vi.fn(),
      delete:     vi.fn(),
      count:      vi.fn(),
    },
    contest: {
      findUnique: vi.fn(),
    },
    contestSubmission: {
      findFirst: vi.fn(),
      create:    vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update:     vi.fn(),
    },
    waterObject: {
      findUnique: vi.fn(),
      findMany:   vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Мок SMS — тесты не отправляют реальные сообщения
vi.mock('@/lib/sms', () => ({
  sendNotification: vi.fn().mockResolvedValue(undefined),
}));

// Мок email — тесты не отправляют реальную почту
vi.mock('@/lib/email', () => ({
  sendProjectSubmittedEmail: vi.fn().mockResolvedValue(undefined),
  sendProjectStatusEmail:    vi.fn().mockResolvedValue(undefined),
}));
