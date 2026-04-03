// server/src/models/Settings.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISettings extends Document {
  votingStart: string | null;
  votingEnd: string | null;
  candidateCanViewVotes: boolean;
  awardSpace: Types.ObjectId;
}

const settingsSchema = new Schema<ISettings>(
  {
    votingStart: { type: String, default: null },
    votingEnd: { type: String, default: null },
    candidateCanViewVotes: { type: Boolean, default: true },
    awardSpace: {
      type: Schema.Types.ObjectId,
      ref: "AwardSpace",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ISettings>("Settings", settingsSchema);
