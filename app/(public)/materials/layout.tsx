import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Материалы',
  description: 'Библиотека знаний по водосбережению. Методические пособия, презентации, видеоуроки',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
