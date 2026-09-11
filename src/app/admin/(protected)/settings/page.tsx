import { getSiteSettings } from "@/lib/dal";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm initialSettings={settings} />;
}
