// server/src/models/Admin.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string | undefined;
  otpExpires?: Date | undefined;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined;
  awardSpace: Types.ObjectId;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    awardSpace: {
      type: Schema.Types.ObjectId,
      ref: "AwardSpace",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IAdmin>("Admin", adminSchema);
