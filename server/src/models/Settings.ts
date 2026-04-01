import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  votingStart: string | null;
  votingEnd: string | null;
  candidateCanViewVotes: boolean;
}

const settingsSchema = new Schema<ISettings>(
  {
    votingStart: { type: String, default: null },
    votingEnd: { type: String, default: null },
    candidateCanViewVotes: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<ISettings>("Settings", settingsSchema);
