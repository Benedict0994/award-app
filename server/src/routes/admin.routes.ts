import { Router } from "express";
import {
  getDashboardSummary,
  getVotingStatus,
  updateVotingStatus,
} from "../controllers/admin.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/voting-status", getVotingStatus);
router.patch("/voting-status", protect, updateVotingStatus);
router.get("/dashboard", protect, getDashboardSummary);

export default router;
