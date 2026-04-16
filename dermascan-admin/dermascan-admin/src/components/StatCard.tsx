interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "emerald" | "teal" | "cyan";
}

const accentStyles = {
  emerald: {
    badge: "from-emerald-500 to-green-400",
    light: "bg-emerald-50 text-emerald-700",
    line: "from-emerald-400 to-emerald-200",
    glow: "shadow-emerald-200/60",
  },
  teal: {
    badge: "from-teal-500 to-cyan-400",
    light: "bg-teal-50 text-teal-700",
    line: "from-teal-400 to-cyan-200",
    glow: "shadow-teal-200/60",
  },
  cyan: {
    badge: "from-cyan-500 to-sky-400",
    light: "bg-cyan-50 text-cyan-700",
    line: "from-cyan-400 to-sky-200",
    glow: "shadow-cyan-200/60",
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  accent = "emerald",
}: StatCardProps) => {
  const style = accentStyles[accent];

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(16,185,129,0.10)]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-100/30 blur-2xl" />
      <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r opacity-90 ${style.line}" />
      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${style.line}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-800">
            {value}
          </h3>

          <div className="mt-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.light}`}
            >
              {subtitle || "Vue globale"}
            </span>
          </div>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${style.badge} ${style.glow}`}
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 8v8" />
            <path d="M8 12h8" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9s9 4.03 9 9Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatCard;