import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import { getAuthToken, removeToken } from "./services/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(getAuthToken()));
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    setShowLogin(false);
  };

  if (showLogin || !isAuthenticated) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/50">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Welcome to AeroPath
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            You're logged in and ready to manage your travel timeline!
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950/50">
              <h2 className="font-semibold text-slate-900 dark:text-white">✈ My Flights</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Coming soon</p>
            </div>
            <div className="rounded-lg border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950/50">
              <h2 className="font-semibold text-slate-900 dark:text-white">🎫 Boarding Passes</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Coming soon</p>
            </div>
            <div className="rounded-lg border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-950/50">
              <h2 className="font-semibold text-slate-900 dark:text-white">📍 Travel Stats</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
