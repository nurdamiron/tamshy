import { z } from 'zod';

export const phoneSchema = z
  .string({ error: 'Введите номер телефона' })
  .regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX');

export const otpSchema = z
  .string({ error: 'Введите код' })
  .length(6, 'Код должен содержать 6 цифр')
  .regex(/^\d{6}$/, 'Только цифры');

export const projectSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  description: z.string().min(100, 'Минимум 100 символов').max(5000, 'Максимум 5000 символов'),
  type: z.enum(['VIDEO', 'RESEARCH', 'ART', 'INVENTION', 'APP', 'OTHER']),
  fileUrl: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  schoolName: z.string().min(2, 'Укажите школу'),
  region: z.enum([
    'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
    'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
    'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
    'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
  ]),
  teacherName: z.string().min(2, 'Укажите ФИО учителя'),
  grade: z.number().int().min(1).max(11),
});

export const juryScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  comment: z.string().min(10, 'Минимум 10 символов'),
  status: z.enum(['APPROVED', 'REJECTED', 'WINNER']),
});

export const regionLabels: Record<string, string> = {
  ASTANA: 'Астана',
  ALMATY: 'Алматы',
  SHYMKENT: 'Шымкент',
  AKTOBE: 'Актобе',
  KARAGANDA: 'Караганда',
  MANGYSTAU: 'Мангистау',
  TURKESTAN: 'Туркестан',
  ZHAMBYL: 'Жамбыл',
  ALMATY_REGION: 'Алматинская обл.',
  ATYRAU: 'Атырау',
  AKTAU: 'Актау',
  PAVLODAR: 'Павлодар',
  SEMEY: 'Семей',
  TALDYKORGAN: 'Талдыкорган',
  KYZYLORDA: 'Кызылорда',
  TARAZ: 'Тараз',
  PETROPAVLOVSK: 'Петропавловск',
  ORAL: 'Орал',
  KOSTANAY: 'Костанай',
};
