import { describe, it, expect } from 'vitest';
import {
  phoneSchema,
  otpSchema,
  projectSchema,
  juryScoreSchema,
  adminScoreSchema,
  contactSchema,
  updateMeSchema,
  contestSubmitSchema,
  materialSchema,
  newsSchema,
  newsletterSchema,
  contestSchema,
  contestUpdateSchema,
} from '@/lib/validators';

// ── phoneSchema ───────────────────────────────────────────────────────────────
describe('phoneSchema', () => {
  it('accepts valid KZ phone', () => {
    expect(phoneSchema.safeParse('+77001234567').success).toBe(true);
  });
  it('rejects missing +7 prefix', () => {
    expect(phoneSchema.safeParse('87001234567').success).toBe(false);
  });
  it('rejects too short number', () => {
    expect(phoneSchema.safeParse('+7700123456').success).toBe(false);
  });
  it('rejects non-digits after +7', () => {
    expect(phoneSchema.safeParse('+7700ABC4567').success).toBe(false);
  });
});

// ── otpSchema ─────────────────────────────────────────────────────────────────
describe('otpSchema', () => {
  it('accepts 6 digits', () => {
    expect(otpSchema.safeParse('123456').success).toBe(true);
  });
  it('rejects 5 digits', () => {
    expect(otpSchema.safeParse('12345').success).toBe(false);
  });
  it('rejects letters', () => {
    expect(otpSchema.safeParse('12345a').success).toBe(false);
  });
});

// ── projectSchema ─────────────────────────────────────────────────────────────
describe('projectSchema', () => {
  const base = {
    title: 'Чистая вода',
    description: 'a'.repeat(100),
    type: 'RESEARCH',
    schoolName: 'НИШ Астана',
    region: 'ASTANA',
    teacherName: 'Иван Иванов',
    grade: 8,
  };

  it('accepts valid project', () => {
    expect(projectSchema.safeParse(base).success).toBe(true);
  });
  it('rejects too short title', () => {
    expect(projectSchema.safeParse({ ...base, title: 'Hi' }).success).toBe(false);
  });
  it('rejects too short description', () => {
    expect(projectSchema.safeParse({ ...base, description: 'short' }).success).toBe(false);
  });
  it('rejects invalid type enum', () => {
    expect(projectSchema.safeParse({ ...base, type: 'UNKNOWN' }).success).toBe(false);
  });
  it('rejects grade > 11', () => {
    expect(projectSchema.safeParse({ ...base, grade: 12 }).success).toBe(false);
  });
  it('rejects invalid region', () => {
    expect(projectSchema.safeParse({ ...base, region: 'MOSCOW' }).success).toBe(false);
  });
});

// ── juryScoreSchema ───────────────────────────────────────────────────────────
describe('juryScoreSchema', () => {
  it('accepts APPROVED', () => {
    expect(juryScoreSchema.safeParse({ score: 7, comment: 'Отличная работа', status: 'APPROVED' }).success).toBe(true);
  });
  it('accepts REJECTED', () => {
    expect(juryScoreSchema.safeParse({ score: 2, comment: 'Требует доработки', status: 'REJECTED' }).success).toBe(true);
  });
  it('rejects WINNER — JURY не может ставить WINNER', () => {
    expect(juryScoreSchema.safeParse({ score: 10, comment: 'Победитель!', status: 'WINNER' }).success).toBe(false);
  });
  it('rejects score > 10', () => {
    expect(juryScoreSchema.safeParse({ score: 11, comment: 'Комментарий', status: 'APPROVED' }).success).toBe(false);
  });
  it('rejects too short comment', () => {
    expect(juryScoreSchema.safeParse({ score: 5, comment: 'ok', status: 'APPROVED' }).success).toBe(false);
  });
});

// ── adminScoreSchema ──────────────────────────────────────────────────────────
describe('adminScoreSchema', () => {
  it('accepts WINNER — ADMIN может', () => {
    expect(adminScoreSchema.safeParse({ score: 10, comment: 'Победитель конкурса', status: 'WINNER' }).success).toBe(true);
  });
  it('accepts APPROVED', () => {
    expect(adminScoreSchema.safeParse({ score: 8, comment: 'Хорошая работа!', status: 'APPROVED' }).success).toBe(true);
  });
});

