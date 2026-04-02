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

// Background alternation:
// Hero       -> green gradient
// StatsRow   -> overlaps hero wave (white card, transparent bg)
// HowItWorks -> white
// Categories -> #F8FAF9 (via ProjectCategories)
// Featured   -> #F8FAF9 (merged with Categories visually? No — Categories is white in current. Let me check)
// Actually: HowItWorks=white, Categories needs to be gray, Featured=gray... let me fix Categories bg too.

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
