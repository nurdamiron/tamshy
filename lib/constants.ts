import { mediaUrl } from './media';

/** Публичный Instagram Tamshy */
export const INSTAGRAM_URL = 'https://www.instagram.com/tamshy__kz/';

// Labels removed — use useTranslations('types') in components
export const PROJECT_TYPES = [
  { value: 'VIDEO', icon: 'video', color: 'blue' },
  { value: 'RESEARCH', icon: 'research', color: 'purple' },
  { value: 'ART', icon: 'art', color: 'amber' },
  { value: 'INVENTION', icon: 'invention', color: 'orange' },
  { value: 'APP', icon: 'app', color: 'teal' },
  { value: 'OTHER', icon: 'other', color: 'gray' },
] as const;

export const REGIONS = [
  'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
  'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
  'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
  'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
] as const;

// Grade labels — use useTranslations('common') with gradeLabel key in components
export const GRADES = Array.from({ length: 11 }, (_, i) => ({
  value: String(i + 1),
  num: i + 1,
}));

/**
 * Обложки верхней части карточек «Жоба түрлері» на главной.
 * Пустая строка = только градиент. Можно переопределить через .env.
 */
export const CATEGORY_COVER_URLS: Record<string, string> = {
  VIDEO:
    process.env.NEXT_PUBLIC_CATEGORY_COVER_VIDEO ||
    mediaUrl('1437482078695-73f5ca6c96e2'),
  RESEARCH:
    process.env.NEXT_PUBLIC_CATEGORY_COVER_RESEARCH ||
    mediaUrl('1498084393753-b411b2d26b34'),
  ART:
    process.env.NEXT_PUBLIC_CATEGORY_COVER_ART ||
    mediaUrl('1542601906990-b4d3fb778b09'),
  INVENTION:
    process.env.NEXT_PUBLIC_CATEGORY_COVER_INVENTION ||
    mediaUrl('1507525428034-b723cf961d3e'),
  APP:
    process.env.NEXT_PUBLIC_CATEGORY_COVER_APP ||
    mediaUrl('1437482078695-73f5ca6c96e2'),
};

/** Опциональный фон hero (поверх — градиент для читаемости текста). */
export const HERO_BACKGROUND_IMAGE_URL = process.env.NEXT_PUBLIC_HERO_BACKGROUND_URL || '';

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
export const PROJECTS_PER_PAGE = 12;
export const ADMIN_USERS_PER_PAGE = 20;
export const NEWS_PER_PAGE = 6;
export const MATERIALS_PER_PAGE = 6;
