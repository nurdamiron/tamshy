import HeroSection from '@/components/home/HeroSection';
import StatsRow from '@/components/home/StatsRow';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import RegionMap from '@/components/home/RegionMap';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsRow />
      <FeaturedProjects />
      <RegionMap />
    </>
  );
}
