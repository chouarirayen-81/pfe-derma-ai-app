import { useEffect, useMemo, useState } from "react";
import { Analyse, getAnalyses } from "../api/analyses";

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-FR");
};

const formatConfidence = (value?: number) => {
  if (value === undefined || value === null) return "-";
  return `${Math.round(value * 100)}%`;
};

const confidenceBadge = (value?: number) => {
  if (value === undefined || value === null) {
    return "bg-slate-100 text-slate-600";
  }

  if (value >= 0.9) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (value >= 0.75) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-red-50 text-red-600";
};

const Analyses = () => {
  const [analyses, setAnalyses] = useState<Analyse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Impossible de charger les analyses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  const filteredAnalyses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return analyses;

    return analyses.filter((analyse) => {
      const predictedClass = (analyse.predictedClass || "").toLowerCase();
      const userId = String(analyse.userId || "").toLowerCase();
      const id = String(analyse.id || "").toLowerCase();

      return (
        predictedClass.includes(value) ||
        userId.includes(value) ||
        id.includes(value)
      );
    });
  }, [analyses, search]);

  const highConfidence = analyses.filter(
    (item) => (item.confidence || 0) >= 0.9
  ).length;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Analyse dermatologique
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Analyses IA
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Visualise les résultats de classification, les niveaux de
              confiance et l’activité analytique de l’application DermAI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {analyses.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Haute confiance
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {highConfidence}
              </p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Vision
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">AI</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Historique des analyses
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recherche par classe prédite, identifiant analyse ou utilisateur
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="6.5" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Rechercher une analyse..."
                className="w-full rounded-2xl border border-cyan-100 bg-white px-12 py-4 text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-600">
            <p>{error}</p>
            <button
              onClick={loadAnalyses}
              className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-cyan-100/60 bg-white">
            <div className="flex items-center justify-between border-b border-cyan-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {filteredAnalyses.length}
                </span>{" "}
                analyse(s) trouvée(s)
              </p>

              <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                AI Results
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gradient-to-r from-cyan-50 to-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Analyse
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Classe prédite
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Confiance
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAnalyses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        Aucune analyse trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredAnalyses.map((analyse) => (
                      <tr
                        key={analyse.id}
                        className="border-t border-slate-100 transition hover:bg-cyan-50/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-md">
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

                            <div>
                              <p className="font-semibold text-slate-800">
                                Analyse #{analyse.id}
                              </p>
                              <p className="text-sm text-slate-500">
                                {analyse.imageUrl || "Image dermatologique"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          User #{analyse.userId}
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                            {analyse.predictedClass || "-"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${confidenceBadge(
                              analyse.confidence
                            )}`}
                          >
                            {formatConfidence(analyse.confidence)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {formatDate(analyse.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Analyses;