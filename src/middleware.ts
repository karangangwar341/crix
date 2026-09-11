import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    const isAccessingAdmin = pathname.startsWith("/admin");
    const isAccessingAccount = pathname.startsWith("/account");

    if (isAccessingAdmin && token?.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAccessingAccount && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Route authorization checks handled explicitly in middleware handler
    },
  },
);

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/account/:path*"],
};

