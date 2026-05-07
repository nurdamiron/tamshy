'use client';

import useSWR from 'swr';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'STUDENT' | 'TEACHER' | 'JURY' | 'ADMIN';
  consentEmail: boolean;
  createdAt: string;
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Not authenticated');
    return r.json();
  });

/**
 * Хук для получения текущего пользователя.
 *
 * Использует SWR с кешем 60 секунд — не делает запрос к БД при каждом
 * переходе между страницами (в отличие от fetch внутри useEffect).
 *
 * Пример:
 *   const { user, isLoggedIn, isLoading, mutate } = useAuth();
 *   mutate() // принудительное обновление после логина/логаута
 */
export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<{ user: AuthUser }>(
    '/api/me',
    fetcher,
    {
      revalidateOnFocus: false,
      // Дедупликация: один и тот же запрос в течение 60 с не повторяется
      dedupingInterval: 60_000,
      // Не ретраим при 401 — это штатная ситуация для неавторизованных
      shouldRetryOnError: false,
    }
  );

  return {
    user: data?.user ?? null,
    isLoggedIn: !!data?.user && !error,
    isLoading,
    /** Вызвать после логина или логаута для немедленного обновления */
    mutate,
  };
}
