import { Request, Response } from "express";
import Settings from "../models/Settings";

export async function getSettings(req: Request, res: Response) {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      votingStart: null,
      votingEnd: null,
      candidateCanViewVotes: true,
    });
  }

  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const { votingStart, votingEnd, candidateCanViewVotes } = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      votingStart: votingStart ?? null,
      votingEnd: votingEnd ?? null,
      candidateCanViewVotes: candidateCanViewVotes ?? true,
    });
  } else {
    settings.votingStart = votingStart ?? settings.votingStart;
    settings.votingEnd = votingEnd ?? settings.votingEnd;
    if (typeof candidateCanViewVotes === "boolean") {
      settings.candidateCanViewVotes = candidateCanViewVotes;
    }

    await settings.save();
  }

  res.json(settings);
}
