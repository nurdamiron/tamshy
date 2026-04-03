import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Авторизация на платформе Tamshy.kz',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
