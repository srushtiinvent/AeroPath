const AUTH_KEY = "AEROPATH_AUTH_TOKEN";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_KEY);
};

const defaultHeaders = {
  "Content-Type": "application/json",
};

const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers = {
    ...defaultHeaders,
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(path, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error ?? response.statusText;
    throw new Error(`API error ${response.status}: ${message}`);
  }
  return response.json();
};

export const signup = async (payload: { email: string; password: string; name: string; tagline?: string }) =>
  apiFetch<{ token: string; user: unknown }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const login = async (email: string, password: string) =>
  apiFetch<{ token: string; user: unknown }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getHome = async () =>
  apiFetch<{ upcomingFlights: unknown[]; hasUpcomingFlights: boolean }>("/api/trips/home");

export const importTrip = async (payload: Record<string, unknown>) =>
  apiFetch<{ trip: unknown; imported: boolean }>('/api/trips/import', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getTickets = async () => apiFetch<{ boardingPasses: unknown[] }>("/api/tickets");

export const getProfile = async () =>
  apiFetch<{ id: string; email: string; name: string; tagline?: string; avatarInitials?: string; visitedCountries: Array<{ id: string; countryCode: string }>; travelCompletionRate: number }>("/api/profile");

export const addVisitedCountry = async (countryCode: string) =>
  apiFetch<{ visitedCountries: Array<{ id: string; countryCode: string }>; travelCompletionRate: number }>("/api/profile/countries", {
    method: "POST",
    body: JSON.stringify({ countryCode }),
  });

export const updateSettings = async (settings: Record<string, boolean>) =>
  apiFetch<{ settings: Record<string, boolean> }>("/api/profile/settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });

export const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
};
