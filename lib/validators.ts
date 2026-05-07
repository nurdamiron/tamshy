import { z } from 'zod';

export const emailAuthSchema = z
  .string({ error: 'Введите email' })
  .email('Некорректный email')
  .max(200, 'Email слишком длинный')
  .toLowerCase();

/** @deprecated Используется только в contestSubmitSchema */
export const phoneSchema = z
  .string({ error: 'Введите номер телефона' })
  .regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX');

export const otpSchema = z
  .string({ error: 'Введите код' })
  .length(6, 'Код должен содержать 6 цифр')
  .regex(/^\d{6}$/, 'Только цифры');

export const studentSchema = z.object({
  name:  z.string().min(2, 'Минимум 2 символа').max(200),
  grade: z.number().int().min(1).max(11),
});

// ── Qazsu integration enums ─────────────────────────────────────
export const waterBasinValues = [
  'URAL_CASPIAN', 'ARAL_SYRDARYA', 'BALKHASH_ALAKOL', 'IRTYSH',
  'ESIL', 'NURA_SARYSU', 'TOBOL_TURGAY', 'SHU_TALAS',
] as const;

export const waterProblemValues = [
  'WATER_QUALITY', 'WATER_SCARCITY', 'IRRIGATION', 'LOSSES',
  'MONITORING', 'EDUCATION', 'TRANSBOUNDARY', 'FLOOD',
  'GROUNDWATER', 'INNOVATION', 'OTHER',
] as const;

export const sourceSystemValues = ['DIRECT', 'QAZSU', 'PARTNER'] as const;

export const projectSchema = z.object({
  title:       z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  summary:     z.string().min(20, 'Минимум 20 символов').max(500, 'Максимум 500 символов').optional().nullable(),
  description: z.string().min(100, 'Минимум 100 символов').max(5000, 'Максимум 5000 символов'),
  type:        z.enum(['VIDEO', 'RESEARCH', 'ART', 'INVENTION', 'APP', 'OTHER']),
  fileUrl:     z.string().url().optional().nullable(),
  videoUrl:    z.string().url().optional().nullable(),
  schoolName:  z.string().min(2, 'Укажите школу').max(300),
  region: z.enum([
    'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
    'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
    'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
    'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
  ]),
  teacherName: z.string().min(2, 'Укажите ФИО учителя').max(200),
  // Команда: 1–5 участников. Первый — лидер (studentName + grade)
  students: z.array(studentSchema).min(1, 'Укажите хотя бы одного участника').max(5, 'Максимум 5 участников'),
  // Backward compat поля — деривируются из students[0] в API
  grade:       z.number().int().min(1).max(11).optional(),
  studentName: z.string().min(2).max(200).optional(),

  // ── Qazsu integration (все поля опциональны) ──
  sourceSystem:   z.enum(sourceSystemValues).optional(),
  sourceCampaign: z.string().max(100).optional().nullable(),
  basin:          z.enum(waterBasinValues).optional().nullable(),
  waterObjectId:  z.string().max(100).optional().nullable(),
  problemType:    z.enum(waterProblemValues).optional().nullable(),
  qazsuRefUrl:    z.string().url().max(500).optional().nullable(),
});

// Метки бассейнов (RU) для UI и переводов
export const basinLabels: Record<typeof waterBasinValues[number], string> = {
  URAL_CASPIAN:    'Жайык-Каспийский',
  ARAL_SYRDARYA:   'Арало-Сырдарьинский',
  BALKHASH_ALAKOL: 'Балхаш-Алакольский',
  IRTYSH:          'Ертіс (Иртышский)',
  ESIL:            'Есіль (Ишимский)',
  NURA_SARYSU:     'Нура-Сарысуский',
  TOBOL_TURGAY:    'Тобол-Тургайский',
  SHU_TALAS:       'Шу-Таласский',
};

