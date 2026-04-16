import { useAuth } from "../hooks/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 md:px-8">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              DermAI Administration
            </p>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Dashboard Admin
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm md:flex md:items-center md:gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-sm font-bold text-white shadow-md">
              {(user?.name || user?.full_name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || user?.full_name || "Admin"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-300/30"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;