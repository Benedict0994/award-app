import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admins } from "../data/admins";
import { env } from "../config/env";
export function login(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log("Incoming login", email, password);

  const admin = admins.find(
    (user) =>
      user.email.toLowerCase() === String(email).toLowerCase() &&
      user.password === password,
  );

  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      email: admin.email,
      name: admin.name,
    },
    env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return res.json({
    token,
    user: {
      email: admin.email,
      name: admin.name,
    },
  });
}
