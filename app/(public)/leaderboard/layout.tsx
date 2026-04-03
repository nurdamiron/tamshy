import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Лидеры',
  description: 'Рейтинг лучших водных проектов школьников по голосам',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
