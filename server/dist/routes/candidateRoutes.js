"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateController_1 = require("../controllers/candidateController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
// 🔓 Public route (no auth)
router.get("/public/:slug", candidateController_1.getCandidateBySlug);
// 🔒 Protected routes
router.get("/", authMiddleware_1.protect, candidateController_1.getCandidates);
router.get("/:id", authMiddleware_1.protect, candidateController_1.getCandidateById);
router.post("/", authMiddleware_1.protect, uploadMiddleware_1.upload.single("image"), candidateController_1.createCandidate);
router.put("/:id", authMiddleware_1.protect, uploadMiddleware_1.upload.single("image"), candidateController_1.updateCandidate);
router.delete("/:id", authMiddleware_1.protect, candidateController_1.deleteCandidate);
exports.default = router;
//# sourceMappingURL=candidateRoutes.js.map