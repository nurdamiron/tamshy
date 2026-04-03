import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Конкурсы',
  description: 'Активные конкурсы водных проектов. Подайте заявку на участие',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
