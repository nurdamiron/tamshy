import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Материалдар',
  description: 'Суды үнемдеу бойынша білім кітапханасы. Әдістемелік құралдар, презентациялар, бейнесабақтар',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
