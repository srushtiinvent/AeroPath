import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HomeTimeline from "./components/HomeTimeline";
import AddTripForm from "./components/AddTripForm";
import BoardingPassVault from "./components/BoardingPassVault";
import AIChat from "./components/AIChat";
import ProfileMetrics from "./components/ProfileMetrics";
import LoginPage from "./components/LoginPage";
import { getAuthToken, removeToken } from "./services/api";

const navItems = ["Home", "Add Trip", "Boarding pass", "Profile", "Help"] as const;

type NavItem = (typeof navItems)[number];

function App() {
  const [active, setActive] = useState<NavItem>("Home");
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

  const renderView = () => {
    switch (active) {
      case "Home":
        return <HomeTimeline onBookNow={() => setActive("Add Trip")} />;
      case "Add Trip":
        return <AddTripForm />;
      case "Boarding pass":
        return <BoardingPassVault />;
      case "Profile":
        return <ProfileMetrics />;
      case "Help":
        return <AIChat />;
      default:
        return null;
    }
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
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Header
          active={active}
          onNavChange={setActive}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
          onLogout={handleLogout}
        />
        <main className="mt-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
