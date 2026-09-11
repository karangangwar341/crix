import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Administrative privileges required");
  }
  return session;
}

export async function requireCustomerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in to access this resource");
  }
  return session;
}
