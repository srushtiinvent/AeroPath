import { type Request, type Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const parseDate = (value: string, hour = 10, minute = 0): Date | null => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setUTCHours(hour, minute, 0, 0);
  return parsed;
};

const buildTripTitle = (from: string, to: string, roundTrip: boolean): string => {
  const route = `${from.toUpperCase()} → ${to.toUpperCase()}`;
  return roundTrip ? `${route} (Roundtrip)` : route;
};

export const getHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const now = new Date();

    const flights = await prisma.flight.findMany({
      where: {
        trip: { userId },
        departureTime: { gte: now },
      },
      orderBy: { departureTime: "asc" },
      include: { boardingPass: true, trip: true },
    });

    if (flights.length === 0) {
      res.status(200).json({ upcomingFlights: [], hasUpcomingFlights: false });
      return;
    }

    const upcomingFlights = flights.map((flight) => ({
      id: flight.id,
      tripTitle: flight.trip.title,
      flightNumber: flight.flightNumber,
      departureIATA: flight.departureIATA,
      arrivalIATA: flight.arrivalIATA,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      status: flight.status,
      passengerName: (req as AuthenticatedRequest).user.name,
      seat: flight.boardingPass?.seat ?? null,
      gate: flight.boardingPass?.gate ?? null,
      terminal: flight.boardingPass?.terminal ?? null,
    }));

    res.status(200).json({ upcomingFlights, hasUpcomingFlights: true });
  } catch (error) {
    console.error("Error in getHome:", error);
    res.status(500).json({ error: "Unable to load upcoming itinerary data." });
  }
};

export const getFlightDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const flightId = String(req.params.id ?? "").trim();

    if (!flightId) {
      res.status(400).json({ error: "Flight id is required." });
      return;
    }

    const flight = await prisma.flight.findFirst({
      where: {
        id: flightId,
        trip: { userId },
      },
      include: { trip: true },
    });

    if (!flight) {
      res.status(404).json({ error: "Flight not found for this user." });
      return;
    }

    const details = {
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      departureIATA: flight.departureIATA,
      arrivalIATA: flight.arrivalIATA,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      status: flight.status,
      baggageAllowed: [
        { type: "Carry-on", limit: "1 bag, 7 kg", notes: "Personal item allowed" },
        { type: "Checked", limit: "1 bag, 23 kg", notes: "Oversize baggage may incur fees" },
      ],
      placesToVisit: [
        { name: `Top landmark in ${flight.arrivalIATA}`, description: "Easy access from the airport and a perfect first stop." },
        { name: `Local hidden gem near ${flight.arrivalIATA}`, description: "A popular explorer favorite for authentic experiences." },
        { name: `City center viewpoint`, description: "Recommended for sunset photos and a quick orientation walk." },
      ],
      localRestaurants: [
        { name: "Skyline Bistro", type: "Modern Local", address: "Downtown district" },
        { name: "Terminal Tastes", type: "Fast casual", address: "Near arrival gate" },
        { name: "Heritage Café", type: "Local cuisine", address: "Historic quarter" },
      ],
      accommodations: [
        { name: "AeroPath Stay", checkIn: "15:00", checkOut: "11:00", notes: "Close to transit and city landmarks." },
        { name: "Cloud Nine Hotel", checkIn: "14:00", checkOut: "12:00", notes: "Excellent reviews for business and leisure travelers." },
      ],
    };

    res.status(200).json(details);
  } catch (error) {
    console.error("Error in getFlightDetails:", error);
    res.status(500).json({ error: "Unable to load flight details." });
  }
};

export const importTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const from = String(req.body.From ?? req.body.from ?? "").trim();
    const to = String(req.body.To ?? req.body.to ?? "").trim();
    const departDateRaw = String(req.body["Depart Date"] ?? req.body.departDate ?? "").trim();
    const returnDateRaw = String(req.body["Return Date"] ?? req.body.returnDate ?? "").trim();
    const addPlaceToStay =
      req.body["Add a place to stay"] ??
      req.body.addAPlaceToStay ??
      req.body.options?.["Add a place to stay"] ??
      false;

    if (!from || !to || !departDateRaw) {
      res.status(400).json({ error: "From, To, and Depart Date are required." });
      return;
    }

    const departureTime = parseDate(departDateRaw, 10, 0);
    if (!departureTime) {
      res.status(400).json({ error: "Depart Date must be a valid ISO date." });
      return;
    }

    const outboundArrival = new Date(departureTime.getTime() + 7.5 * 60 * 60 * 1000);
    const outboundFlight = {
      flightNumber: `AP${Math.floor(100 + Math.random() * 899)}`,
      departureIATA: from.toUpperCase(),
      arrivalIATA: to.toUpperCase(),
      departureTime,
      arrivalTime: outboundArrival,
      status: "ON_TIME",
    };

    const flightsData = [outboundFlight];
    let roundTrip = false;

    if (returnDateRaw) {
      const returnDeparture = parseDate(returnDateRaw, 16, 0);
      if (!returnDeparture) {
        res.status(400).json({ error: "Return Date must be a valid ISO date." });
        return;
      }
      const returnArrival = new Date(returnDeparture.getTime() + 7.5 * 60 * 60 * 1000);
      flightsData.push({
        flightNumber: `AP${Math.floor(100 + Math.random() * 899)}`,
        departureIATA: to.toUpperCase(),
        arrivalIATA: from.toUpperCase(),
        departureTime: returnDeparture,
        arrivalTime: returnArrival,
        status: "ON_TIME",
      });
      roundTrip = true;
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        title: buildTripTitle(from, to, roundTrip),
        flights: {
          create: flightsData,
        },
      },
      include: { flights: true },
    });

    res.status(201).json({
      trip,
      imported: true,
      addPlaceToStay: Boolean(addPlaceToStay),
    });
  } catch (error) {
    console.error("Error in importTrip:", error);
    res.status(500).json({ error: "Unable to import trip data right now." });
  }
};
