export const PROJECT_TYPES = [
  { value: 'VIDEO', label: 'Видео', icon: 'video', color: 'blue' },
  { value: 'RESEARCH', label: 'Исследование', icon: 'research', color: 'purple' },
  { value: 'ART', label: 'Арт / Плакат', icon: 'art', color: 'amber' },
  { value: 'INVENTION', label: 'Изобретение', icon: 'invention', color: 'orange' },
  { value: 'APP', label: 'Приложение / Сайт', icon: 'app', color: 'teal' },
  { value: 'OTHER', label: 'Другое', icon: 'other', color: 'gray' },
] as const;

export const REGIONS = [
  'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
  'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
  'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
  'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
] as const;

export const GRADES = Array.from({ length: 11 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} класс`,
}));

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
export const PROJECTS_PER_PAGE = 12;
