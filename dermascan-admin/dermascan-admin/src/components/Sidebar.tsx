import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M3 13.2C3 10.17 3 8.66 3.85 7.49C4.7 6.32 6.1 5.8 8.9 4.74L10.4 4.18C11.23 3.87 11.65 3.71 12.08 3.71C12.51 3.71 12.93 3.87 13.76 4.18L15.26 4.74C18.06 5.8 19.46 6.32 20.31 7.49C21.16 8.66 21.16 10.17 21.16 13.2V14.05C21.16 17.45 21.16 19.15 20.11 20.2C19.06 21.25 17.36 21.25 13.96 21.25H10.2C6.8 21.25 5.1 21.25 4.05 20.2C3 19.15 3 17.45 3 14.05V13.2Z" />
        <path d="M9 17h6" />
        <path d="M9 13h6" />
      </svg>
    ),
  },
  {
    to: "/users",
    label: "Utilisateurs",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    to: "/conseils",
    label: "Conseils",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M9 12l2 2l4-4" />
        <path d="M12 22c4.97 0 9-4.03 9-9s-4.03-9-9-9s-9 4.03-9 9s4.03 9 9 9Z" />
      </svg>
    ),
  },
  {
    to: "/analyses",
    label: "Analyses",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M7 12h10" />
        <path d="M12 7v10" />
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9s9 4.03 9 9Z" />
      </svg>
    ),
  },
  {
    to: "/stats",
    label: "Statistiques",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Paramètres",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6a1.7 1.7 0 0 1-3.06 0a1.7 1.7 0 0 0-1-.6a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1a1.7 1.7 0 0 1 0-3.06a1.7 1.7 0 0 0 .6-1a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6a1.7 1.7 0 0 1 3.06 0a1.7 1.7 0 0 0 1 .6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .38.22.74.6 1a1.7 1.7 0 0 1 0 3.06c-.38.26-.6.62-.6 1Z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden min-h-screen w-[290px] shrink-0 border-r border-emerald-900/10 bg-gradient-to-b from-[#06223a] via-[#08304b] to-[#0b5c5f] text-white shadow-2xl lg:block">
      <div className="relative flex h-full flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />

        <div className="relative border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-lg font-bold text-white shadow-lg">
                D
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">DermAI</h1>
              <p className="mt-1 text-sm text-emerald-100/80">
                Smart Health Admin
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-4 py-5">
          <div className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/55">
            Navigation
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/20"
                      : "text-white/82 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      active
                        ? "bg-white/18"
                        : "bg-white/8 group-hover:bg-white/12"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative mt-auto p-4">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-300" />
              <div>
                <p className="text-sm font-semibold">Healthcare AI</p>
                <p className="text-xs text-white/70">Secure • Elegant • Clean</p>
              </div>
            </div>

            <p className="text-xs leading-5 text-white/70">
              Une interface rassurante, moderne et harmonieuse pour la gestion
              intelligente des analyses dermatologiques.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;