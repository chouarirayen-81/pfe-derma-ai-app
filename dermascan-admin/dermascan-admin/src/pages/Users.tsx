import { useEffect, useMemo, useState } from "react";
import { getUsers, User } from "../api/users";

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-FR");
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter((user) => {
      const fullName = (user.full_name || user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();

      return (
        fullName.includes(value) ||
        email.includes(value) ||
        phone.includes(value)
      );
    });
  }, [users, search]);

  const activeCount = users.filter((user) => user.isActive !== false).length;
  const inactiveCount = users.filter((user) => user.isActive === false).length;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Gestion des utilisateurs
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Utilisateurs
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Consulte les comptes enregistrés, leur statut et les informations
              essentielles dans une interface claire, moderne et harmonieuse.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {users.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Actifs
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {activeCount}
              </p>
            </div>

            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Inactifs
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Liste des utilisateurs
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recherche rapide par nom, email ou téléphone
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
                placeholder="Rechercher un utilisateur..."
                className="w-full rounded-2xl border border-emerald-100 bg-white px-12 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-600">
            <p>{error}</p>
            <button
              onClick={loadUsers}
              className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-emerald-100/60 bg-white">
            <div className="flex items-center justify-between border-b border-emerald-50 px-6 py-4">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {filteredUsers.length}
                </span>{" "}
                utilisateur(s) trouvé(s)
              </p>

              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Vue premium
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Créé le
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-slate-100 transition hover:bg-emerald-50/40"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-sm font-bold text-white shadow-md">
                              {(user.full_name || user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {user.full_name || user.name || "-"}
                              </p>
                              <p className="text-sm text-slate-500">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {user.email}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {user.phone || "-"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive === false
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {user.isActive === false ? "Inactif" : "Actif"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {formatDate(user.createdAt)}
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

export default Users;