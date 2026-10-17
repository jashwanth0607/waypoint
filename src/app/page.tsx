import { HeroSection } from '@/components/home/HeroSection';
import { DestinationDiscovery } from '@/components/home/DestinationDiscovery';
import { StorytellingSection } from '@/components/home/StorytellingSection';
import { ExperiencesSection } from '@/components/home/ExperiencesSection';
import { TripPreviewSection } from '@/components/home/TripPreviewSection';
import { FinalCta } from '@/components/home/FinalCta';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <DestinationDiscovery />
      <StorytellingSection />
      <ExperiencesSection />
      <TripPreviewSection />
      <FinalCta />
    </div>
  );
}
