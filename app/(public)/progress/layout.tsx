import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Іске асыру барысы',
  description: 'Жобаның жаңалықтары, есептері және медиаматериалдары',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
