import { getSiteContent } from "@/lib/actions/admin";
import AdminFooterManager from "@/components/admin/AdminFooterManager";

export default async function AdminFooterPage() {
  let footerData = null;
  try {
    const raw = await getSiteContent("site_footer");
    if (raw) footerData = JSON.parse(raw);
  } catch {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Footer</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the site-wide footer — description, contact info, social links, and CTA.
        </p>
      </div>
      <AdminFooterManager initialData={footerData} />
    </div>
  );
}
