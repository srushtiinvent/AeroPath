import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables");
}

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; name: string };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or invalid." });
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload?.userId || !payload?.email || !payload?.name) {
      res.status(401).json({ error: "Invalid authentication token." });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized token validation failed." });
  }
};
