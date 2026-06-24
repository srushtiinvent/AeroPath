import { type Request, type Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const now = new Date();

    const boardingPasses = await prisma.boardingPass.findMany({
      where: {
        flight: {
          trip: {
            userId,
          },
          departureTime: { gte: now },
        },
      },
      include: {
        flight: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.status(200).json({ boardingPasses });
  } catch (error) {
    console.error("Error in getTickets:", error);
    res.status(500).json({ error: "Unable to load boarding passes." });
  }
};

export const uploadTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const flightId = String(req.body.flightId ?? "").trim();
    const fileUrl = String(req.body.fileUrl ?? "").trim();
    const seat = req.body.seat ? String(req.body.seat).trim() : null;
    const gate = req.body.gate ? String(req.body.gate).trim() : null;
    const terminal = req.body.terminal ? String(req.body.terminal).trim() : null;

    if (!flightId || !fileUrl) {
      res.status(400).json({ error: "flightId and fileUrl are required." });
      return;
    }

    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
      select: {
        id: true,
        trip: { select: { userId: true } },
      },
    });

    if (!flight || flight.trip.userId !== userId) {
      res.status(404).json({ error: "Flight not found for this user." });
      return;
    }

    const boardingPass = await prisma.boardingPass.upsert({
      where: { flightId },
      create: {
        flightId,
        fileUrl,
        seat,
        gate,
        terminal,
      },
      update: {
        fileUrl,
        seat,
        gate,
        terminal,
        uploadedAt: new Date(),
      },
    });

    res.status(200).json({ boardingPass });
  } catch (error) {
    console.error("Error in uploadTicket:", error);
    res.status(500).json({ error: "Unable to upload boarding pass." });
  }
};
