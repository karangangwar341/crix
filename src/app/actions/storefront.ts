"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Submit contact form from storefront
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  try {
    await prisma.enquiry.create({
      data: {
        company: "Customer Support",
        contact: data.name,
        email: data.email,
        category: data.topic,
        quantity: "1",
        message: data.message,
        status: "New",
      },
    });

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { error: "Failed to submit contact form. Please try again later." };
  }
}

/**
 * Submit business enquiry from storefront
 */
export async function submitBusinessEnquiry(data: {
  company: string;
  contact: string;
  email: string;
  phone?: string;
  country?: string;
  category: string;
  quantity?: string;
  requirements?: string;
  message?: string;
}) {
  try {
    let combinedMessage = data.message || "";
    if (data.requirements) {
      combinedMessage = `Requirements: ${data.requirements}\n\n${combinedMessage}`;
    }
    if (data.country) {
      combinedMessage = `Country: ${data.country}\n\n${combinedMessage}`;
    }

    await prisma.enquiry.create({
      data: {
        company: data.company,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        category: data.category,
        quantity: data.quantity || "TBD",
        message: combinedMessage.trim() || undefined,
        status: "New",
      },
    });

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    console.error("Error submitting business enquiry:", error);
    return { error: "Failed to submit business enquiry. Please try again later." };
  }
}

export interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod?: string;
  items: {
    productId?: string;
    variantId?: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
}

/**
 * Create order, upsert customer, decrement product stock, and log purchase event in Prisma
 */
export async function placeOrder(input: PlaceOrderInput) {
  try {
    if (!input.customerEmail || !input.customerName || !input.items?.length) {
      return { error: "Missing required order information." };
    }

    const orderNumber = `CRIX-${Math.floor(10000 + Math.random() * 90000)}`;

    // Upsert or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: input.customerEmail.toLowerCase().trim() },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: input.customerName,
          email: input.customerEmail.toLowerCase().trim(),
          phone: input.customerPhone || null,
          address: input.shippingAddress,
          ordersCount: 1,
          totalSpent: input.totalAmount,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          ordersCount: { increment: 1 },
          totalSpent: { increment: input.totalAmount },
          address: input.shippingAddress || customer.address,
        },
      });
    }

    // Create Order with Items
    const order = await prisma.order.create({
      data: {
        id: orderNumber,
        customerId: customer.id,
        customerName: input.customerName,
        customerEmail: input.customerEmail.toLowerCase().trim(),
        customerPhone: input.customerPhone || null,
        shippingAddress: input.shippingAddress,
        totalAmount: input.totalAmount,
        status: "Processing",
        paymentStatus: "Paid",
        paymentMethod: input.paymentMethod || "Card",
        items: {
          create: input.items.map((item) => ({
            productId: item.productId || undefined,
            variantId: item.variantId || undefined,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
    });

    // Decrement product inventory safely
    for (const item of input.items) {
      if (item.productId) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        } catch {
          // If productId was not found in DB, non-fatal
        }
      }
    }

    // Log purchase event
    try {
      await prisma.analyticsEvent.create({
        data: {
          eventType: "purchase",
          path: "/checkout",
          sessionId: `sess-${Date.now()}`,
          device: "desktop",
        },
      });
    } catch {
      // Non-fatal
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/customers");

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Error creating order in Prisma:", error);
    return { error: error.message || "Failed to process order. Please try again." };
  }
}

export async function submitProductReview(input: {
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  tags?: string[];
}) {
  try {
    if (!input.productId || !input.author?.trim() || !input.title?.trim() || !input.body?.trim()) {
      return { error: "Please fill in all required review fields." };
    }

    const rating = Math.max(1, Math.min(5, Math.round(input.rating || 5)));

    await prisma.review.create({
      data: {
        productId: input.productId,
        author: input.author.trim(),
        verified: true,
        rating,
        title: input.title.trim(),
        body: input.body.trim(),
        tags: JSON.stringify(input.tags || ["Performance"]),
        published: true,
      },
    });

    // Update product rating and review count if product exists in DB
    try {
      const reviews = await prisma.review.findMany({
        where: { productId: input.productId, published: true },
        select: { rating: true },
      });

      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await prisma.product.update({
          where: { id: input.productId },
          data: {
            reviewCount: reviews.length,
            rating: Math.round(avg * 10) / 10,
          },
        });
      }
    } catch {
      // Non-fatal if product was queried statically
    }

    revalidatePath("/bats");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { error: "Failed to submit review. Please try again." };
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "Please enter a valid email address." };
    }

    await prisma.enquiry.create({
      data: {
        company: "VIP Newsletter",
        contact: cleanEmail.split("@")[0],
        email: cleanEmail,
        category: "Newsletter",
        quantity: "1",
        message: "Customer subscribed to CRIX VIP dispatch updates and product releases.",
        status: "New",
      },
    });

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return { error: "Failed to subscribe. Please try again." };
  }
}

export async function trackGuestOrder(orderId: string, email: string) {
  try {
    const cleanId = orderId?.trim().toUpperCase();
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanId || !cleanEmail) {
      return { error: "Please provide both Order Reference and Email address." };
    }

    const order = await prisma.order.findFirst({
      where: {
        id: cleanId,
        customerEmail: { equals: cleanEmail, mode: "insensitive" },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return { error: "No order found matching this reference and email combination." };
    }

    return {
      order: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((i) => ({
          id: i.id,
          title: i.title,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
      },
    };
  } catch (error: any) {
    console.error("Error tracking order:", error);
    return { error: "Failed to look up order. Please try again." };
  }
}



