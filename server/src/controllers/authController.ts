import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/Admin";
import AwardSpace from "../models/AwardSpace";
import Settings from "../models/Settings";
import { generateToken } from "../utils/generateToken";

function getSingleString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "string" &&
    value[0].trim()
  ) {
    return value[0].trim();
  }

  return null;
}

export async function signup(req: Request, res: Response) {
  try {
    const name = getSingleString(req.body.name);
    const email = getSingleString(req.body.email)?.toLowerCase();
    const password = getSingleString(req.body.password);
    const awardName = getSingleString(req.body.awardName);
    const awardSlug = getSingleString(req.body.awardSlug);

    if (!name || !email || !password || !awardName || !awardSlug) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    let awardSpace = await AwardSpace.findOne({ slug: awardSlug });

    if (!awardSpace) {
      awardSpace = await AwardSpace.create({
        name: awardName,
        slug: awardSlug,
        isActive: true,
      });

      await Settings.create({
        awardSpace: awardSpace._id,
        votingStart: null,
        votingEnd: null,
        candidateCanViewVotes: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      awardSpace: awardSpace._id,
    });

    const token = generateToken({
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      awardSpace: String(admin.awardSpace),
    });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        awardSpace: admin.awardSpace,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const email = getSingleString(req.body.email)?.toLowerCase();
    const password = getSingleString(req.body.password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Admin account not verified" });
    }

    const matched = await bcrypt.compare(password, admin.password);

    if (!matched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      awardSpace: String(admin.awardSpace),
    });

    return res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        awardSpace: admin.awardSpace,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const email = getSingleString(req.body.email)?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "No admin found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15);

    await admin.save();

    return res.json({
      message: "Reset token generated",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Forgot password failed" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const tokenParam = getSingleString(req.params.token);
    const password = getSingleString(req.body.password);

    if (!tokenParam) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenParam)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Reset password failed" });
  }
}
