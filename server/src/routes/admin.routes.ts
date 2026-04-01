import { Router } from "express";
import {
  getDashboardSummary,
  getVotingStatus,
  updateVotingStatus,
} from "../controllers/admin.controller";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/voting-status", getVotingStatus);
router.patch("/voting-status", protectAdmin, updateVotingStatus);
router.get("/dashboard", protectAdmin, getDashboardSummary);

export default router;
