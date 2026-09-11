import { prisma } from '@/lib/db';
import { unstable_cache } from 'next/cache';
import type { 
  Category, 
  ProductImage, 
  BatSpecifications, 
  ProductVariant, 
  Review, 
  Product, 
  CategoryDef, 
  HomepageContent 
} from '@/lib/types';
import type { 
  CmsSection, 
  Faq, 
  SiteSettings 
} from '@prisma/client';
import { getProductImages } from '@/lib/data/productImages';

// -----------------------------------------------------------------------------
// Admin Types
// -----------------------------------------------------------------------------
export interface AdminProduct extends Product {
  variantsCount: number;
  categoryName: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  items: any[];
  customer: any | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalSpent: number;
  ordersCount: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

// -----------------------------------------------------------------------------
// Helper Mappers
// -----------------------------------------------------------------------------
function mapProduct(p: any): Product {
  const fallbackImages = getProductImages({ id: p.id, slug: p.slug, category: p.categoryId });
  const rawImages = p.images || [];
  const mappedImages: ProductImage[] =
    rawImages.length > 0 && rawImages.some((img: any) => img.url)
      ? rawImages.map((img: any) => ({
          angle: img.angle,
          seed: img.seed || "",
          url: img.url || fallbackImages[0]?.url,
          alt: p.name,
        }))
      : fallbackImages;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    series: p.series || undefined,
    category: p.categoryId as Category,
    subcategory: p.subcategory || undefined,
    price: p.price > 0 && p.price < 2000 ? p.price * 100 : p.price,
    compareAtPrice: p.compareAtPrice ? (p.compareAtPrice < 2000 ? p.compareAtPrice * 100 : p.compareAtPrice) : undefined,
    description: p.description,
    shortDescription: p.shortDescription,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badges: p.badges ? JSON.parse(p.badges) : [],
    featured: p.featured,
    bestseller: p.bestseller,
    new: p.isNew,
    colorway: {
      willowTone: p.willowTone || "",
      accent: p.accentTone || "",
    },
    specifications: p.specifications ? JSON.parse(p.specifications) : undefined,
    images: mappedImages,
    imageUrl: mappedImages[0]?.url,
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      label: v.label,
      priceDelta: v.priceDelta,
      inStock: v.inStock,
    })),
  };
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getProducts:", err);
    return [];
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: { categoryId },
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getProductsByCategory:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { images: true, variants: true }
    });
    return p ? mapProduct(p) : null;
  } catch (err) {
    console.error("Error in getProductBySlug:", err);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true }
    });
    return p ? mapProduct(p) : null;
  } catch (err) {
    console.error("Error in getProductById:", err);
    return null;
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, count = 4): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: { categoryId, id: { not: productId } },
      take: count,
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getRelatedProducts:", err);
    return [];
  }
}

export async function getFeaturedProducts(count = 4): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: { featured: true },
      take: count,
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getFeaturedProducts:", err);
    return [];
  }
}

export async function getBestsellerProducts(count = 4): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: { bestseller: true },
      take: count,
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getBestsellerProducts:", err);
    return [];
  }
}

