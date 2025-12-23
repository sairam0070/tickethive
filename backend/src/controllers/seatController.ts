import { Request, Response } from "express";
import Seat from "../models/Seat";
import { Server } from "socket.io";

// Get all seats
export const getSeats = async (req: Request, res: Response) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seats", error: err });
  }
};

// Create seats (used when generating grid)
export const createSeats = async (req: Request, res: Response) => {
  const { seats } = req.body; // [{ seatId, status }]
  try {
    const result = await Seat.insertMany(seats, { ordered: false }); // ignore duplicates
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to create seats", error: err });
  }
};

// Hold seat
export const holdSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;
  if (!seatId || !userId)
    return res.status(400).json({ message: "seatId/userId required" });

  const seat = await Seat.findOneAndUpdate(
    {
      seatId,
      status: "available",
      $or: [{ holdExpiresAt: { $lt: new Date() } }, { holdExpiresAt: { $exists: false } }],
    },
    { holdBy: userId, holdExpiresAt: new Date(Date.now() + 60000) },
    { new: true }
  );

  if (!seat) return res.status(400).json({ message: "Seat is already locked or booked" });

  io.emit("seat_update", { seatId: seat.seatId, status: "locked" });
  res.json(seat);
};

// Release expired seats every 5 seconds
export const releaseExpiredSeats = (io: Server) => {
  setInterval(async () => {
    const now = new Date();
    const expiredSeats = await Seat.find({
      holdExpiresAt: { $lt: now },
      holdBy: { $ne: null },
      status: "available",
    });

    for (const seat of expiredSeats) {
      seat.holdBy = undefined;
      seat.holdExpiresAt = undefined;
      await seat.save();
      io.emit("seat_update", { seatId: seat.seatId, status: "available" });
    }
  }, 5000);
};

// Book seat
export const bookSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;
  if (!seatId || !userId)
    return res.status(400).json({ message: "seatId/userId required" });

  const seat = await Seat.findOneAndUpdate(
    { seatId, holdBy: userId, holdExpiresAt: { $gt: new Date() } },
    { status: "booked", holdBy: undefined, holdExpiresAt: undefined },
    { new: true }
  );

  if (!seat) return res.status(400).json({ message: "Seat cannot be booked" });

  io.emit("seat_update", { seatId: seat.seatId, status: "booked" });
  res.json(seat);
};
