import { useEffect, useState } from "react";
import { getStats, Stats as StatsType } from "../api/stats";

const Stats = () => {
  const [stats, setStats] = useState<StatsType>({
    totalUsers: 0,
    totalAnalyses: 0,
    totalConseils: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStats();
      setStats(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les statistiques."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const total = stats.totalUsers + stats.totalAnalyses + stats.totalConseils;

  const usersPercent = total ? Math.round((stats.totalUsers / total) * 100) : 0;
  const analysesPercent = total
    ? Math.round((stats.totalAnalyses / total) * 100)
    : 0;
  const conseilsPercent = total
    ? Math.round((stats.totalConseils / total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-7">
        <section className="rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="h-10 w-72 animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-4 h-5 w-[520px] animate-pulse rounded-xl bg-slate-100" />
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-[28px] border border-white/60 bg-white/70"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-[30px] border border-white/60 bg-white/70"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Statistiques
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Vue analytique de l’activité DermAI.
          </p>
        </section>

        <div className="rounded-[28px] border border-red-100 bg-white p-6 shadow-lg">
          <div className="mb-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Erreur de chargement
          </div>

          <p className="text-slate-600">{error}</p>

          <button
            onClick={loadStats}
            className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Business Intelligence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Statistiques avancées
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Analyse globale des utilisateurs, des analyses IA et des conseils
              médicaux dans une interface premium inspirée de l’univers santé.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Performance
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">98%</p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Visibilité
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Clair</p>
            </div>

            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Système
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Stable</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total utilisateurs
              </p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-800">
                {stats.totalUsers}
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-200/60">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z" />
                <path d="M4 20a8 8 0 0 1 16 0" />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2.5 rounded-full bg-emerald-50">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
              style={{ width: `${usersPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {usersPercent}% du volume total mesuré
          </p>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total analyses
              </p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-800">
                {stats.totalAnalyses}
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white shadow-lg shadow-teal-200/60">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M7 12h10" />
                <path d="M12 7v10" />
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9s9 4.03 9 9Z" />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2.5 rounded-full bg-teal-50">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
              style={{ width: `${analysesPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {analysesPercent}% du volume total mesuré
          </p>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total conseils
              </p>
              <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-800">
                {stats.totalConseils}
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-400 text-white shadow-lg shadow-cyan-200/60">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2l4-4" />
                <path d="M12 22c4.97 0 9-4.03 9-9s-4.03-9-9-9s-9 4.03-9 9s4.03 9 9 9Z" />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2.5 rounded-full bg-cyan-50">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400"
              style={{ width: `${conseilsPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {conseilsPercent}% du volume total mesuré
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                Répartition analytique
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Lecture visuelle des données principales
              </p>
            </div>

            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Santé & IA
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Utilisateurs
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {stats.totalUsers}
                </span>
              </div>
              <div className="h-4 rounded-full bg-emerald-50">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                  style={{ width: `${usersPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Analyses
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {stats.totalAnalyses}
                </span>
              </div>
              <div className="h-4 rounded-full bg-teal-50">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                  style={{ width: `${analysesPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Conseils
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {stats.totalConseils}
                </span>
              </div>
              <div className="h-4 rounded-full bg-cyan-50">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400"
                  style={{ width: `${conseilsPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">
            Lecture rapide
          </h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-50 px-4 py-4">
              <p className="text-sm font-semibold text-emerald-700">
                Base utilisateurs
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Le système contient actuellement {stats.totalUsers} compte(s)
                utilisateurs enregistrés.
              </p>
            </div>

            <div className="rounded-2xl bg-teal-50 px-4 py-4">
              <p className="text-sm font-semibold text-teal-700">
                Activité IA
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {stats.totalAnalyses} analyse(s) ont été générées par
                l’application.
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-50 px-4 py-4">
              <p className="text-sm font-semibold text-cyan-700">
                Couverture conseil
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {stats.totalConseils} conseil(s) sont disponibles pour
                accompagner l’orientation utilisateur.
              </p>
            </div>
          </div>

          <button
            onClick={loadStats}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
          >
            Actualiser les statistiques
          </button>
        </div>
      </section>
    </div>
  );
};

export default Stats;