import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Көшбасшылар',
  description: 'Дауыстар бойынша оқушылардың үздік су жобаларының рейтингі',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
