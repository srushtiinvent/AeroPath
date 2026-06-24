import { useState } from "react";
import { login, saveToken, signup } from "../services/api";

const LoginPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = isSignup
        ? await signup({ email, password, name, tagline })
        : await login(email, password);

      saveToken(response.token);
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft dark:border-slate-700/60 dark:bg-slate-950/95">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-500">AeroPath Auth</p>
        <h1 className="mt-4 text-3xl font-semibold">{isSignup ? "Create your AeroPath account" : "Welcome back to AeroPath"}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {isSignup ? "Sign up to save your itinerary and boarding passes." : "Log in to continue managing your travel timeline."}
        </p>
      </div>

      {isSignup ? (
        <div className="grid gap-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Tagline
            <input
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
              placeholder="e.g. MNIT Jaipur"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
          />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/10 dark:text-rose-200">{error}</p> : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-6 w-full rounded-3xl bg-sky-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Processing..." : isSignup ? "Sign up" : "Log in"}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{isSignup ? "Already have an account?" : "New to AeroPath?"}</span>
        <button
          type="button"
          onClick={() => setIsSignup((current) => !current)}
          className="font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
