"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const Settings_1 = __importDefault(require("../models/Settings"));
async function getSettings(req, res) {
    try {
        if (!req.user?.awardSpace) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let settings = await Settings_1.default.findOne({
            awardSpace: req.user.awardSpace,
        });
        if (!settings) {
            settings = await Settings_1.default.create({
                awardSpace: req.user.awardSpace,
                votingStart: null,
                votingEnd: null,
                candidateCanViewVotes: true,
            });
        }
        res.json(settings);
    }
    catch {
        res.status(500).json({ message: "Failed to fetch settings" });
    }
}
async function updateSettings(req, res) {
    try {
        if (!req.user?.awardSpace) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { votingStart, votingEnd, candidateCanViewVotes } = req.body;
        let settings = await Settings_1.default.findOne({
            awardSpace: req.user.awardSpace,
        });
        if (!settings) {
            settings = await Settings_1.default.create({
                awardSpace: req.user.awardSpace,
                votingStart: votingStart ?? null,
                votingEnd: votingEnd ?? null,
                candidateCanViewVotes: candidateCanViewVotes !== undefined ? candidateCanViewVotes : true,
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
    }
    catch {
        res.status(500).json({ message: "Failed to update settings" });
    }
}
//# sourceMappingURL=settingsController.js.map