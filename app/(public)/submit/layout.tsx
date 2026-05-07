import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Жоба жіберу',
  description: 'Су жобаңызды Tamshy конкурсына жіберіңіз',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
