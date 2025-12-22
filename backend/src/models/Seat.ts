import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  seatId: string;
  status: "available" | "booked";
  holdBy?: string;
  holdExpiresAt?: Date;
}

const seatSchema = new Schema<ISeat>({
  seatId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
  holdBy: { type: String },
  holdExpiresAt: { type: Date },
});

export default mongoose.model<ISeat>("Seat", seatSchema);
