import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Подать проект',
  description: 'Отправьте свой водный проект на конкурс Tamshy.kz',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
