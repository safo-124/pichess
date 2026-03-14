import { getSiteContent } from "@/lib/actions/admin";
import AdminSettingsManager from "@/components/admin/AdminSettingsManager";

export const metadata = { title: "Settings | Admin | PiChess" };

export default async function AdminSettingsPage() {
  let settingsData = null;
  try {
    const raw = await getSiteContent("site_logo");
    if (raw) settingsData = JSON.parse(raw);
  } catch {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage site-wide settings such as the main navigation logo.
        </p>
      </div>
      <AdminSettingsManager initialData={settingsData} />
    </div>
  );
}