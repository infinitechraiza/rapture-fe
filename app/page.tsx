
import { HeroSection } from "@/components/hero/home-hero-section";
import { MarqueeWrap } from "@/components/marquee-wrap";
import { NeonDivider } from "@/components/neon-divider";

import { About } from "@/components/about";
import { Show } from "@/components/show";
import { Gallery } from "@/components/gallery";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <NeonDivider />

        <MarqueeWrap />

        <About />
        <NeonDivider />

        <Show />
        <NeonDivider />

        <Gallery />
        <NeonDivider />
      </main>

    </div>
  );
}