// ── updateMeSchema ────────────────────────────────────────────────────────────
describe('updateMeSchema', () => {
  it('accepts valid name', () => {
    expect(updateMeSchema.safeParse({ name: 'Арман' }).success).toBe(true);
  });
  it('rejects empty name', () => {
    expect(updateMeSchema.safeParse({ name: '' }).success).toBe(false);
  });
  it('rejects name > 200 chars', () => {
    expect(updateMeSchema.safeParse({ name: 'a'.repeat(201) }).success).toBe(false);
  });
});

// ── contestSubmitSchema ───────────────────────────────────────────────────────
describe('contestSubmitSchema', () => {
  const base = {
    fullName: 'Жанар Сейткали',
    birthDate: '2005-03-15',
    email: 'test@example.com',
    phone: '+77771234567',
    institution: 'НИШ Алматы',
    region: 'ALMATY',
  };

  it('accepts valid submission', () => {
    expect(contestSubmitSchema.safeParse(base).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(contestSubmitSchema.safeParse({ ...base, email: 'notanemail' }).success).toBe(false);
  });
  it('rejects invalid phone', () => {
    expect(contestSubmitSchema.safeParse({ ...base, phone: '87771234567' }).success).toBe(false);
  });
  it('rejects invalid region', () => {
    expect(contestSubmitSchema.safeParse({ ...base, region: 'INVALID' }).success).toBe(false);
  });
});

// ── materialSchema ────────────────────────────────────────────────────────────
describe('materialSchema', () => {
  const base = {
    title: 'Методическое пособие',
    description: 'Описание материала для учителей'.padEnd(10, '.'),
    format: 'PDF',
    fileUrl: 'https://cdn.example.com/file.pdf',
    fileSize: '2.4 MB',
    type: 'METHODICAL',
    audience: 'TEACHER',
    year: 2024,
  };

  it('accepts valid material', () => {
    expect(materialSchema.safeParse(base).success).toBe(true);
  });
  it('rejects invalid type', () => {
    expect(materialSchema.safeParse({ ...base, type: 'UNKNOWN' }).success).toBe(false);
  });
  it('rejects invalid audience', () => {
    expect(materialSchema.safeParse({ ...base, audience: 'PUBLIC' }).success).toBe(false);
  });
  it('rejects year out of range', () => {
    expect(materialSchema.safeParse({ ...base, year: 1999 }).success).toBe(false);
  });
});

// ── newsSchema ────────────────────────────────────────────────────────────────
describe('newsSchema', () => {
  const base = {
    title: 'Открытие нового сезона',
    content: 'Подробности мероприятия...'.padEnd(10, '.'),
    category: 'NEWS',
  };

  it('accepts valid news', () => {
    expect(newsSchema.safeParse(base).success).toBe(true);
  });
  it('rejects invalid category', () => {
    expect(newsSchema.safeParse({ ...base, category: 'BLOG' }).success).toBe(false);
  });
});

// ── newsletterSchema ──────────────────────────────────────────────────────────
describe('newsletterSchema', () => {
  it('accepts valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});

// ── contactSchema ─────────────────────────────────────────────────────────────
describe('contactSchema', () => {
  const base = {
    name: 'Алия',
    email: 'aliya@example.com',
    topic: 'Вопрос по платформе',
    message: 'Хотелось бы узнать подробнее.',
  };

  it('accepts valid contact', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it('rejects too short message', () => {
    expect(contactSchema.safeParse({ ...base, message: 'Кратко' }).success).toBe(false);
  });
});

// ── contestSchema ─────────────────────────────────────────────────────────────
describe('contestSchema', () => {
  const base = {
    title: 'Экоконкурс 2025',
    type: 'ЭССЕ',
    description: 'Описание конкурса для молодёжи',
    deadline: '2025-12-31',
  };

  it('accepts valid contest', () => {
    expect(contestSchema.safeParse(base).success).toBe(true);
  });
  it('rejects missing title', () => {
    expect(contestSchema.safeParse({ ...base, title: '' }).success).toBe(false);
  });
});

// ── contestUpdateSchema ───────────────────────────────────────────────────────
describe('contestUpdateSchema', () => {
  it('accepts partial update', () => {
    expect(contestUpdateSchema.safeParse({ status: 'COMPLETED' }).success).toBe(true);
  });
  it('rejects invalid status', () => {
    expect(contestUpdateSchema.safeParse({ status: 'ARCHIVED' }).success).toBe(false);
  });
  it('accepts empty object (all optional)', () => {
    expect(contestUpdateSchema.safeParse({}).success).toBe(true);
  });
});
