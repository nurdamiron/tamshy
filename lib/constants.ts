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

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
export const PROJECTS_PER_PAGE = 12;
