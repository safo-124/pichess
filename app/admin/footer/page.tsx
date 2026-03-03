import AdminFooterManager from "@/components/admin/AdminFooterManager";
import { getSiteContent } from "@/lib/actions/admin";

export default async function AdminFooterPage() {
  let footerData = null;
  try {
    const raw = await getSiteContent("footer_config");
    if (raw) footerData = JSON.parse(raw);
  } catch { /* use defaults */ }

  return (
    <div>
      <AdminFooterManager initialData={footerData} />
    </div>
  );
}
