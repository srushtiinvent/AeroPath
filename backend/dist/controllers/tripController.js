"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlightDetails = exports.getHomeTimeline = void 0;
const db_1 = __importDefault(require("../config/db"));
const getHomeTimeline = async (req, res) => {
    try {
        const uid = req.uid;
        if (!uid)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await db_1.default.user.findUnique({ where: { firebaseUid: uid } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const flights = await db_1.default.flight.findMany({
            where: {
                trip: { userId: user.id },
                departureTime: { gte: new Date() },
            },
            include: { boardingPass: true },
            orderBy: { departureTime: 'asc' },
        });
        if (!flights.length)
            return res.status(200).json({ hasUpcomingFlights: false, flights: [] });
        const rows = flights.map((f) => ({
            id: f.id,
            flightNumber: f.flightNumber,
            departureIATA: f.departureIATA,
            arrivalIATA: f.arrivalIATA,
            departureTime: f.departureTime,
            arrivalTime: f.arrivalTime,
            status: f.status,
            seat: f.boardingPass?.seat || null,
            gate: f.boardingPass?.gate || null,
            terminal: f.boardingPass?.terminal || null,
        }));
        return res.status(200).json({ hasUpcomingFlights: true, flights: rows });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to load home timeline', detail: err.message });
    }
};
exports.getHomeTimeline = getHomeTimeline;
const getFlightDetails = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: 'Missing flight id' });
        const flight = await db_1.default.flight.findUnique({ where: { id }, include: { boardingPass: true, trip: true } });
        if (!flight)
            return res.status(404).json({ error: 'Flight not found' });
        // Return mocked arrays for the four bento components for now
        const baggage = [{ type: 'Cabin', weightKg: 7 }, { type: 'Checked', weightKg: 23 }];
        const hotspots = [
            { name: 'Old Town', description: 'Historic center with cafes' },
            { name: 'Sky Museum', description: 'Aviation exhibitions' },
        ];
        const restaurants = [
            { name: 'Gate 5 Bistro', terminal: flight.boardingPass?.terminal || '1' },
            { name: 'Sky Lounge', terminal: flight.boardingPass?.terminal || '2' },
        ];
        const stays = [
            { name: 'Hotel Central', nights: 3 },
        ];
        return res.status(200).json({ flight, bento: { baggage, hotspots, restaurants, stays } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to load flight details', detail: err.message });
    }
};
exports.getFlightDetails = getFlightDetails;
exports.default = { getHomeTimeline: exports.getHomeTimeline, getFlightDetails: exports.getFlightDetails };
//# sourceMappingURL=tripController.js.map