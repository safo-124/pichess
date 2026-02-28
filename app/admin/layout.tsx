import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | PiChess" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-zinc-950/80 border-b border-white/8 flex items-center px-6 gap-4 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center font-bold text-black text-sm">
              A
            </div>
            <div className="text-sm text-white/60">Admin</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
