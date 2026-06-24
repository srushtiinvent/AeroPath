import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables");
}

const getAvatarInitials = (name: string): string => {
  const words = name
    .trim()
    .split(" ")
    .filter((part) => part.trim().length > 0)
    .map((part) => (part[0] ? part[0].toUpperCase() : ""))
    .filter(Boolean);

  if (words.length === 0) {
    return "AP";
  }

  if (words.length === 1) {
    const first = words[0] ?? "A";
    return first.slice(0, 2).padEnd(2, "A");
  }

  return `${words[0] ?? "A"}${words[1] ?? "A"}`.slice(0, 2);
};

const createJwtToken = (user: { id: string; email: string; name: string }): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL_SECONDS }
  );
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "").trim();
    const name = String(req.body.name ?? "").trim();
    const tagline = req.body.tagline ? String(req.body.tagline).trim() : null;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required." });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "A user with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarInitials = getAvatarInitials(name);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        tagline,
        avatarInitials,
        settings: {
          create: {
            notificationsEnabled: true,
            darkMode: false,
            privacyMode: false,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    const token = createJwtToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tagline: user.tagline,
        avatarInitials: user.avatarInitials,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ error: "Unable to create a new account right now." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "").trim();

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { settings: true },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = createJwtToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tagline: user.tagline,
        avatarInitials: user.avatarInitials,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Unable to authenticate at this time." });
  }
};
