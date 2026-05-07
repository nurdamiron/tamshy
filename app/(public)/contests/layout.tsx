import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Конкурстар',
  description: 'Суды үнемдеу бойынша белсенді конкурстар. Өтінім беріңіз',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