export const problemLabels: Record<typeof waterProblemValues[number], string> = {
  WATER_QUALITY:  'Качество воды',
  WATER_SCARCITY: 'Дефицит воды',
  IRRIGATION:     'Ирригация',
  LOSSES:         'Потери воды',
  MONITORING:     'Мониторинг (citizen science)',
  EDUCATION:      'Экопросвещение',
  TRANSBOUNDARY:  'Трансграничные воды',
  FLOOD:          'Паводки',
  GROUNDWATER:    'Подземные воды',
  INNOVATION:     'Инновации (приложения, IoT)',
  OTHER:          'Другое',
};

// JURY: только APPROVED / REJECTED
export const juryScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  comment: z.string().min(10, 'Минимум 10 символов'),
  status: z.enum(['APPROVED', 'REJECTED']),
});

// ADMIN: дополнительно может ставить WINNER
export const adminScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  comment: z.string().min(10, 'Минимум 10 символов'),
  status: z.enum(['APPROVED', 'REJECTED', 'WINNER']),
});

export const contestSchema = z.object({
  title:       z.string().min(3, 'Минимум 3 символа').max(300),
  type:        z.string().min(2, 'Укажите тип конкурса').max(100),
  description: z.string().min(10, 'Минимум 10 символов').max(5000),
  rules:       z.string().max(5000).optional().nullable(),
  deadline:    z.string().min(1, 'Укажите дедлайн'),
  imageUrl:    z.string().url().optional().nullable(),
  documents:   z.array(z.object({
    title:    z.string().min(1).max(200),
    fileUrl:  z.string().url(),
    fileSize: z.string().max(50),
    fileType: z.string().max(20),
  })).optional(),
});

export const contestUpdateSchema = contestSchema
  .omit({ documents: true })
  .partial()
  .extend({
    status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
  });

export const contactSchema = z.object({
  name: z.string().min(2, 'Укажите имя').max(100, 'Имя слишком длинное'),
  email: z.string().email('Некорректный email').max(200),
  topic: z.string().min(2, 'Укажите тему').max(200, 'Тема слишком длинная'),
  message: z.string().min(10, 'Минимум 10 символов').max(2000, 'Максимум 2000 символов'),
  fileUrl: z.string().url().optional().nullable(),
});

export const updateMeSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов').trim(),
});

export const contestSubmitSchema = z.object({
  fullName:    z.string().min(2, 'Укажите ФИО').max(200, 'ФИО слишком длинное'),
  birthDate:   z.string().min(1, 'Укажите дату рождения').max(20),
  email:       z.string().email('Некорректный email').max(200),
  phone:       z.string().regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  institution: z.string().min(2, 'Укажите организацию').max(300, 'Название слишком длинное'),
  region:      z.enum([
    'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
    'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
    'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
    'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
  ], { error: 'Выберите регион' }),
  fileUrl: z.string().url().optional().nullable(),
});

export const materialSchema = z.object({
  title:       z.string().min(3, 'Минимум 3 символа').max(300),
  description: z.string().min(10, 'Минимум 10 символов').max(5000),
  format:      z.string().min(1, 'Укажите формат').max(20),
  fileUrl:     z.string().url('Некорректный URL файла'),
  fileSize:    z.string().min(1).max(50),
  type:        z.enum(['METHODICAL', 'BOOKLET', 'PRESENTATION', 'VIDEO'], { error: 'Некорректный тип' }),
  audience:    z.enum(['SCHOOL', 'STUDENT', 'TEACHER'], { error: 'Некорректная аудитория' }),
  year:        z.number().int().min(2000).max(2100),
  featured:    z.boolean().optional().default(false),
  imageUrl:    z.string().url().optional().nullable(),
});

export const materialUpdateSchema = materialSchema.partial();

export const newsSchema = z.object({
  title:      z.string().min(3, 'Минимум 3 символа').max(300),
  content:    z.string().min(10, 'Минимум 10 символов').max(50000),
  category:   z.enum(['NEWS', 'REPORT', 'PHOTO', 'VIDEO'], { error: 'Некорректная категория' }),
  imageUrl:   z.string().url().optional().nullable(),
  fileUrl:    z.string().url().optional().nullable(),
  photoCount: z.number().int().min(0).optional().nullable(),
});

export const newsUpdateSchema = newsSchema.partial();

export const newsletterSchema = z.object({
  email: z.string().email('Введите корректный email').max(200),
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
