import type { Dispatch, SetStateAction } from "react";

const navItems = ["Home", "Add Trip", "Boarding pass", "Profile", "Help"] as const;

type HeaderProps = {
  active: (typeof navItems)[number];
  onNavChange: Dispatch<SetStateAction<(typeof navItems)[number]>>;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
};

const Header = ({ active, onNavChange, darkMode, onToggleTheme, onLogout }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-soft dark:bg-slate-100 dark:text-slate-900">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20L21 12L3 4L10 12L3 20Z" fill="currentColor" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <span className="text-slate-900 dark:text-white">Aero</span>
            <span className="text-slate-500 dark:text-sky-300">Path</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Travel timeline, boarding flow & journey dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
        <nav className="flex gap-3 whitespace-nowrap">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavChange(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active === item
                  ? "bg-slate-900 text-white shadow-soft dark:bg-sky-400 dark:text-slate-950"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="ml-auto rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {darkMode ? "Light Mode" : "Midnight Mode"}
        </button>
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-600"
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
