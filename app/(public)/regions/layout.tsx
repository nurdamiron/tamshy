import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Аймақтар',
  description: 'Қазақстан аймақтары бойынша оқушылардың су жобалары',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
