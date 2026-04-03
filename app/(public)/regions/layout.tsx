import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Регионы',
  description: 'Водные проекты школьников по регионам Казахстана',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
