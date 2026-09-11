import { getAdminMedia } from "@/lib/dal";
import MediaClient, { MediaItem } from "./MediaClient";

const fallbackMedia: MediaItem[] = [
  {
    id: "media-1",
    url: "https://images.unsplash.com/photo-1531415074868-036b1c57e32b?q=80&w=1000&auto=format&fit=crop",
    fileName: "pro-elite-x-hero.jpg",
    fileSize: 420100,
    mimeType: "image/jpeg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "media-2",
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop",
    fileName: "cricket-craft-pressing.jpg",
    fileSize: 680400,
    mimeType: "image/jpeg",
    createdAt: new Date().toISOString(),
  },
];

export default async function MediaAdminPage() {
  const { media } = await getAdminMedia();

  const items: MediaItem[] =
    media.length > 0
      ? media.map((m: any) => ({
          id: m.id,
          url: m.url,
          fileName: m.fileName,
          fileSize: m.fileSize,
          mimeType: m.mimeType,
          createdAt: new Date(m.createdAt).toISOString(),
        }))
      : fallbackMedia;

  return <MediaClient initialItems={items} />;
}
