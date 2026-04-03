import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с командой проекта Tamshy.kz. Адрес, телефон, форма обратной связи',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
