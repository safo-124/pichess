import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | PiChess" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-zinc-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 flex items-center px-6 gap-4 shrink-0 sticky top-0 z-40">
          <div className="flex-1">
            <h2 className="text-[13px] font-semibold text-zinc-400">PiChess Admin</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-1">
              <div className="text-[13px] font-semibold text-zinc-700">Admin User</div>
              <div className="text-[11px] text-zinc-400">admin@pichess.com</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a8893d] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
