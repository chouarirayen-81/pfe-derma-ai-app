import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getStats, Stats } from "../api/stats";

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Chargement des indicateurs DermAI...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-[28px] border border-white/60 bg-white/70 shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Vue générale de l’administration DermAI
          </p>
        </div>

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
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Healthcare AI Dashboard
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
              Un espace admin élégant, clair et rassurant
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Suivez les utilisateurs, les analyses dermatologiques et les
              conseils médicaux à travers une interface moderne inspirée du
              domaine de la santé, pensée pour la confiance, la lisibilité et
              l’efficacité.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:min-w-[320px]">
            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Système
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">Stable</p>
              <p className="mt-1 text-sm text-slate-500">
                API et dashboard connectés
              </p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Thème
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">Santé</p>
              <p className="mt-1 text-sm text-slate-500">
                Palette premium harmonieuse
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          subtitle="Comptes enregistrés"
          accent="emerald"
        />
        <StatCard
          title="Total Analyses"
          value={stats.totalAnalyses}
          subtitle="Analyses IA disponibles"
          accent="teal"
        />
        <StatCard
          title="Total Conseils"
          value={stats.totalConseils}
          subtitle="Conseils médicaux"
          accent="cyan"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                Résumé intelligent
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Vue synthétique des données clés de l’application
              </p>
            </div>

            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Temps réel
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
              <p className="text-sm font-medium text-slate-500">Engagement</p>
              <p className="mt-3 text-3xl font-bold text-slate-800">+24%</p>
              <p className="mt-2 text-sm text-slate-500">
                activité utilisateurs simulée
              </p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5">
              <p className="text-sm font-medium text-slate-500">Fiabilité</p>
              <p className="mt-3 text-3xl font-bold text-slate-800">95%</p>
              <p className="mt-2 text-sm text-slate-500">
                qualité visuelle du pilotage
              </p>
            </div>

            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5">
              <p className="text-sm font-medium text-slate-500">Clarté</p>
              <p className="mt-3 text-3xl font-bold text-slate-800">100%</p>
              <p className="mt-2 text-sm text-slate-500">
                interface pensée pour la santé
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">
            Vision produit
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            DermAI combine analyse dermatologique assistée par IA, expérience
            mobile intuitive et administration centralisée dans un environnement
            visuel rassurant, propre et professionnel.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">
                Expérience premium orientée santé
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-teal-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-teal-500" />
              <span className="text-sm font-medium text-slate-700">
                Couleurs harmonieuses et apaisantes
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-cyan-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-cyan-500" />
              <span className="text-sm font-medium text-slate-700">
                Base solide pour Users, Conseils et Analyses
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;