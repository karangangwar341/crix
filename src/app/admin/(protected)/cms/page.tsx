import { getHomepageContent, getCategories, getFaqs } from "@/lib/dal";
import CmsClient from "./CmsClient";

export default async function AdminCMSPage() {
  const [content, categories, faqs] = await Promise.all([
    getHomepageContent(),
    getCategories(),
    getFaqs(),
  ]);

  return (
    <CmsClient
      initialHero={content.hero}
      categories={categories}
      faqs={faqs}
    />
  );
}
