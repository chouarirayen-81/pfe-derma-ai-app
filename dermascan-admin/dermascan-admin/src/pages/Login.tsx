import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/adminAuth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin({ email, password });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_28%),linear-gradient(180deg,#f7fffd_0%,#eef7f6_100%)]" />

      <div className="absolute left-[-80px] top-[-80px] h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-80px] h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white/78 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="grid min-h-[650px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-gradient-to-br from-[#08304b] via-[#0a4d5d] to-[#10b981] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/12 text-2xl font-bold backdrop-blur-md">
                D
              </div>

              <h1 className="max-w-md text-5xl font-extrabold leading-tight tracking-tight">
                DermAI Admin
              </h1>

              <p className="mt-5 max-w-md text-base leading-8 text-white/82">
                Une interface de gestion élégante, sereine et moderne, inspirée
                de l’univers médical et pensée pour piloter l’intelligence
                artificielle appliquée à la dermatologie.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold">Palette santé premium</p>
                <p className="mt-1 text-sm text-white/72">
                  Vert, teal, blanc, douceur visuelle et confiance.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold">Expérience rassurante</p>
                <p className="mt-1 text-sm text-white/72">
                  Interface claire, calme et professionnelle.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Secure Login
                </div>

                <h2 className="text-4xl font-extrabold tracking-tight text-slate-800">
                  Connexion Admin
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Connecte-toi pour accéder au tableau de bord DermAI.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-slate-600">
                Pas encore de compte admin ?{" "}
                <Link
                  to="/admin-signup"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;