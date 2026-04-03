import { Response } from "express";
import Settings from "../models/Settings";
import type { AuthRequest } from "../middleware/authMiddleware";

export async function getSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let settings = await Settings.findOne({
      awardSpace: req.user.awardSpace,
    });

    if (!settings) {
      settings = await Settings.create({
        awardSpace: req.user.awardSpace,
        votingStart: null,
        votingEnd: null,
        candidateCanViewVotes: true,
      });
    }

    res.json(settings);
  } catch {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { votingStart, votingEnd, candidateCanViewVotes } = req.body;

    let settings = await Settings.findOne({
      awardSpace: req.user.awardSpace,
    });

    if (!settings) {
      settings = await Settings.create({
        awardSpace: req.user.awardSpace,
        votingStart: votingStart ?? null,
        votingEnd: votingEnd ?? null,
        candidateCanViewVotes:
          candidateCanViewVotes !== undefined ? candidateCanViewVotes : true,
      });

      return res.json(settings);
    }

    settings.votingStart = votingStart ?? null;
    settings.votingEnd = votingEnd ?? null;

    if (typeof candidateCanViewVotes === "boolean") {
      settings.candidateCanViewVotes = candidateCanViewVotes;
    }

    await settings.save();

    res.json(settings);
  } catch {
    res.status(500).json({ message: "Failed to update settings" });
  }
}
