"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      lastPath.current === pathname
    ) {
      return;
    }
    lastPath.current = pathname;

    let sessionId = sessionStorage.getItem("crix_sid");
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      sessionStorage.setItem("crix_sid", sessionId);
    }

    const device = window.innerWidth < 768 ? "mobile" : "desktop";

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        path: pathname,
        sessionId,
        device,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {
      // Non-fatal telemetry
    });
  }, [pathname]);

  return null;
}
