"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-guard";

// --- CMS & Settings Actions ---

export async function updateHeroSection(formData: {
  headline: string;
  subheading: string;
  eyebrow: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
}) {
  try {
    await requireAdminSession();
    await prisma.cmsSection.upsert({
      where: { id: "hero" },
      update: {
        title: formData.headline,
        subtitle: formData.subheading,
        eyebrow: formData.eyebrow,
        metaData: JSON.stringify({
          ctaPrimaryText: formData.ctaPrimaryText || "Explore Bats",
          ctaSecondaryText: formData.ctaSecondaryText || "Discover the Craft",
        }),
      },
      create: {
        id: "hero",
        title: formData.headline,
        subtitle: formData.subheading,
        eyebrow: formData.eyebrow,
        metaData: JSON.stringify({
          ctaPrimaryText: formData.ctaPrimaryText || "Explore Bats",
          ctaSecondaryText: formData.ctaSecondaryText || "Discover the Craft",
        }),
      },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update hero section" };
  }
}

export async function updateSiteSettings(settings: {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
}) {
  try {
    await requireAdminSession();
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: settings,
      create: {
        id: "singleton",
        ...settings,
      },
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save site settings" };
  }
}

// --- CRM & Enquiries Actions ---

export async function updateEnquiryStatus(id: string, status: string, notes?: string) {
  try {
    await requireAdminSession();
    await prisma.enquiry.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update enquiry status" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await requireAdminSession();
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update order status" };
  }
}

// --- Product & Catalog Actions ---

export async function updateProductStock(id: string, newStock: number) {
  try {
    await requireAdminSession();
    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update product stock" };
  }
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  categoryId: string;
  series?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  stock: number;
  willowGrade?: string;
  edge?: number;
  spine?: number;
  sweetSpot?: string;
  pickup?: string;
  imageUrl?: string;
}

export async function createProduct(input: CreateProductInput) {
  try {
    await requireAdminSession();

    const slug = (input.slug?.trim() || input.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const batSpecs = input.categoryId === "bats" ? JSON.stringify({
      willow: input.willowGrade ? `Grade ${input.willowGrade} English Willow` : "Grade 1 English Willow",
      willowGrade: input.willowGrade ? (Number(input.willowGrade) || 1) : 1,
      weight: "2.10 - 2.12 lb",
      weightMinOz: 44,
      weightMaxOz: 46,
      bladeLength: 216,
      bladeWidth: 108,
      edge: Number(input.edge) || 40,
      spine: Number(input.spine) || 64,
      sweetSpot: input.sweetSpot || "Mid",
      pickup: input.pickup || "Balanced",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Semi-Oval",
      toe: "Traditional",
      grains: "8-10",
      playingStyle: ["Power", "All-round"],
      experience: ["Club", "Professional"],
    }) : null;

    const product = await prisma.product.create({
      data: {
        slug,
        name: input.name,
        series: input.series || "Pro Line",
        categoryId: input.categoryId,
        price: Number(input.price),
        compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : null,
        shortDescription: input.shortDescription,
        description: input.description,
        stock: Number(input.stock) || 0,
        specifications: batSpecs,
        images: input.imageUrl ? {
          create: [
            { angle: "front", url: input.imageUrl, seed: slug, order: 0 }
          ]
        } : undefined,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/bats");
    revalidatePath("/");
    return { success: true, product };
  } catch (err: any) {
    console.error("Error creating product:", err);
    return { error: err.message || "Failed to create product" };
  }
}

export interface UpdateProductInput {
  id: string;
  name: string;
  series?: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  stock: number;
  willowGrade?: string;
  edge?: number;
  spine?: number;
  sweetSpot?: string;
  pickup?: string;
  imageUrl?: string;
}

export async function updateProduct(input: UpdateProductInput) {
  try {
    await requireAdminSession();

    const batSpecs = input.categoryId === "bats" ? JSON.stringify({
      willow: input.willowGrade ? `Grade ${input.willowGrade} English Willow` : "Grade 1 English Willow",
      willowGrade: input.willowGrade ? (Number(input.willowGrade) || 1) : 1,
      weight: "2.10 - 2.12 lb",
      weightMinOz: 44,
      weightMaxOz: 46,
      bladeLength: 216,
      bladeWidth: 108,
      edge: Number(input.edge) || 40,
      spine: Number(input.spine) || 64,
      sweetSpot: input.sweetSpot || "Mid",
      pickup: input.pickup || "Balanced",
      balance: "Mid",
      profile: "Full Profile",
      handle: "Semi-Oval",
      toe: "Traditional",
      grains: "8-10",
      playingStyle: ["Power", "All-round"],
      experience: ["Club", "Professional"],
    }) : null;

    const updateData: any = {
      name: input.name,
      series: input.series || "Pro Line",
      categoryId: input.categoryId,
      price: Number(input.price),
      compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : null,
      shortDescription: input.shortDescription,
      description: input.description,
      stock: Number(input.stock) || 0,
    };

    if (batSpecs) {
      updateData.specifications = batSpecs;
    }

    const updated = await prisma.product.update({
      where: { id: input.id },
      data: updateData,
    });

    if (input.imageUrl) {
      // Upsert or create primary front image
      const existingFront = await prisma.productMedia.findFirst({
        where: { productId: input.id, angle: "front" }
      });
      if (existingFront) {
        await prisma.productMedia.update({
          where: { id: existingFront.id },
          data: { url: input.imageUrl }
        });
      } else {
        await prisma.productMedia.create({
          data: {
            productId: input.id,
            angle: "front",
            url: input.imageUrl,
            seed: updated.slug,
            order: 0,
          }
        });
      }
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${input.id}`);
    revalidatePath(`/${input.categoryId}`);
    revalidatePath(`/${input.categoryId}/${updated.slug}`);
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (err: any) {
    console.error("Error updating product:", err);
    return { error: err.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdminSession();
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return { error: err.message || "Failed to delete product" };
  }
}

