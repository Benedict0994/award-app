import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVoteHistory {
  date: string;
  votes: number;
}

export interface ICandidate extends Document {
  name: string;
  image: string;
  category: string;
  department: string;
  votes: number;
  slug: string;
  bio?: string;
  voteHistory: IVoteHistory[];
  awardSpace: Types.ObjectId;
}

const voteHistorySchema = new Schema<IVoteHistory>(
  {
    date: { type: String, required: true },
    votes: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const candidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    votes: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    voteHistory: { type: [voteHistorySchema], default: [] },
    awardSpace: {
      type: Schema.Types.ObjectId,
      ref: "AwardSpace",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>("Candidate", candidateSchema);