import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Жобалар',
  description: 'Қазақстан оқушыларының су жобалары. Үздіктеріне дауыс беріңіз',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
