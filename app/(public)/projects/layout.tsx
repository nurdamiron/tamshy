import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Проекты',
  description: 'Водные проекты школьников Казахстана. Голосуйте за лучшие',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