export async function getNewProducts(count = 4): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: { isNew: true },
      take: count,
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in getNewProducts:", err);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: { images: true, variants: true }
    });
    return data.map(mapProduct);
  } catch (err) {
    console.error("Error in searchProducts:", err);
    return [];
  }
}

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------
export async function getCategories(): Promise<CategoryDef[]> {
  try {
    const data = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });
    return data.map(c => ({
      id: c.id as Category,
      name: c.name,
      tagline: c.tagline,
      heroSeed: c.heroSeed || "",
      description: c.description
    }));
  } catch (err) {
    console.error("Error in getCategories:", err);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryDef | null> {
  try {
    const c = await prisma.category.findUnique({ where: { id } });
    if (!c) return null;
    return {
      id: c.id as Category,
      name: c.name,
      tagline: c.tagline,
      heroSeed: c.heroSeed || "",
      description: c.description
    };
  } catch (err) {
    console.error("Error in getCategoryById:", err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Homepage & CMS
// -----------------------------------------------------------------------------
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const section = await prisma.cmsSection.findUnique({ where: { id: 'hero' } });
    const bestseller = await prisma.product.findFirst({
      where: { bestseller: true }
    });
    
    let meta: any = {};
    if (section?.metaData) {
      try { meta = JSON.parse(section.metaData); } catch (e) {}
    }

    return {
      hero: {
        eyebrow: section?.eyebrow || '',
        headline: section?.title || '',
        subheading: section?.subtitle || '',
        ctaPrimary: meta.ctaPrimaryText || 'Shop Now',
        ctaSecondary: meta.ctaSecondaryText || 'Explore',
      },
      bestsellerProductId: bestseller?.slug || '',
    };
  } catch (err) {
    console.error("Error in getHomepageContent:", err);
    return {
      hero: {
        eyebrow: '', headline: '', subheading: '', ctaPrimary: '', ctaSecondary: ''
      },
      bestsellerProductId: ''
    };
  }
}

export async function getCmsSection(key: string): Promise<CmsSection | null> {
  try {
    return await prisma.cmsSection.findUnique({ where: { id: key } });
  } catch (err) {
    console.error("Error in getCmsSection:", err);
    return null;
  }
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  try {
    return await prisma.faq.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: { order: 'asc' }
    });
  } catch (err) {
    console.error("Error in getFaqs:", err);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) throw new Error("Settings not found");
    return settings;
  } catch (err) {
    console.error("Error in getSiteSettings:", err);
    return {
      id: "singleton",
      businessName: "CRIX Cricket",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      instagramUrl: null,
      facebookUrl: null,
      youtubeUrl: null,
      defaultSeoTitle: "",
      defaultSeoDescription: "",
      currency: "INR",
      currencySymbol: "₹",
      updatedAt: new Date()
    };
  }
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const data = await prisma.review.findMany({
      where: { productId, published: true },
      orderBy: { createdAt: 'desc' }
    });
    return data.map(r => ({
      id: r.id,
      productId: r.productId,
      author: r.author,
      verified: r.verified,
      rating: r.rating,
      title: r.title,
      body: r.body,
      tags: JSON.parse(r.tags || "[]"),
      date: r.createdAt.toISOString()
    }));
  } catch (err) {
    console.error("Error in getProductReviews:", err);
    return [];
  }
}

// -----------------------------------------------------------------------------
// Admin Queries
// -----------------------------------------------------------------------------
export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, category: true }
    });
    return products.map(p => ({
      ...mapProduct(p),
      variantsCount: p.variants.length,
      categoryName: p.category.name
    }));
  } catch (err) {
    console.error("Error in getAdminProducts:", err);
    return [];
  }
}

export async function getAdminOrders(opts?: { status?: string; page?: number; pageSize?: number }): Promise<{ orders: AdminOrder[]; total: number }> {
  try {
    const page = opts?.page || 1;
    const pageSize = opts?.pageSize || 10;
    const where = opts?.status ? { status: opts.status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, customer: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);
    return { orders, total };
  } catch (err) {
    console.error("Error in getAdminOrders:", err);
    return { orders: [], total: 0 };
  }
}

export async function getAdminCustomers(opts?: { page?: number; pageSize?: number }): Promise<{ customers: AdminCustomer[]; total: number }> {
  try {
    const page = opts?.page || 1;
    const pageSize = opts?.pageSize || 10;
    
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count()
    ]);
    return { customers, total };
  } catch (err) {
    console.error("Error in getAdminCustomers:", err);
    return { customers: [], total: 0 };
  }
}

export async function getAdminEnquiries(opts?: { status?: string; page?: number; pageSize?: number }): Promise<{ enquiries: any[]; total: number }> {
  try {
    const page = opts?.page || 1;
    const pageSize = opts?.pageSize || 10;
    const where = opts?.status ? { status: opts.status } : {};
    
    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.enquiry.count({ where })
    ]);
    return { enquiries, total };
  } catch (err) {
    console.error("Error in getAdminEnquiries:", err);
    return { enquiries: [], total: 0 };
  }
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      orders,
      totalCustomers,
      totalProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.findMany({ select: { totalAmount: true } }),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
      })
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts: []
    };
  } catch (err) {
    console.error("Error in getAdminDashboardStats:", err);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      recentOrders: [],
      topProducts: []
    };
  }
}

export async function getAdminMedia(opts?: { page?: number; pageSize?: number }): Promise<{ media: any[]; total: number }> {
  try {
    const page = opts?.page || 1;
    const pageSize = opts?.pageSize || 20;

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.media.count()
    ]);
    return { media, total };
  } catch (err) {
    console.error("Error in getAdminMedia:", err);
    return { media: [], total: 0 };
  }
}
