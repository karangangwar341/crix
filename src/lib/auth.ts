import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const requiredEnvSecret = process.env.NEXTAUTH_SECRET;
if (!requiredEnvSecret && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET environment variable is required in production");
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "UserType", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const userType = credentials.userType || "auto";

        // 1. Admin login check
        if (userType === "admin" || userType === "auto") {
          try {
            const admin = await prisma.adminUser.findUnique({
              where: { email },
            });

            if (admin) {
              const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
              if (valid) {
                return { id: admin.id, name: admin.name, email: admin.email, role: "admin" } as any;
              }
            }
          } catch {
            // DB fallback
          }

          // Env-variable master admin check
          const envAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          const envAdminPassword = process.env.ADMIN_PASSWORD;
          const envAdminName = process.env.ADMIN_NAME || "Admin";

          if (
            envAdminEmail &&
            envAdminPassword &&
            email === envAdminEmail &&
            credentials.password === envAdminPassword
          ) {
            return { id: "admin-master", name: envAdminName, email: envAdminEmail, role: "admin" } as any;
          }
        }

        // 2. Customer login check
        if (userType === "customer" || userType === "auto") {
          try {
            const customer = await prisma.customer.findUnique({
              where: { email },
            });

            if (customer && customer.passwordHash) {
              const valid = await bcrypt.compare(credentials.password, customer.passwordHash);
              if (valid) {
                return {
                  id: customer.id,
                  name: customer.name,
                  email: customer.email,
                  role: "customer",
                } as any;
              }
            }
          } catch {
            // DB fallback
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: requiredEnvSecret || "dev-only-secret-not-for-production",
};

