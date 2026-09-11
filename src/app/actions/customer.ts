"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function registerCustomer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) {
  try {
    const email = data.email.toLowerCase().trim();
    const name = data.name.trim();

    if (!email || !email.includes("@")) {
      return { error: "Please enter a valid email address." };
    }
    if (!name) {
      return { error: "Please enter your full name." };
    }
    if (!data.password || data.password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }

    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing && existing.passwordHash) {
      return { error: "An account with this email already exists. Please sign in." };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    if (existing) {
      // Existing guest customer created from a previous checkout
      await prisma.customer.update({
        where: { email },
        data: {
          name,
          passwordHash,
          phone: data.phone || existing.phone,
          address: data.address || existing.address,
        },
      });
    } else {
      await prisma.customer.create({
        data: {
          name,
          email,
          passwordHash,
          phone: data.phone || null,
          address: data.address || null,
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function updateCustomerProfile(data: {
  name: string;
  phone?: string;
  address?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "You must be signed in to update your profile." };
    }

    const name = data.name.trim();
    if (!name) {
      return { error: "Name cannot be empty." };
    }

    await prisma.customer.update({
      where: { email: session.user.email.toLowerCase().trim() },
      data: {
        name,
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
      },
    });

    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile details." };
  }
}

export async function getCustomerDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email.toLowerCase().trim();

  const [customer, orders] = await Promise.all([
    prisma.customer.findUnique({
      where: { email },
    }),
    prisma.order.findMany({
      where: { customerEmail: email },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    customer,
    orders,
    sessionUser: session.user,
  };
}
