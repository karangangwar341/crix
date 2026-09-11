import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, UploadValidationError } from "@/lib/storage";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const title = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const saved = await saveUploadedFile(file);

    // Save record to DB if database is connected
    let mediaRecord = null;
    try {
      mediaRecord = await prisma.media.create({
        data: {
          url: saved.url,
          fileName: saved.fileName,
          mimeType: saved.mimeType,
          fileSize: saved.fileSize,
          width: saved.width,
          height: saved.height,
          altText: altText || saved.fileName,
          title: title || saved.fileName,
        },
      });
    } catch {
      // Graceful fallback if database is not reachable yet
    }

    return NextResponse.json({
      success: true,
      file: {
        id: mediaRecord?.id || `local-${Date.now()}`,
        url: saved.url,
        fileName: saved.fileName,
        fileSize: saved.fileSize,
        mimeType: saved.mimeType,
      },
    });
  } catch (error: any) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
