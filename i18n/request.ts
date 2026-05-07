import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['kk', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'kk';

export default getRequestConfig(async () => {
  // 1. Check cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value as Locale | undefined;

  // 2. Check Accept-Language header
  const headerStore = await headers();
  const acceptLang = headerStore.get('accept-language') || '';

  let locale: Locale = defaultLocale; // 'kk' — казахский по умолчанию

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (acceptLang.includes('kk')) {
    locale = 'kk';
  }
  // Не переключаемся на ru/en по заголовку Accept-Language —
  // пользователь явно выбирает язык через LanguageSwitcher (cookie).

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
