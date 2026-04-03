import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ход реализации',
  description: 'Новости, отчёты и медиаматериалы проекта по водосбережению',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
