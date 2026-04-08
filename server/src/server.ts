import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";
import "dotenv"


async function startServer() {
  try {
    const MONGO_URI = process.env.MONGO_URI || ''
  const response = await mongoose.connect(MONGO_URI);
  // console.log(response,'the response')
    console.log("MongoDB connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

startServer();
