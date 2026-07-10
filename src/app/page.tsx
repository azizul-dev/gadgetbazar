import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedGadgets from "@/components/home/FeaturedGadgets";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialSection from "@/components/home/TestimonialSection";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedGadgets />
      <HowItWorks />
      <TestimonialSection />
      <FaqSection />
      <NewsletterSection />
    </main>
  );
}