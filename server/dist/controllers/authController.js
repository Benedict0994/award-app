"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const Admin_1 = __importDefault(require("../models/Admin"));
const AwardSpace_1 = __importDefault(require("../models/AwardSpace"));
const Settings_1 = __importDefault(require("../models/Settings"));
const generateToken_1 = require("../utils/generateToken");
function getSingleString(value) {
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }
    if (Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string" &&
        value[0].trim()) {
        return value[0].trim();
    }
    return null;
}
async function signup(req, res) {
    try {
        const name = getSingleString(req.body.name);
        const email = getSingleString(req.body.email)?.toLowerCase();
        const password = getSingleString(req.body.password);
        const awardName = getSingleString(req.body.awardName);
        const awardSlug = getSingleString(req.body.awardSlug);
        if (!name || !email || !password || !awardName || !awardSlug) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingAdmin = await Admin_1.default.findOne({ email });
        console.log(existingAdmin);
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        let awardSpace = await AwardSpace_1.default.findOne({ slug: awardSlug });
        if (!awardSpace) {
            awardSpace = await AwardSpace_1.default.create({
                name: awardName,
                slug: awardSlug,
                isActive: true,
            });
            await Settings_1.default.create({
                awardSpace: awardSpace._id,
                votingStart: null,
                votingEnd: null,
                candidateCanViewVotes: true,
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await Admin_1.default.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
            awardSpace: awardSpace._id,
        });
        console.log("admin", admin);
        const token = (0, generateToken_1.generateToken)({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Signup failed" });
    }
}
async function login(req, res) {
    try {
        const email = getSingleString(req.body.email)?.toLowerCase();
        const password = getSingleString(req.body.password);
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const admin = await Admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!admin.isVerified) {
            return res.status(403).json({ message: "Admin account not verified" });
        }
        const matched = await bcryptjs_1.default.compare(password, admin.password);
        if (!matched) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = (0, generateToken_1.generateToken)({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed" });
    }
}
async function forgotPassword(req, res) {
    try {
        const email = getSingleString(req.body.email)?.toLowerCase();
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await Admin_1.default.findOne({ email });
        if (!admin) {
            return res
                .status(404)
                .json({ message: "No admin found with that email" });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Forgot password failed" });
    }
}
async function resetPassword(req, res) {
    try {
        const tokenParam = getSingleString(req.params.token);
        const password = getSingleString(req.body.password);
        if (!tokenParam) {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(tokenParam)
            .digest("hex");
        const admin = await Admin_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!admin) {
            return res.status(400).json({ message: "Token is invalid or expired" });
        }
        admin.password = await bcryptjs_1.default.hash(password, 10);
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();
        return res.json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Reset password failed" });
    }
}
//# sourceMappingURL=authController.js.map