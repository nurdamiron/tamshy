import HeroSection from '@/components/home/HeroSection';
import StatsRow from '@/components/home/StatsRow';
import HowItWorks from '@/components/home/HowItWorks';
import ProjectCategories from '@/components/home/ProjectCategories';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import WhyWaterMatters from '@/components/home/WhyWaterMatters';
import ImpactCounter from '@/components/home/ImpactCounter';

import Testimonials from '@/components/home/Testimonials';
import Timeline from '@/components/home/Timeline';
import Partners from '@/components/home/Partners';
import FAQ from '@/components/home/FAQ';
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
      <ImpactCounter />

      <Testimonials />
      <Timeline />
      <Partners />
      <FAQ />
      <CTABanner />
    </>
  );
}
