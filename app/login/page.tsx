import Link from "next/link";

export const metadata = { title: "Login | PiChess" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      {/* Background chessboard pattern */}
      <div className="absolute inset-0 chess-bg opacity-5 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">♟️</span>
            <span className="text-3xl font-black text-white tracking-tight">PiChess</span>
          </div>
          <p className="text-zinc-400 text-sm">Sign in to access the admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-black text-white mb-6">Welcome back</h1>

          <form className="space-y-4" action="/api/auth/login" method="POST">
            <div>
              <label htmlFor="email" className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@pichess.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
                <input type="checkbox" name="remember" className="rounded border-zinc-700 bg-zinc-800" />
                Remember me
              </label>
              <Link href="#" className="text-zinc-400 text-sm hover:text-white transition-colors">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-600 text-xs">
              Admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">
            ← Back to PiChess
          </Link>
        </div>
      </div>
    </div>
  );
}
