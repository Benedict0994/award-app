import { Response } from "express";
import fs from "fs";
import path from "path";
import Candidate from "../models/Candidate";
import Settings from "../models/Settings";
import type { AuthRequest } from "../middleware/authMiddleware";
import { generateSlug } from "../utils/generateSlug";

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

export async function getCandidates(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const candidates = await Candidate.find({
      awardSpace: req.user.awardSpace,
    }).sort({ createdAt: -1 });

    return res.json(candidates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch candidates" });
  }
}

export async function getCandidateById(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const idParam = getSingleString(req.params.id);

    if (!idParam) {
      return res.status(400).json({ message: "Invalid candidate id" });
    }

    const candidate = await Candidate.findOne({
      _id: idParam,
      awardSpace: req.user.awardSpace,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.json(candidate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch candidate" });
  }
}

export async function createCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const name = getSingleString(req.body.name);
    const category = getSingleString(req.body.category);
    const department = getSingleString(req.body.department);
    const bio = getSingleString(req.body.bio) || "";

    if (!name || !category || !department) {
      return res
        .status(400)
        .json({ message: "Name, category, and department are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Candidate image is required" });
    }

    const slug = generateSlug(`${name}-${Date.now()}`);

    const candidate = await Candidate.create({
      name,
      image: `/uploads/${req.file.filename}`,
      category,
      department,
      bio,
      slug,
      votes: 0,
      voteHistory: [
        {
          date: new Date().toISOString(),
          votes: 0,
        },
      ],
      awardSpace: req.user.awardSpace,
    });

    return res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create candidate" });
  }
}

export async function updateCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const idParam = getSingleString(req.params.id);

    if (!idParam) {
      return res.status(400).json({ message: "Invalid candidate id" });
    }

    const candidate = await Candidate.findOne({
      _id: idParam,
      awardSpace: req.user.awardSpace,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const name = getSingleString(req.body.name);
    const category = getSingleString(req.body.category);
    const department = getSingleString(req.body.department);
    const bio = getSingleString(req.body.bio);
    const votesRaw = getSingleString(req.body.votes);

    candidate.name = name ?? candidate.name;
    candidate.category = category ?? candidate.category;
    candidate.department = department ?? candidate.department;
    candidate.bio = bio ?? candidate.bio ?? "";

    if (req.file) {
      if (candidate.image) {
        const oldImagePath = path.join(__dirname, "../../", candidate.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      candidate.image = `/uploads/${req.file.filename}`;
    }

    const parsedVotes =
      votesRaw !== null && votesRaw !== "" ? Number(votesRaw) : undefined;

    if (
      typeof parsedVotes === "number" &&
      !Number.isNaN(parsedVotes) &&
      parsedVotes !== candidate.votes
    ) {
      candidate.votes = parsedVotes;
      candidate.voteHistory.push({
        date: new Date().toISOString(),
        votes: parsedVotes,
      });
    }

    await candidate.save();

    return res.json(candidate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update candidate" });
  }
}

export async function deleteCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const idParam = getSingleString(req.params.id);

    if (!idParam) {
      return res.status(400).json({ message: "Invalid candidate id" });
    }

    const candidate = await Candidate.findOne({
      _id: idParam,
      awardSpace: req.user.awardSpace,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (candidate.image) {
      const imagePath = path.join(__dirname, "../../", candidate.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Candidate.deleteOne({
      _id: idParam,
      awardSpace: req.user.awardSpace,
    });

    return res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete candidate" });
  }
}

export async function getCandidateBySlug(req: AuthRequest, res: Response) {
  try {
    const slugParam = getSingleString(req.params.slug);

    if (!slugParam) {
      return res.status(400).json({ message: "Invalid candidate slug" });
    }

    const candidate = await Candidate.findOne({ slug: slugParam });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const settings = await Settings.findOne({
      awardSpace: candidate.awardSpace,
    });
    const categoryCanidates = await Candidate.find({
      awardSpace: candidate.awardSpace,
      category: candidate.category,
    }).sort({ votes: -1, createdAt: 1 });

    return res.json({
      candidate,
      settings,
      categoryCanidates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch candidate" });
  }
}
