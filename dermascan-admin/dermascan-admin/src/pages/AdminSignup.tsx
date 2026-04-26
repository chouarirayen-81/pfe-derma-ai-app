import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupAdmin } from "../api/adminAuth";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await signupAdmin({ nom, prenom, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de créer le compte administrateur."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-slate-800">
          Inscription Administrateur
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="rounded-2xl border px-4 py-3"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="rounded-2xl border px-4 py-3"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 w-full rounded-2xl border px-4 py-3"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-2xl border px-4 py-3"
        />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white"
        >
          {loading ? "Création..." : "Créer le compte admin"}
        </button>

        <div className="mt-4 text-sm text-slate-600">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold text-emerald-600">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;