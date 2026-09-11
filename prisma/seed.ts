import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../src/lib/data/categories";
import { allProducts } from "../src/lib/data/products";
import { homepage } from "../src/lib/data/homepage";
import { generateReviews } from "../src/lib/data/reviews";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Starting CRIX Sport Accessories Initial Seeding ===");

  // 1. Ensure CRM (Orders, Customers, Enquiries) and Analytics tables are strictly clean/unpolluted
  console.log("Ensuring CRM (orders, customers, enquiries) and Analytics remain clean...");
  await prisma.analyticsEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.adminActivity.deleteMany();
  console.log("✓ CRM and Analytics tables ready.");

  // 2. Clear previous CMS & Catalog data for idempotent re-seeding
  console.log("Cleaning CMS, catalog, and media tables for fresh seed...");
  await prisma.mediaUsage.deleteMany();
  await prisma.media.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.cmsSection.deleteMany();

  // 3. Admin user
  const adminName = process.env.ADMIN_NAME ?? "CRIX Admin";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@crixcricket.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "crix_admin_secure_2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash },
    create: { name: adminName, email: adminEmail, passwordHash },
  });
  console.log(`✓ Admin user created: ${admin.email}`);

  // 4. Site Settings (singleton)
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      businessName: "CRIX Cricket & Sports",
      phone: "+44 20 7946 0912",
      whatsapp: "442079460912",
      email: "support@crixcricket.com",
      address: "The Pavilion, St. John's Wood, London NW8 8QN",
      instagramUrl: "https://instagram.com/crixcricket",
      facebookUrl: "https://facebook.com/crixcricket",
      youtubeUrl: "https://youtube.com/@crixcricket",
      defaultSeoTitle: "CRIX | Handcrafted English Willow Cricket Bats & Protective Gear",
      defaultSeoDescription:
        "Engineered with uncompromising precision. Shop flagship cricket bats, batting gloves, pads, helmets, and accessories.",
      currency: "INR",
      currencySymbol: "₹",
    },
  });
  console.log("✓ Site Settings singleton initialized.");

  // 5. CMS Homepage Sections
  await prisma.cmsSection.upsert({
    where: { id: "hero" },
    update: {},
    create: {
      id: "hero",
      title: homepage.hero.headline,
      subtitle: homepage.hero.subheading,
      eyebrow: homepage.hero.eyebrow,
      metaData: JSON.stringify({
        ctaPrimaryText: homepage.hero.ctaPrimary,
        ctaPrimaryLink: "/bats",
        ctaSecondaryText: homepage.hero.ctaSecondary,
        ctaSecondaryLink: "/craft",
      }),
      published: true,
    },
  });

  await prisma.cmsSection.upsert({
    where: { id: "bestseller" },
    update: {},
    create: {
      id: "bestseller",
      title: "Signature Willow Spotlight",
      subtitle: "The bat of choice for professional top-order batters.",
      eyebrow: "Flagship Edition",
      metaData: JSON.stringify({
        productId: homepage.bestsellerProductId || "bat-pro-elite-x",
        badge: "Bestseller",
      }),
      published: true,
    },
  });

  await prisma.cmsSection.upsert({
    where: { id: "craft" },
    update: {},
    create: {
      id: "craft",
      title: "From English Cleft to Match Day Masterpiece",
      subtitle: "Every CRIX bat undergoes 14 distinct stages of hand-crafting, pressing, and balancing.",
      eyebrow: "The Craftsmanship",
      metaData: JSON.stringify({
        stages: [
          { name: "Cleft Selection", desc: "Hand-graded English Willow clefts for optimal grain structure and density." },
          { name: "Precision Pressing", desc: "Calibrated hydraulic pressing ensuring maximum rebound without brittle fibers." },
          { name: "Hand Shaping", desc: "Crafted with traditional drawknives to achieve unmatched pickup balance." },
        ],
      }),
      published: true,
    },
  });
  console.log("✓ CMS Sections seeded (Hero, Bestseller, Craft).");

  // 6. FAQs
  const initialFaqs = [
    {
      category: "Bats",
      question: "What is the difference between Grade 1 and Grade 2 English Willow?",
      answer: "Grade 1 English Willow features 8-12 straight, even grains with minimal to zero blemishes, offering premier rebound performance and supreme ping. Grade 2 has 6-8 grains with slight natural cosmetic markings but identical durability.",
      order: 1,
    },
    {
      category: "Bats",
      question: "Do CRIX bats arrive knocked in and match ready?",
      answer: "All CRIX bats receive initial press preparation. However, we recommend a minimum of 2-3 hours of dedicated mallet knocking-in on the edges and toe, followed by throwdowns with an old ball before match play.",
      order: 2,
    },
    {
      category: "Delivery",
      question: "What are your worldwide delivery timeframes?",
      answer: "UK orders dispatch within 24 hours on a Next-Day tracked service. International express shipments to Australia, India, and South Africa typically arrive within 3-5 business days.",
      order: 3,
    },
    {
      category: "Custom Orders",
      question: "Can I commission a custom weight and handle shape?",
      answer: "Yes. Our Master Batmaker accepts bespoke commissions for custom handle specs (round/oval), blade weight variations, and personalized balance points via our wholesale / business enquiry desk.",
      order: 4,
    },
  ];

  for (const faq of initialFaqs) {
    await prisma.faq.create({
      data: faq,
    });
  }
  console.log(`✓ ${initialFaqs.length} FAQs seeded.`);

  // 7. Categories
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        tagline: cat.tagline,
        description: cat.description,
        heroSeed: cat.heroSeed,
        order: i,
      },
    });
  }
  console.log(`✓ ${categories.length} Categories seeded.`);

  // 8. Products, Bat Specifications, Variants, Images & Reviews
  let productCount = 0;
  let variantCount = 0;
  let reviewCount = 0;

  for (const p of allProducts) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        series: p.series || null,
        categoryId: p.category,
        subcategory: p.subcategory || null,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        description: p.description,
        shortDescription: p.shortDescription,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        badges: JSON.stringify(p.badges || []),
        featured: Boolean(p.featured),
        bestseller: Boolean(p.bestseller),
        isNew: Boolean(p.new),
        willowTone: p.colorway?.willowTone || "#ead9ad",
        accentTone: p.colorway?.accent || "#8a1f2b",
        specifications: p.specifications ? JSON.stringify(p.specifications) : null,
      },
    });
    productCount++;

    // Variants
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        await prisma.productVariant.create({
          data: {
            id: `${product.id}-${v.id}`,
            productId: product.id,
            label: v.label,
            priceDelta: v.priceDelta || 0,
            stock: 12,
            inStock: v.inStock,
          },
        });
        variantCount++;
      }
    }

    // Media angles
    if (p.images && p.images.length > 0) {
      for (let idx = 0; idx < p.images.length; idx++) {
        const img = p.images[idx];
        await prisma.productMedia.create({
          data: {
            productId: product.id,
            angle: img.angle,
            seed: img.seed,
            order: idx,
          },
        });
      }
    }

    // Sample reviews (top 3 for initial preview)
    const productReviews = generateReviews(p.id, 3, p.rating);
    for (const r of productReviews) {
      await prisma.review.create({
        data: {
          id: r.id,
          productId: product.id,
          author: r.author,
          verified: r.verified,
          rating: r.rating,
          title: r.title,
          body: r.body,
          tags: JSON.stringify(r.tags),
          isSample: true,
          published: true,
        },
      });
      reviewCount++;
    }
  }

  console.log(`✓ ${productCount} Products, ${variantCount} Variants, and ${reviewCount} initial reviews seeded.`);
  console.log("=== Seeding completed successfully! ===");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
