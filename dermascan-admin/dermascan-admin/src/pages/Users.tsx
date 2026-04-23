import { useEffect, useMemo, useState } from "react";
import { deleteUser, getUsers, updateUser, User } from "../api/users";

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

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [formNom, setFormNom] = useState("");
  const [formPrenom, setFormPrenom] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAge, setFormAge] = useState("");
  const [formSexe, setFormSexe] = useState<"homme" | "femme" | "autre" | "">("");
  const [formAllergies, setFormAllergies] = useState("");
  const [formAntecedents, setFormAntecedents] = useState("");
  const [formTraitements, setFormTraitements] = useState("");
  const [formDureeLesion, setFormDureeLesion] = useState("");
  const [formSymptomes, setFormSymptomes] = useState("");
  const [formZoneCorps, setFormZoneCorps] = useState("");
  const [formObservation, setFormObservation] = useState("");
  const [formPhotoProfil, setFormPhotoProfil] = useState("");
  const [formRole, setFormRole] = useState<"user" | "admin">("user");
  const [formIsActive, setFormIsActive] = useState(true);

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

  const openEditModal = (user: User) => {
    setEditingUser(user);

    setFormNom(user.nom || "");
    setFormPrenom(user.prenom || "");
    setFormEmail(user.email || "");
    setFormPhone(user.phone || "");
    setFormAge(user.age !== null && user.age !== undefined ? String(user.age) : "");
    setFormSexe((user.sexe as "homme" | "femme" | "autre") || "");
    setFormAllergies(user.allergies || "");
    setFormAntecedents(user.antecedents || "");
    setFormTraitements(user.traitements || "");
    setFormDureeLesion(user.dureeLesion || "");
    setFormSymptomes(user.symptomes || "");
    setFormZoneCorps(user.zoneCorps || "");
    setFormObservation(user.observation || "");
    setFormPhotoProfil(user.photoProfil || "");
    setFormRole((user.role as "user" | "admin") || "user");
    setFormIsActive(user.isActive !== false);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormNom("");
    setFormPrenom("");
    setFormEmail("");
    setFormPhone("");
    setFormAge("");
    setFormSexe("");
    setFormAllergies("");
    setFormAntecedents("");
    setFormTraitements("");
    setFormDureeLesion("");
    setFormSymptomes("");
    setFormZoneCorps("");
    setFormObservation("");
    setFormPhotoProfil("");
    setFormRole("user");
    setFormIsActive(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);

      await updateUser(editingUser.id, {
        nom: formNom,
        prenom: formPrenom,
        email: formEmail,
        phone: formPhone,
        age: formAge ? Number(formAge) : null,
        sexe: formSexe || null,
        allergies: formAllergies,
        antecedents: formAntecedents,
        traitements: formTraitements,
        dureeLesion: formDureeLesion,
        symptomes: formSymptomes,
        zoneCorps: formZoneCorps,
        observation: formObservation,
        photoProfil: formPhotoProfil,
        role: formRole,
        isActive: formIsActive,
      });

      closeEditModal();
      await loadUsers();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible de modifier cet utilisateur."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number | string) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible de supprimer cet utilisateur."
      );
    }
  };

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
              Consulte les comptes enregistrés, leur statut et gère leurs
              informations depuis une interface claire et élégante.
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
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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

        {!loading && !error && (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-emerald-100/60 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Utilisateur</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Contact</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Téléphone</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Rôle</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Statut</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Créé le</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100 transition hover:bg-emerald-50/40">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-sm font-bold text-white shadow-md">
                            {(user.full_name || user.name || "U").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.full_name || user.name || "-"}
                            </p>
                            <p className="text-sm text-slate-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">{user.email}</td>
                      <td className="px-6 py-5 text-sm text-slate-700">{user.phone || "-"}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                          {user.role || "user"}
                        </span>
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
                      <td className="px-6 py-5 text-sm text-slate-700">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Modifier l’utilisateur
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Les champs sont préremplis depuis la base de données.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Nom" value={formNom} onChange={setFormNom} />
              <Input label="Prénom" value={formPrenom} onChange={setFormPrenom} />
              <Input label="Email" value={formEmail} onChange={setFormEmail} type="email" />
              <Input label="Téléphone" value={formPhone} onChange={setFormPhone} />
              <Input label="Âge" value={formAge} onChange={setFormAge} type="number" />

              <SelectField
                label="Sexe"
                value={formSexe}
                onChange={(v) => setFormSexe(v as any)}
                options={[
                  { value: "", label: "Non défini" },
                  { value: "homme", label: "homme" },
                  { value: "femme", label: "femme" },
                  { value: "autre", label: "autre" },
                ]}
              />

              <Input label="Durée lésion" value={formDureeLesion} onChange={setFormDureeLesion} />
              <Input label="Zone corps" value={formZoneCorps} onChange={setFormZoneCorps} />

              <SelectField
                label="Rôle"
                value={formRole}
                onChange={(v) => setFormRole(v as "user" | "admin")}
                options={[
                  { value: "user", label: "user" },
                  { value: "admin", label: "admin" },
                ]}
              />

              <SelectField
                label="Statut"
                value={formIsActive ? "actif" : "inactif"}
                onChange={(v) => setFormIsActive(v === "actif")}
                options={[
                  { value: "actif", label: "Actif" },
                  { value: "inactif", label: "Inactif" },
                ]}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <TextAreaField label="Allergies" value={formAllergies} onChange={setFormAllergies} />
              <TextAreaField label="Antécédents" value={formAntecedents} onChange={setFormAntecedents} />
              <TextAreaField label="Traitements" value={formTraitements} onChange={setFormTraitements} />
              <TextAreaField label="Symptômes" value={formSymptomes} onChange={setFormSymptomes} />
              <TextAreaField label="Observation" value={formObservation} onChange={setFormObservation} />
              <Input label="Photo profil (URL ou chemin)" value={formPhotoProfil} onChange={setFormPhotoProfil} />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              >
                Annuler
              </button>

              <button
                onClick={handleUpdateUser}
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 disabled:opacity-70"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    />
  </div>
);

export default Users;