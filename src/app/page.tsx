import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BestsellerViewer from "@/components/home/BestsellerViewer";
import BatCollection from "@/components/home/BatCollection";
import FindYourBatTeaser from "@/components/home/FindYourBatTeaser";
import Craftsmanship from "@/components/home/Craftsmanship";
import Players from "@/components/home/Players";
import ReviewsSection from "@/components/home/ReviewsSection";
import Journal from "@/components/home/Journal";
import Newsletter from "@/components/home/Newsletter";
import { getHomepageContent } from "@/lib/dal";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <>
      <Hero content={content.hero} />
      <CategoryShowcase />
      <BestsellerViewer />
      <BatCollection />
      <FindYourBatTeaser />
      <Craftsmanship />
      <Players />
      <ReviewsSection />
      <Journal />
      <Newsletter />
    </>
  );
}

