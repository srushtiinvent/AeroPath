import { useState } from "react";

const Header = ({ isAuthenticated, onLogout }: { isAuthenticated?: boolean; onLogout?: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 px-3 py-2">
              <span className="font-bold text-white">✈ AeroPath</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              About
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
              >
                Logout
              </button>
            ) : (
              <>
                <button className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:block">
                  Login
                </button>
                <button className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600">
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-2 border-t border-slate-200/50 pt-4 dark:border-slate-800/50 md:hidden">
            <a href="#features" className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900">
              Features
            </a>
            <a href="#about" className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900">
              About
            </a>
            <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900">
              Pricing
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
