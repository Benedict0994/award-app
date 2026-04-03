// server/src/models/AwardSpace.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAwardSpace extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

const awardSpaceSchema = new Schema<IAwardSpace>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IAwardSpace>("AwardSpace", awardSpaceSchema);
