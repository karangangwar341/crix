import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, path, productId, sessionId, device, referrer } = body;

    if (!eventType || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        path,
        productId: productId || null,
        sessionId: sessionId || "anonymous",
        device: device || null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record event" }, { status: 500 });
  }
}
