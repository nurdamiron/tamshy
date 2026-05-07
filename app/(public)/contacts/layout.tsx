import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Байланыс',
  description: 'Tamshy жоба командасымен байланысыңыз. Мекенжай, телефон, кері байланыс нысаны',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
