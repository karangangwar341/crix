import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import CompareBar from "@/components/compare/CompareBar";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { StorefrontLayoutShell } from "@/components/layout/StorefrontLayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRIX — Precision Cricket Equipment",
  description:
    "Luxury cricket equipment manufacturer. Grade 1 English willow bats, batting protection, and professional kit, engineered with uncompromising precision.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <AuthProvider>
          <StorefrontLayoutShell>{children}</StorefrontLayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
