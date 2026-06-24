import { useEffect, useMemo, useState } from "react";
import { getProfile } from "../services/api";

const ProfileMetrics = () => {
  const [name, setName] = useState("Traveler");
  const [tagline, setTagline] = useState("AeroPath Explorer");
  const [initials, setInitials] = useState("AP");
  const [completion, setCompletion] = useState(60);
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getProfile();
        setName(profile.name);
        setTagline(profile.tagline ?? "AeroPath Explorer");
        setInitials(profile.avatarInitials ?? profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase());
        setCompletion(profile.travelCompletionRate);
        setVisitedCountries(profile.visitedCountries.map((country) => country.countryCode));
      } catch (error) {
        console.error("Profile load failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const circumference = 2 * Math.PI * 72;
  const strokeDashoffset = circumference - (completion / 100) * circumference;

  const settings = [
    { title: "Notifications", subtitle: "Daily reminders" },
    { title: "Dark Mode", subtitle: "Appearance" },
    { title: "Privacy", subtitle: "Data & security" },
    { title: "Logout", subtitle: "Sign out of AeroPath" },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-slate-950/90 p-8 text-center text-white shadow-soft">
        {isLoading ? (
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Loading profile...</p>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-sky-500 text-4xl font-black text-white shadow-xl">
              {initials}
            </div>
            <h2 className="text-3xl font-semibold">{name}</h2>
            <p className="mt-2 text-slate-300">{tagline}</p>
          </>
        )}
      </div>

      <div className="grid place-items-center rounded-[2rem] bg-white p-8 shadow-soft dark:bg-slate-950/90">
        <div className="relative h-56 w-56">
          <svg viewBox="0 0 180 180" className="h-full w-full">
            <circle cx="90" cy="90" r="72" className="stroke-slate-200" strokeWidth="16" fill="none" />
            <circle
              cx="90"
              cy="90"
              r="72"
              className="stroke-sky-500"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-semibold text-slate-900 dark:text-white">{completion}%</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Travel progress</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-4 shadow-soft dark:bg-slate-950/90">
        <div className="mb-4 flex items-center justify-between px-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Visited Countries</p>
          <span className="text-sm text-slate-500 dark:text-slate-400">{visitedCountries.length}</span>
        </div>
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {visitedCountries.length > 0 ? (
            visitedCountries.map((countryCode) => (
              <span key={countryCode} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {countryCode}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No visited countries logged yet.</p>
          )}
        </div>
        <div className="divide-y divide-slate-200/80 dark:divide-slate-700">
          {settings.map((item) => (
            <button
              key={item.title}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</p>
              </div>
              <span className="text-xl text-slate-400">›</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileMetrics;
