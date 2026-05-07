import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import StatsRow from '@/components/home/StatsRow';
import HowItWorks from '@/components/home/HowItWorks';
import ProjectCategories from '@/components/home/ProjectCategories';
import FeaturedProjects from '@/components/home/FeaturedProjects';

// Компоненты ниже первого экрана — грузим лениво, не блокируем Critical Path.
// Каждый получает собственный chunk; placeholder держит вертикальный ритм страницы.
const LazyPlaceholder = ({ h = 'h-64' }: { h?: string }) => (
  <div className={`${h} bg-gray-50`} />
);

const WhyWaterMatters = dynamic(
  () => import('@/components/home/WhyWaterMatters'),
  { loading: () => <LazyPlaceholder h="h-96" /> },
);

const ImpactCounter = dynamic(
  () => import('@/components/home/ImpactCounter'),
  { loading: () => <LazyPlaceholder h="h-48" /> },
);

const Testimonials = dynamic(
  () => import('@/components/home/Testimonials'),
  { loading: () => <LazyPlaceholder h="h-96" /> },
);

const Timeline = dynamic(
  () => import('@/components/home/Timeline'),
  { loading: () => <LazyPlaceholder h="h-64" /> },
);

const Partners = dynamic(
  () => import('@/components/home/Partners'),
  { loading: () => <LazyPlaceholder h="h-40" /> },
);

const FAQ = dynamic(
  () => import('@/components/home/FAQ'),
  { loading: () => <LazyPlaceholder h="h-64" /> },
);

const CTABanner = dynamic(
  () => import('@/components/home/CTABanner'),
  { loading: () => <LazyPlaceholder h="h-48" /> },
);

export default function HomePage() {
  return (
    <>
      {/* Above-fold: статические импорты — мгновенная отрисовка */}
      <HeroSection />
      <StatsRow />
      <HowItWorks />
      <ProjectCategories />
      <FeaturedProjects />

      {/* Below-fold: ленивые импорты — не блокируют FCP/LCP */}
      <WhyWaterMatters />
      <ImpactCounter />
      <Testimonials />
      <Timeline />
      <Partners />
      <FAQ />
      <CTABanner />
    </>
  );
}
