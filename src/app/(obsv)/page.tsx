import {
  Navbar,
  Hero,
  WhatWeDo,
  FeaturedPublications,
  ServicesSection,
  ContactCta,
  WhoWeAre,
  Investigators,
  FaqSection,
  ContactSection,
  Footer,
} from "@/components";
import PartnersMarquee from "@/components/home/partners/PartnersMarquee";
import FadeIn from "@/components/ui/animation/FadeIn";

export default function HomePage() {
  return (
    <>
      <main className="max-w-[1200px] mx-auto">
        <Hero /> {/* El hero puede entrar sin fade */}
        <FadeIn>
          <FeaturedPublications />
        </FadeIn>
        <FadeIn delay={0.05}>
          <WhatWeDo />
        </FadeIn>
        <FadeIn delay={0.05}>
          <ServicesSection />
        </FadeIn>
        <FadeIn delay={0.05}>
          <ContactCta />
        </FadeIn>
        <FadeIn delay={0.05}>
          <WhoWeAre />
        </FadeIn>
        <FadeIn delay={0.05}>
          <Investigators />
        </FadeIn>
        <FadeIn delay={0.05}>
          <PartnersMarquee />
        </FadeIn>
        <FadeIn delay={0.05}>
          <FaqSection />
        </FadeIn>
        <FadeIn delay={0.05}>
          <ContactSection />
        </FadeIn>
      </main>
    </>
  );
}
