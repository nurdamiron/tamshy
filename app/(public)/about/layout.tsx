import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О проекте',
  description: 'Цели, задачи и описание инициативы по водосбережению в Казахстане',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
