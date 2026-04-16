import { useState } from "react";

const Settings = () => {
  const [platformName, setPlatformName] = useState("DermAI Admin");
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api");
  const [confidenceThreshold, setConfidenceThreshold] = useState("0.80");
  const [emailNotification, setEmailNotification] = useState(true);
  const [lowConfidenceAlert, setLowConfidenceAlert] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Paramétrage système
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Paramètres
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Configure l’environnement d’administration, les seuils d’analyse
              et les préférences globales dans une interface élégante et
              harmonieuse.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Sécurité
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Active</p>
            </div>

            <div className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Design
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Premium</p>
            </div>

            <div className="rounded-[24px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Santé
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">Prêt</p>
            </div>
          </div>
        </div>
      </section>

      {saved && (
        <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">
          Les paramètres ont été enregistrés avec succès.
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Configuration générale
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Paramètres principaux de la plateforme d’administration
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nom de la plateforme
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                URL de l’API
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Seuil de confiance IA
              </label>
              <input
                type="text"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
                className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
              <p className="mt-2 text-sm text-slate-500">
                Valeur indicative pour marquer une prédiction comme fiable.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Préférences intelligentes
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Active ou désactive les comportements système
            </p>
          </div>

          <div className="space-y-4">
            <ToggleCard
              title="Notifications email"
              description="Recevoir les alertes importantes et mises à jour."
              checked={emailNotification}
              onChange={() => setEmailNotification(!emailNotification)}
            />

            <ToggleCard
              title="Alerte faible confiance"
              description="Mettre en évidence les analyses avec faible score."
              checked={lowConfidenceAlert}
              onChange={() => setLowConfidenceAlert(!lowConfidenceAlert)}
            />

            <ToggleCard
              title="Mode maintenance"
              description="Désactiver temporairement certaines opérations."
              checked={maintenanceMode}
              onChange={() => setMaintenanceMode(!maintenanceMode)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              Résumé de configuration
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Vue synthétique des options actuellement définies
            </p>
          </div>

          <button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
          >
            Enregistrer les paramètres
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Plateforme" value={platformName} color="emerald" />
          <SummaryCard
            label="Seuil IA"
            value={confidenceThreshold}
            color="teal"
          />
          <SummaryCard
            label="Notifications"
            value={emailNotification ? "Activées" : "Désactivées"}
            color="cyan"
          />
          <SummaryCard
            label="Maintenance"
            value={maintenanceMode ? "Oui" : "Non"}
            color="emerald"
          />
        </div>
      </section>
    </div>
  );
};

const ToggleCard = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4">
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-8 w-14 rounded-full transition ${
          checked ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "emerald" | "teal" | "cyan";
}) => {
  const styles = {
    emerald: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
    teal: "from-teal-50 to-white border-teal-100 text-teal-700",
    cyan: "from-cyan-50 to-white border-cyan-100 text-cyan-700",
  };

  return (
    <div
      className={`rounded-[24px] border bg-gradient-to-br p-5 shadow-sm ${styles[color]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-3 text-xl font-bold text-slate-800">{value}</p>
    </div>
  );
};

export default Settings;