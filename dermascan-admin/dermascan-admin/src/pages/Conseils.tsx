import { useEffect, useMemo, useState } from "react";
import { Conseil, getConseils } from "../api/conseils";

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-FR");
};

const Conseils = () => {
  const [conseils, setConseils] = useState<Conseil[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConseils = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getConseils();
      setConseils(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Impossible de charger les conseils."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConseils();
  }, []);

  const filteredConseils = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return conseils;

    return conseils.filter((conseil) => {
      const title = (conseil.title || "").toLowerCase();
      const content = (conseil.content || "").toLowerCase();
      const category = (conseil.category || "").toLowerCase();

      return (
        title.includes(value) ||
        content.includes(value) ||
        category.includes(value)
      );
    });
  }, [conseils, search]);

  const categoriesCount = new Set(
    conseils.map((item) => item.category).filter(Boolean)
  ).size;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
              Gestion des conseils
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Conseils médicaux
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Centralise les recommandations de prévention et d’orientation dans
              une interface élégante, claire et rassurante.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {conseils.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Catégories
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {categoriesCount}
              </p>
            </div>

            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Qualité
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Premium</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Bibliothèque des conseils
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recherche par titre, contenu ou catégorie
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
                placeholder="Rechercher un conseil..."
                className="w-full rounded-2xl border border-teal-100 bg-white px-12 py-4 text-slate-800 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
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
                className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-600">
            <p>{error}</p>
            <button
              onClick={loadConseils}
              className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredConseils.length === 0 ? (
              <div className="col-span-full rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center text-slate-500">
                Aucun conseil trouvé.
              </div>
            ) : (
              filteredConseils.map((conseil) => (
                <div
                  key={conseil.id}
                  className="group rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,184,166,0.10)]"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        {conseil.category || "Général"}
                      </span>

                      <h4 className="mt-3 text-xl font-bold tracking-tight text-slate-800">
                        {conseil.title || "Conseil médical"}
                      </h4>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white shadow-md">
                      <svg
                        className="h-6 w-6"
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

                  <p className="leading-7 text-slate-600">
                    {conseil.content || "-"}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">
                      Créé le {formatDate(conseil.createdAt)}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Santé & prévention
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Conseils;