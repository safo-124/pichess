import { deleteLead, updateLeadStatus } from "@/lib/actions/admin";

type AcademyLead = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  program?: string | null;
  age_group?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const columns = [
  { id: "NEW", label: "New", tone: "border-blue-200 bg-blue-50 text-blue-700" },
  { id: "CONTACTED", label: "Contacted", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  { id: "ENROLLED", label: "Enrolled", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { id: "CLOSED", label: "Closed", tone: "border-zinc-200 bg-zinc-50 text-zinc-500" },
];

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function phoneLink(phone?: string | null) {
  const cleaned = (phone || "").replace(/\D/g, "");
  return cleaned ? `https://wa.me/${cleaned}` : "";
}

export default function AcademyLeadWorkflow({ leads }: { leads: AcademyLead[] }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-black text-zinc-900">Lead Pipeline</h2>
          <p className="text-xs text-zinc-400">Move each Academy enquiry through the enrollment flow.</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500">
          {leads.length} total
        </span>
      </div>

      <div className="grid gap-3 xl:grid-cols-4">
        {columns.map((column) => {
          const columnLeads = leads.filter((lead) => normalizeStatus(lead.status) === column.id);
          return (
            <div key={column.id} className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${column.tone}`}>
                  {column.label}
                </span>
                <span className="text-xs font-black text-zinc-400">{columnLeads.length}</span>
              </div>

              <div className="space-y-3">
                {columnLeads.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-5 text-center text-xs font-semibold text-zinc-300">
                    No leads
                  </div>
                ) : (
                  columnLeads.map((lead) => {
                    const whatsapp = phoneLink(lead.phone);
                    return (
                      <div key={lead.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-zinc-900">{lead.name}</p>
                            <p className="mt-1 text-[11px] font-semibold text-zinc-400">
                              {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                            </p>
                          </div>
                          <form action={deleteLead}>
                            <input type="hidden" name="id" value={lead.id} />
                            <button type="submit" className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-black text-red-500 hover:bg-red-100">
                              Delete
                            </button>
                          </form>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-zinc-500">
                          <p><span className="font-bold text-zinc-700">Program:</span> {lead.program || "Not sure yet"}</p>
                          <p><span className="font-bold text-zinc-700">Age:</span> {lead.age_group || "Not provided"}</p>
                        </div>

                        {lead.message && (
                          <p className="mt-3 line-clamp-4 rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-500">
                            {lead.message}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-zinc-800"
                          >
                            Email
                          </a>
                          {lead.phone && (
                            <a
                              href={whatsapp || `tel:${lead.phone}`}
                              target={whatsapp ? "_blank" : undefined}
                              rel={whatsapp ? "noreferrer" : undefined}
                              className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-600 hover:bg-emerald-100"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-1.5">
                          {columns
                            .filter((next) => next.id !== column.id)
                            .map((next) => (
                              <form key={next.id} action={updateLeadStatus}>
                                <input type="hidden" name="id" value={lead.id} />
                                <input type="hidden" name="status" value={next.id} />
                                <button
                                  type="submit"
                                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:border-[#c9a84c]/40 hover:text-[#b8963f]"
                                >
                                  {next.label}
                                </button>
                              </form>
                            ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
