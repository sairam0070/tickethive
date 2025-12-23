import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  seatId: string;
  status: "available" | "booked";
  holdBy?: string;
  holdExpiresAt?: Date;
}

const SeatSchema: Schema = new Schema({
  seatId: { type: String, required: true, unique: true },
  status: { type: String, default: "available" },
  holdBy: { type: String },
  holdExpiresAt: { type: Date },
});

export default mongoose.model<ISeat>("Seat", SeatSchema);
