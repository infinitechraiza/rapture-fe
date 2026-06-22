import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/hero/home-hero-section";
import { MarqueeWrap } from "@/components/marquee-wrap";
import { NeonDivider } from "@/components/neon-divider";

import { About } from "@/components/about";
import { Show } from "@/components/show";
import { Gallery } from "@/components/gallery";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
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

      <Footer />
    </div>
  );
}
