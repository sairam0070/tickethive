import { Request, Response } from "express";
import Seat from "../models/Seat";
import { Server } from "socket.io";

export const getSeats = async (req: Request, res: Response) => {
  const seats = await Seat.find();
  res.json(seats);
};

export const holdSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;

  const seat = await Seat.findOneAndUpdate(
    { seatId, status: "available", $or: [{ holdExpiresAt: { $lt: new Date() } }, { holdExpiresAt: null }] },
    { holdBy: userId, holdExpiresAt: new Date(Date.now() + 60000) },
    { new: true }
  );

  if (!seat) return res.status(400).json({ message: "Seat is already locked or booked" });

  io.emit("seat_update", { seatId: seat.seatId, status: "locked" });
  res.json(seat);
};

export const bookSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;

  const seat = await Seat.findOneAndUpdate(
    { seatId, holdBy: userId, holdExpiresAt: { $gt: new Date() } },
    { status: "booked", holdBy: null, holdExpiresAt: null },
    { new: true }
  );

  if (!seat) return res.status(400).json({ message: "Seat cannot be booked" });

  io.emit("seat_update", { seatId: seat.seatId, status: "booked" });
  res.json(seat);
};
