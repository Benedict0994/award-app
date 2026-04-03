"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
require("dotenv");
async function startServer() {
    try {
        const MONGO_URI = process.env.MONGO_URI || '';
        const response = await mongoose_1.default.connect(MONGO_URI);
        // console.log(response,'the response')
        // console.log("MongoDB connected");
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Server running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Server error:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map