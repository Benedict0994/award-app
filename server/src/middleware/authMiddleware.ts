import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    name: string;
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("email" in decoded) ||
      !("name" in decoded) ||
      typeof decoded.email !== "string" ||
      typeof decoded.name !== "string"
    ) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
