const HomePage = ({ onGetStarted }: { onGetStarted?: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Your <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Travel Timeline</span>, Simplified
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
            Manage flights, boarding passes, and travel documents all in one place. Track your journeys, analyze baggage rules, and stay organized offline.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={onGetStarted}
              className="rounded-lg bg-sky-500 px-8 py-4 font-semibold text-white transition hover:bg-sky-600"
            >
              Get Started Free
            </button>
            <button className="rounded-lg border border-slate-300 px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image/Placeholder */}
        <div className="mt-20 rounded-xl border border-slate-200/50 bg-gradient-to-br from-sky-50 to-blue-50 p-8 dark:border-slate-800/50 dark:from-slate-900 dark:to-slate-800">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-sky-200 to-blue-300 opacity-50 dark:from-sky-900/30 dark:to-blue-900/30" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-slate-200/50 bg-white/50 py-20 dark:border-slate-800/50 dark:bg-slate-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Powerful Features</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Everything you need to manage your travel timeline
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">✈</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Flight Tracking</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Keep all your flights organized in one connected timeline. Track departures, arrivals, and flight details automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">🧳</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Baggage Rules</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Never worry about baggage limits again. Analyze multi-leg journey rules automatically and get alerts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Offline Access</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Access your boarding passes and travel documents even without internet. Perfect for airports and planes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Boarding Passes</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Store digital boarding passes with QR codes. Share with travel companions instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Trip Analytics</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Track visited countries, travel statistics, and build your travel passport.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-200/50 bg-white p-8 transition hover:border-sky-300/50 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-950/50">
              <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 dark:bg-sky-900/30">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Privacy First</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your data is encrypted and stored securely. We never share your travel information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200/50 bg-gradient-to-r from-sky-500 to-blue-600 py-20 dark:border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Simplify Your Travel?</h2>
          <p className="mt-4 text-lg text-sky-100">
            Join thousands of travelers who trust AeroPath to manage their journeys.
          </p>
          <button
            onClick={onGetStarted}
            className="mt-8 rounded-lg bg-white px-8 py-4 font-semibold text-sky-600 transition hover:bg-sky-50"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 py-12 dark:border-slate-800/50 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 px-3 py-2">
                  <span className="font-bold text-white">✈ AeroPath</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Your travel timeline, simplified.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Features</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-200/50 pt-8 text-center text-sm text-slate-600 dark:border-slate-800/50 dark:text-slate-400">
            <p>&copy; 2026 AeroPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
