import { useMemo, useState } from "react";
import { importTrip } from "../services/api";

const routeTypes = ["Return", "One-way", "Multi-city"] as const;

const AddTripForm = () => {
  const [routeType, setRouteType] = useState<typeof routeTypes[number]>("Return");
  const [from, setFrom] = useState("Nagpur (NAG)");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("2026-08-14");
  const [returnDate, setReturnDate] = useState("2026-08-21");
  const [addNearby, setAddNearby] = useState(false);
  const [directFlights, setDirectFlights] = useState(false);
  const [stayIncluded, setStayIncluded] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    const route = `${from} → ${to || "Where to?"}`;
    return `${routeType} | ${route} | Depart ${departDate}${routeType === "Return" ? ` | Return ${returnDate}` : ""}`;
  }, [routeType, from, to, departDate, returnDate]);

  const handleSwap = () => {
    if (to.trim().length > 0) {
      setFrom(to);
      setTo(from);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-900/95 p-6 shadow-soft ring-1 ring-slate-800/80 dark:bg-slate-950/95">
        <div className="flex flex-wrap items-center gap-3">
          {routeTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRouteType(type)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                routeType === type
                  ? "border-sky-400 bg-sky-400/10 text-sky-100"
                  : "border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label className="block text-sm text-slate-300">
            From
            <input
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:ring-sky-400"
            />
          </label>

          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-100 shadow-soft transition hover:bg-slate-700"
          >
            ⇄
          </button>

          <label className="block text-sm text-slate-300">
            To
            <input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="Country, city or airport"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:ring-sky-400"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Depart
            <input
              type="date"
              value={departDate}
              onChange={(event) => setDepartDate(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:ring-sky-400"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Return
            <input
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:ring-sky-400"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300 shadow-inner ring-1 ring-slate-800">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={addNearby} onChange={(event) => setAddNearby(event.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-sky-400" />
            Add nearby airports
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={directFlights} onChange={(event) => setDirectFlights(event.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-sky-400" />
            Direct flights
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={stayIncluded} onChange={(event) => setStayIncluded(event.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-sky-400" />
            Add a place to stay
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">{summary}</p>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              setStatusMessage(null);
              try {
                await importTrip({
                  From: from,
                  To: to,
                  "Depart Date": departDate,
                  "Return Date": routeType === "Return" ? returnDate : undefined,
                  options: {
                    "Add nearby airports": addNearby,
                    "Direct flights": directFlights,
                    "Add a place to stay": stayIncluded,
                  },
                });
                setStatusMessage("Trip imported successfully. Check Home for your itinerary.");
              } catch (error) {
                setStatusMessage(String(error));
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Searching..." : "Search"}
          </button>
        </div>
        {statusMessage ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{statusMessage}</p> : null}
      </div>
    </section>
  );
};

export default AddTripForm;
