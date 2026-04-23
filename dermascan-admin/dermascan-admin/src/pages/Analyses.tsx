import { useEffect, useMemo, useState } from "react";
import { Analyse, deleteAnalyse, getAnalyses } from "../api/analyses";

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

  const handleDeleteAnalyse = async (id: number | string) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette analyse ?"
    );

    if (!confirmed) return;

    try {
      await deleteAnalyse(id);
      await loadAnalyses();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible de supprimer cette analyse."
      );
    }
  };

  const filteredAnalyses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return analyses;

    return analyses.filter((analyse) => {
      const predictedClass = (analyse.predictedClass || "").toLowerCase();
      const userName = (analyse.userName || "").toLowerCase();
      const userEmail = (analyse.userEmail || "").toLowerCase();
      const id = String(analyse.id || "").toLowerCase();

      return (
        predictedClass.includes(value) ||
        userName.includes(value) ||
        userEmail.includes(value) ||
        id.includes(value)
      );
    });
  }, [analyses, search]);

  return (
    <div className="space-y-7">
      <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Historique des analyses
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Toutes les analyses avec utilisateur, email, classe prédite et date
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Rechercher une analyse..."
              className="w-full rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <p className="mt-6 text-slate-500">Chargement...</p>}
        {!loading && error && <p className="mt-6 text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-cyan-100/60 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gradient-to-r from-cyan-50 to-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Analyse</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Utilisateur</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Classe prédite</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Confiance</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAnalyses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                        Aucune analyse trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredAnalyses.map((analyse) => (
                      <tr
                        key={analyse.id}
                        className="border-t border-slate-100 transition hover:bg-cyan-50/30"
                      >
                        <td className="px-6 py-5 font-semibold text-slate-800">
                          Analyse #{analyse.id}
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-slate-800">
                              {analyse.userName || `User #${analyse.userId}`}
                            </p>
                            <p className="text-sm text-slate-500">
                              {analyse.userEmail || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-700">
                          {analyse.predictedClass || "-"}
                        </td>

                        <td className="px-6 py-5 text-slate-700">
                          {formatConfidence(analyse.confidence)}
                        </td>

                        <td className="px-6 py-5 text-slate-700">
                          {formatDate(analyse.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <button
                            onClick={() => handleDeleteAnalyse(analyse.id)}
                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Effacer
                          </button>
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