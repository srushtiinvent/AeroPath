import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import { getAuthToken, removeToken } from "./services/api";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setIsAuthenticated(Boolean(getAuthToken()));
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-midnight dark:text-slate-100">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <LoginPage onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-midnight dark:text-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90">
          <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to AeroPath
          </h1>
          <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
            You are logged in!
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
