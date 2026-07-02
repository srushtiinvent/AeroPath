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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white px-4 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/50 bg-white/95 p-8 backdrop-blur-xl shadow-xl dark:border-slate-800/50 dark:bg-slate-950/95">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 px-4 py-2">
            <span className="font-bold text-white">✈ AeroPath</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isSignup
              ? "Join thousands of travelers managing their journeys"
              : "Log in to your travel timeline"}
          </p>
        </div>

        {/* Signup Fields */}
        {isSignup && (
          <div className="mb-6 grid gap-4">
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Full Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
              />
            </label>
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Tagline
              <input
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                placeholder="e.g., Travel Enthusiast"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
              />
            </label>
          </div>
        )}

        {/* Email & Password */}
        <div className="mb-6 grid gap-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Email Address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            />
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2.5 font-semibold text-white transition hover:from-sky-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Processing..." : isSignup ? "Create Account" : "Log In"}
        </button>

        {/* Toggle */}
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {isSignup ? "Already have an account? " : "New to AeroPath? "}
          </span>
          <button
            type="button"
            onClick={() => setIsSignup((current) => !current)}
            className="font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-500 dark:text-slate-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
