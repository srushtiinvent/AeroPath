import { useEffect, useMemo, useState } from "react";
import { getHome } from "../services/api";

type FlightCard = {
  id: string;
  departureIATA: string;
  arrivalIATA: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  seat?: string;
  gate?: string;
  terminal?: string;
};

const mockFlights: FlightCard[] = [
  {
    id: "flight-1",
    departureIATA: "JFK",
    arrivalIATA: "CDG",
    flightNumber: "AP 239",
    departureTime: "2026-08-06T09:30:00Z",
    arrivalTime: "2026-08-06T21:15:00Z",
    passengerName: "Srushti Nerkar",
    seat: "14A",
    gate: "B21",
    terminal: "4",
  },
  {
    id: "flight-2",
    departureIATA: "LAX",
    arrivalIATA: "HND",
    flightNumber: "AP 125",
    departureTime: "2026-09-12T12:00:00Z",
    arrivalTime: "2026-09-13T06:40:00Z",
    passengerName: "Srushti Nerkar",
    seat: "02C",
    gate: "C3",
    terminal: "1",
  },
];

const detailsMenu = [
  { id: "baggage", icon: "🧳", title: "Baggage Allowed" },
  { id: "places", icon: "📍", title: "Places to Visit" },
  { id: "restaurants", icon: "🍽", title: "Restaurants" },
  { id: "stays", icon: "🏨", title: "Stays" },
];

const bodyContent = {
  baggage: "1 carry-on (7kg) + 1 checked bag (23kg). Oversize items may incur additional fees.",
  places: "Champ de Mars, Montmartre, Musée d'Orsay, Seine river walk and hidden cafe stops.",
  restaurants: "Le Ciel, Terminal Bistro, Café Lumière, local oyster bar near CDG arrivals.",
  stays: "AeroPath Suites, Hotel du Louvre, Citadine Saint-Germain and Riverfront Loft."
};

type HomeTimelineProps = {
  onBookNow: () => void;
};

const HomeTimeline = ({ onBookNow }: HomeTimelineProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [flights, setFlights] = useState<FlightCard[]>([]);
  const [openFlight, setOpenFlight] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await getHome();
        const upcomingFlights = Array.isArray(response.upcomingFlights)
          ? response.upcomingFlights.map((flight) => ({
              id: String((flight as any).id ?? `flight-${Math.random()}`),
              departureIATA: String((flight as any).departureIATA ?? "N/A"),
              arrivalIATA: String((flight as any).arrivalIATA ?? "N/A"),
              flightNumber: String((flight as any).flightNumber ?? "AP 000"),
              departureTime: String((flight as any).departureTime ?? new Date().toISOString()),
              arrivalTime: String((flight as any).arrivalTime ?? new Date().toISOString()),
              passengerName: String((flight as any).passengerName ?? "Traveler"),
              seat: String((flight as any).seat ?? "TBD"),
              gate: String((flight as any).gate ?? "TBD"),
              terminal: String((flight as any).terminal ?? "TBD"),
            }))
          : [];
        setFlights(upcomingFlights);
      } catch (error) {
        console.error("Home fetch failed", error);
        setFlights(mockFlights);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchFlights();
  }, []);

  const emptyState = useMemo(() => flights.length === 0 && isLoaded, [flights, isLoaded]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-soft dark:border-slate-700/50 dark:bg-slate-900/90">
        <h1 className="text-3xl font-semibold">Welcome back, ready for takeoff?</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Track flights, manage boarding passes, and keep your travel timeline organized in one place.
        </p>
      </div>

      {emptyState && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft dark:border-slate-600 dark:bg-slate-950">
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">No upcoming flights found.</p>
          <button
            type="button"
            onClick={onBookNow}
            className="mt-6 inline-flex rounded-full bg-premium px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Want to book your next destination?
          </button>
        </div>
      )}

      {!isLoaded ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-soft dark:border-slate-700/50 dark:bg-slate-950">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-premium"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your flight timeline...</p>
        </div>
      ) : null}

      {flights.map((flight) => {
        const isExpanded = openFlight === flight.id;
        return (
          <article key={flight.id} className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-soft transition hover:border-premium dark:border-slate-700/50 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setOpenFlight(isExpanded ? null : flight.id)}
              className="flex w-full flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-[1.2fr_auto_1fr] sm:items-center">
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p className="text-5xl font-bold tracking-tight">{flight.departureIATA}</p>
                  <p className="mt-2 text-sm uppercase text-slate-500 dark:text-slate-400">Departs</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{new Date(flight.departureTime).toLocaleDateString()}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-premium text-white shadow-soft">✈</span>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{flight.flightNumber}</p>
                </div>

                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p className="text-5xl font-bold tracking-tight">{flight.arrivalIATA}</p>
                  <p className="mt-2 text-sm uppercase text-slate-500 dark:text-slate-400">Arrives</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{new Date(flight.arrivalTime).toLocaleDateString()}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:max-w-xs">
                <p><span className="font-semibold">Passenger:</span> {flight.passengerName}</p>
                <p><span className="font-semibold">Seat:</span> {flight.seat ?? "TBD"}</p>
                <p><span className="font-semibold">Gate:</span> {flight.gate ?? "TBD"}</p>
                <p><span className="font-semibold">Terminal:</span> {flight.terminal ?? "TBD"}</p>
              </div>
            </button>

            {isExpanded ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {detailsMenu.map((item) => {
                  const active = activeMenu[flight.id] === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMenu((state) => ({
                        ...state,
                        [flight.id]: state[flight.id] === item.id ? "" : item.id,
                      }))}
                      className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-left transition hover:border-premium hover:bg-white dark:border-slate-700/60 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tap to expand</p>
                        </div>
                      </div>
                      {active ? (
                        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{bodyContent[item.id as keyof typeof bodyContent]}</p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
};

export default HomeTimeline;
