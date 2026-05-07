import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Жоба туралы',
  description: 'Қазақстандағы суды үнемдеу бастамасының мақсаттары, міндеттері және сипаттамасы',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
