import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Candidate from "../models/Candidate";
import Settings from "../models/Settings";
import { generateSlug } from "../utils/generateSlug";

export async function getCandidates(_req: Request, res: Response) {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch {
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
}

export async function getCandidateById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch {
    res.status(500).json({ message: "Failed to fetch candidate" });
  }
}

export async function createCandidate(req: Request, res: Response) {
  try {
    const { name, category, department, bio } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Candidate image is required" });
    }

    const slug = generateSlug(name + "-" + Date.now());

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
    });

    res.status(201).json(candidate);
  } catch {
    res.status(500).json({ message: "Failed to create candidate" });
  }
}

export async function updateCandidate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, category, department, bio, votes } = req.body;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.name = name ?? candidate.name;
    candidate.category = category ?? candidate.category;
    candidate.department = department ?? candidate.department;
    candidate.bio = bio ?? candidate.bio;

    if (req.file) {
      if (candidate.image) {
        const oldImagePath = path.join(__dirname, "../../", candidate.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      candidate.image = `/uploads/${req.file.filename}`;
    }

    if (typeof votes === "number" && votes !== candidate.votes) {
      candidate.votes = votes;
      candidate.voteHistory.push({
        date: new Date().toISOString(),
        votes,
      });
    }

    await candidate.save();
    res.json(candidate);
  } catch {
    res.status(500).json({ message: "Failed to update candidate" });
  }
}

export async function deleteCandidate(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (candidate.image) {
      const imagePath = path.join(__dirname, "../../", candidate.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Candidate.findByIdAndDelete(id);

    res.json({ message: "Candidate deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete candidate" });
  }
}

export async function getCandidateBySlug(req: Request, res: Response) {
  try {
    const slugparam = req.params.slug;
    if (typeof slugparam !== "string" || !slugparam.trim()) {
      return res.status(400).json({ message: "Invalid candidate slug" });
    }
    const candidate = await Candidate.findOne({ slug: slugparam });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const settings = await Settings.findOne();

    res.json({
      candidate,
      settings,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch candidate" });
  }
}
