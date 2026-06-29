
import { HeroSection } from "@/components/hero/HeroSection";
import { MarqueeWrap } from "@/components/marquee-wrap";
import { NeonDivider } from "@/components/neon-divider";

import { AboutPage } from "@/components/AboutSection";
import { Show } from "@/components/ShowSection";
import { Gallery } from "@/components/GallerySection";
import { ComedianSection } from "@/components/ComedianSection";
import { CTASection } from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <NeonDivider />

        <MarqueeWrap />

        <AboutPage />
        <NeonDivider />

        <ComedianSection />
        <NeonDivider />

        <Show />
        <NeonDivider />

        <Gallery />
        <NeonDivider />

        <CTASection />
      </main>

    </div>
  );
}
