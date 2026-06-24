import { useEffect, useMemo, useState } from "react";
import { getTickets } from "../services/api";

type BoardingPassItem = {
  id: string;
  trip: string;
  destination: string;
  date: string;
  gate: string;
  status: string;
  ticketType: string;
};

const mockTickets: BoardingPassItem[] = [
  { id: "bp-01", trip: "Paris Escape", destination: "CDG", date: "Aug 06, 2026", gate: "B21", status: "Confirmed", ticketType: "PDF" },
  { id: "bp-02", trip: "Tokyo Stopover", destination: "HND", date: "Sep 12, 2026", gate: "C3", status: "Confirmed", ticketType: "Image" },
];

const dbName = "aeropath-boarding";
const storeName = "tickets";

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const BoardingPassVault = () => {
  const [tickets, setTickets] = useState<BoardingPassItem[]>([]);
  const [selected, setSelected] = useState<BoardingPassItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const db = await openDatabase();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          const result = request.result as BoardingPassItem[];
          setTickets(result.length ? result : mockTickets);
        };
        request.onerror = () => {
          setTickets(mockTickets);
        };
      } catch {
        setTickets(mockTickets);
      }
    };

    const loadRemote = async () => {
      try {
        const response = await getTickets();
        const remoteTickets = Array.isArray(response.boardingPasses)
          ? response.boardingPasses.map((item) => ({
              id: String((item as any).id),
              trip: String((item as any).flight?.trip?.title ?? "Trip"),
              destination: String((item as any).flight?.arrivalIATA ?? "N/A"),
              date: new Date(String((item as any).flight?.departureTime ?? new Date())).toLocaleDateString(),
              gate: String((item as any).gate ?? "TBD"),
              status: String((item as any).flight?.status ?? "Saved"),
              ticketType: String((item as any).ticketType ?? "PDF"),
            }))
          : [];
        if (remoteTickets.length > 0) {
          setTickets(remoteTickets);
        }
      } catch (error) {
        console.warn("Ticket fetch failed, using local cache", error);
      }
    };

    loadSaved();
    loadRemote();
  }, []);

  const saveTicket = async (ticket: BoardingPassItem) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.put(ticket);
      tx.oncomplete = () => setTickets((prev) => [ticket, ...prev.filter((item) => item.id !== ticket.id)]);
    } catch (error) {
      console.error("Ticket save failed", error);
    }
  };

  const badge = useMemo(() => {
    const count = tickets.length;
    return count <= 2 ? "Fresh" : "Priority";
  }, [tickets.length]);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-700/60 dark:bg-slate-950/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Offline-ready vault</p>
            <h2 className="mt-2 text-3xl font-semibold">Boarding pass vault</h2>
          </div>
          <span className="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">{badge}</span>
        </div>

        <div className="mt-6 space-y-4">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setSelected(ticket)}
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-left transition hover:border-sky-400 hover:bg-white dark:border-slate-700/60 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{ticket.trip}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Destination {ticket.destination}</p>
                </div>
                <div className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {ticket.status}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span>{ticket.date}</span>
                <span>Gate {ticket.gate}</span>
                <span>{ticket.ticketType}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-soft dark:border-slate-700/60 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="w-full rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          + ADD BOARDING PASS
        </button>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Verification</p>
                <h3 className="mt-2 text-2xl font-semibold">{selected.trip}</h3>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Close
              </button>
            </div>
            <div className="mt-8 rounded-3xl border border-slate-200/80 bg-slate-100 p-8 text-center dark:border-slate-700/60 dark:bg-slate-900">
              <div className="mx-auto mb-6 h-48 w-48 rounded-3xl bg-slate-200 p-6 dark:bg-slate-800">
                <p className="text-6xl">🔒</p>
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Encrypted boarding access</p>
              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Scan this code at the gate</p>
            </div>
          </div>
        </div>
      ) : null}

      {isSheetOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Add boarding pass</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">Choose a document source to sync for offline use.</p>
              </div>
              <button type="button" onClick={() => setIsSheetOpen(false)} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Cancel
              </button>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  saveTicket({
                    id: `bp-${Date.now()}`,
                    trip: "New boarding pass",
                    destination: "SFO",
                    date: "Oct 03, 2026",
                    gate: "A12",
                    status: "Saved",
                    ticketType: "PDF",
                  });
                  setIsSheetOpen(false);
                }}
                className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-left text-slate-700 transition hover:border-sky-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Select PDF from Device Storage
              </button>
              <button
                type="button"
                onClick={() => {
                  saveTicket({
                    id: `bp-${Date.now()}`,
                    trip: "New boarding pass",
                    destination: "YVR",
                    date: "Oct 08, 2026",
                    gate: "D7",
                    status: "Saved",
                    ticketType: "Image",
                  });
                  setIsSheetOpen(false);
                }}
                className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-left text-slate-700 transition hover:border-sky-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Select Image from Gallery
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default BoardingPassVault;
