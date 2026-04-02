import HeroSection from '@/components/home/HeroSection';
import StatsRow from '@/components/home/StatsRow';
import HowItWorks from '@/components/home/HowItWorks';
import ProjectCategories from '@/components/home/ProjectCategories';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import WhyWaterMatters from '@/components/home/WhyWaterMatters';
import RegionMap from '@/components/home/RegionMap';
import Testimonials from '@/components/home/Testimonials';
import Partners from '@/components/home/Partners';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsRow />
      <HowItWorks />
      <ProjectCategories />
      <FeaturedProjects />
      <WhyWaterMatters />
      <RegionMap />
      <Testimonials />
      <Partners />
      <CTABanner />
    </>
  );
}
