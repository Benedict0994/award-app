"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const candidateRoutes_1 = __importDefault(require("./routes/candidateRoutes"));
const SettingsRoutes_1 = __importDefault(require("./routes/SettingsRoutes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/candidates", candidateRoutes_1.default);
app.use("/api/settings", SettingsRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Voting API is running");
});
exports.default = app;
//# sourceMappingURL=app.js.map