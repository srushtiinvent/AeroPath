import { type Request, type Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const computeCompletionRate = (visitedCountryCount: number): number => {
  const maxCountriesForGauge = 20;
  const ratio = Math.min(visitedCountryCount / maxCountriesForGauge, 1);
  return Math.round(ratio * 100);
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        tagline: true,
        avatarInitials: true,
        visitedCountries: { orderBy: { addedAt: "asc" } },
        settings: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User profile not found." });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      tagline: user.tagline,
      avatarInitials: user.avatarInitials,
      visitedCountries: user.visitedCountries,
      settings: user.settings,
      travelCompletionRate: computeCompletionRate(user.visitedCountries.length),
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ error: "Unable to load profile data." });
  }
};

export const addVisitedCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const rawCode = String(req.body.countryCode ?? req.body.code ?? "").trim();
    const countryCode = rawCode.toUpperCase();

    if (!countryCode || !/^[A-Z]{2}$/.test(countryCode)) {
      res.status(400).json({ error: "A valid two-letter ISO country code is required." });
      return;
    }

    const existing = await prisma.visitedCountry.findUnique({
      where: { userId_countryCode: { userId, countryCode } },
    });

    if (existing) {
      res.status(400).json({ error: "This country is already tracked for the current profile." });
      return;
    }

    await prisma.visitedCountry.create({
      data: {
        userId,
        countryCode,
      },
    });

    const visitedCountries = await prisma.visitedCountry.findMany({
      where: { userId },
      orderBy: { addedAt: "asc" },
    });

    res.status(201).json({
      visitedCountries,
      travelCompletionRate: computeCompletionRate(visitedCountries.length),
    });
  } catch (error) {
    console.error("Error in addVisitedCountry:", error);
    res.status(500).json({ error: "Unable to add visited country." });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { notificationsEnabled, darkMode, privacyMode } = req.body;
    const updates: Record<string, boolean> = {};

    if (typeof notificationsEnabled === "boolean") {
      updates.notificationsEnabled = notificationsEnabled;
    }
    if (typeof darkMode === "boolean") {
      updates.darkMode = darkMode;
    }
    if (typeof privacyMode === "boolean") {
      updates.privacyMode = privacyMode;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "At least one settings toggle must be provided." });
      return;
    }

    const updatedSettings = await prisma.userSettings.update({
      where: { userId },
      data: updates,
    });

    res.status(200).json({ settings: updatedSettings });
  } catch (error) {
    console.error("Error in updateSettings:", error);
    res.status(500).json({ error: "Unable to update profile settings." });
  }
};
