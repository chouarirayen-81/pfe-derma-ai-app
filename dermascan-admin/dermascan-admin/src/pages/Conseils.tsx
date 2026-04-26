import { useEffect, useMemo, useState } from "react";
import {
  Conseil,
  createConseil,
  deleteConseil,
  getConseils,
  updateConseil,
} from "../api/conseils";
import {
  Pathologie,
  createPathologie,
  getPathologies,
} from "../api/pathologies";

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-FR");
};

const Conseils = () => {
  const [conseils, setConseils] = useState<Conseil[]>([]);
  const [pathologies, setPathologies] = useState<Pathologie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingConseil, setEditingConseil] = useState<Conseil | null>(null);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPathologieId, setFormPathologieId] = useState("");
  const [formType, setFormType] = useState<
    "prevention" | "traitement" | "urgence" | "information"
  >("information");
  const [formOrdre, setFormOrdre] = useState("");
  const [formValeur, setFormValeur] = useState("");
  const [formEmoji, setFormEmoji] = useState("");

  const [newPathologieCode, setNewPathologieCode] = useState("");
  const [newPathologieNom, setNewPathologieNom] = useState("");
  const [newPathologieDescription, setNewPathologieDescription] = useState("");
  const [newPathologieGravite, setNewPathologieGravite] = useState<
    "faible" | "moderee" | "elevee"
  >("faible");

  const [newConseilTitle, setNewConseilTitle] = useState("");
  const [newConseilContent, setNewConseilContent] = useState("");
  const [newConseilPathologieId, setNewConseilPathologieId] = useState("");
  const [newConseilType, setNewConseilType] = useState<
    "prevention" | "traitement" | "urgence" | "information"
  >("information");
  const [newConseilOrdre, setNewConseilOrdre] = useState("1");
  const [newConseilValeur, setNewConseilValeur] = useState("");
  const [newConseilEmoji, setNewConseilEmoji] = useState("");

  const loadConseils = async () => {
    const data = await getConseils();
    setConseils(data);
  };

  const loadPathologies = async () => {
    const data = await getPathologies();
    setPathologies(data);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([loadConseils(), loadPathologies()]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Impossible de charger les données."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const openEditModal = (conseil: Conseil) => {
    setEditingConseil(conseil);
    setFormTitle(conseil.title || "");
    setFormContent(conseil.content || "");
    setFormPathologieId(
      conseil.pathologieId !== null && conseil.pathologieId !== undefined
        ? String(conseil.pathologieId)
        : ""
    );
    setFormType(conseil.type || "information");
    setFormOrdre(
      conseil.ordre !== null && conseil.ordre !== undefined
        ? String(conseil.ordre)
        : ""
    );
    setFormValeur(conseil.valeur || "");
    setFormEmoji(conseil.emoji || "");
  };

  const closeEditModal = () => {
    setEditingConseil(null);
    setFormTitle("");
    setFormContent("");
    setFormPathologieId("");
    setFormType("information");
    setFormOrdre("");
    setFormValeur("");
    setFormEmoji("");
  };

  const handleUpdateConseil = async () => {
    if (!editingConseil) return;

    try {
      setSaving(true);

      await updateConseil(editingConseil.id, {
        title: formTitle,
        content: formContent,
        pathologieId: formPathologieId ? Number(formPathologieId) : null,
        type: formType,
        ordre: formOrdre ? Number(formOrdre) : null,
        valeur: formValeur,
        emoji: formEmoji,
      });

      closeEditModal();
      await loadData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible de modifier ce conseil."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConseil = async (id: number | string) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce conseil ?"
    );

    if (!confirmed) return;

    try {
      await deleteConseil(id);
      await loadData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible de supprimer ce conseil."
      );
    }
  };

  const handleAddPathologie = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPathologie({
        code: newPathologieCode,
        nom: newPathologieNom,
        description: newPathologieDescription,
        gravite: newPathologieGravite,
      });

      setNewPathologieCode("");
      setNewPathologieNom("");
      setNewPathologieDescription("");
      setNewPathologieGravite("faible");

      await loadData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible d’ajouter cette pathologie."
      );
    }
  };

  const handleAddConseil = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createConseil({
        title: newConseilTitle,
        content: newConseilContent,
        pathologieId: Number(newConseilPathologieId),
        type: newConseilType,
        ordre: Number(newConseilOrdre || 1),
        valeur: newConseilValeur,
        emoji: newConseilEmoji,
      });

      setNewConseilTitle("");
      setNewConseilContent("");
      setNewConseilPathologieId("");
      setNewConseilType("information");
      setNewConseilOrdre("1");
      setNewConseilValeur("");
      setNewConseilEmoji("");

      await loadData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Impossible d’ajouter ce conseil."
      );
    }
  };

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
              Centralise les recommandations de prévention et d’orientation.
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
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">
          Ajouter une pathologie
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Crée une nouvelle pathologie avant d’y associer des conseils.
        </p>

        <form
          onSubmit={handleAddPathologie}
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label="Code"
            value={newPathologieCode}
            onChange={setNewPathologieCode}
          />
          <Input
            label="Nom"
            value={newPathologieNom}
            onChange={setNewPathologieNom}
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Description"
              value={newPathologieDescription}
              onChange={setNewPathologieDescription}
            />
          </div>

          <SelectField
            label="Gravité"
            value={newPathologieGravite}
            onChange={(v) =>
              setNewPathologieGravite(v as "faible" | "moderee" | "elevee")
            }
            options={[
              { value: "faible", label: "faible" },
              { value: "moderee", label: "moderee" },
              { value: "elevee", label: "elevee" },
            ]}
          />

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
            >
              Ajouter la pathologie
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">
          Ajouter un conseil
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Crée un conseil et relie-le directement à une pathologie existante.
        </p>

        <form
          onSubmit={handleAddConseil}
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label="Titre"
            value={newConseilTitle}
            onChange={setNewConseilTitle}
          />

          <SelectField
            label="Pathologie"
            value={newConseilPathologieId}
            onChange={setNewConseilPathologieId}
            options={[
              { value: "", label: "Choisir une pathologie" },
              ...pathologies.map((pathologie) => ({
                value: String(pathologie.id),
                label: pathologie.nom,
              })),
            ]}
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Contenu"
              value={newConseilContent}
              onChange={setNewConseilContent}
            />
          </div>

          <SelectField
            label="Type"
            value={newConseilType}
            onChange={(v) =>
              setNewConseilType(
                v as "prevention" | "traitement" | "urgence" | "information"
              )
            }
            options={[
              { value: "information", label: "information" },
              { value: "prevention", label: "prevention" },
              { value: "traitement", label: "traitement" },
              { value: "urgence", label: "urgence" },
            ]}
          />

          <Input
            label="Ordre"
            value={newConseilOrdre}
            onChange={setNewConseilOrdre}
            type="number"
          />

          <Input
            label="Valeur"
            value={newConseilValeur}
            onChange={setNewConseilValeur}
          />

          <Input
            label="Emoji"
            value={newConseilEmoji}
            onChange={setNewConseilEmoji}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200"
            >
              Ajouter le conseil
            </button>
          </div>
        </form>
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
            <input
              type="text"
              placeholder="Rechercher un conseil..."
              className="w-full rounded-2xl border border-teal-100 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <p className="mt-6 text-slate-500">Chargement...</p>}
        {!loading && error && <p className="mt-6 text-red-600">{error}</p>}

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
                  className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
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
                  </div>

                  <p className="leading-7 text-slate-600">
                    {conseil.content || "-"}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">
                      Créé le {formatDate(conseil.createdAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(conseil)}
                        className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDeleteConseil(conseil.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {editingConseil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Modifier le conseil
                </h3>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Titre" value={formTitle} onChange={setFormTitle} />

              <SelectField
                label="Pathologie"
                value={formPathologieId}
                onChange={setFormPathologieId}
                options={[
                  { value: "", label: "Choisir une pathologie" },
                  ...pathologies.map((pathologie) => ({
                    value: String(pathologie.id),
                    label: pathologie.nom,
                  })),
                ]}
              />

              <Input
                label="Ordre"
                value={formOrdre}
                onChange={setFormOrdre}
                type="number"
              />
              <Input label="Valeur" value={formValeur} onChange={setFormValeur} />
              <Input label="Emoji" value={formEmoji} onChange={setFormEmoji} />

              <SelectField
                label="Type"
                value={formType}
                onChange={(v) =>
                  setFormType(
                    v as "prevention" | "traitement" | "urgence" | "information"
                  )
                }
                options={[
                  { value: "information", label: "information" },
                  { value: "prevention", label: "prevention" },
                  { value: "traitement", label: "traitement" },
                  { value: "urgence", label: "urgence" },
                ]}
              />
            </div>

            <div className="mt-4">
              <TextAreaField
                label="Contenu"
                value={formContent}
                onChange={setFormContent}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              >
                Annuler
              </button>

              <button
                onClick={handleUpdateConseil}
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
      rows={5}
      className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    />
  </div>
);

export default Conseils;