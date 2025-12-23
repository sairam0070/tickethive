import { Request, Response } from "express";
import Seat from "../models/Seat";
import { Server } from "socket.io";

/* ---------------- GET SEATS ---------------- */
export const getSeats = async (req: Request, res: Response) => {
  const seats = await Seat.find();
  res.json(seats);
};

/* ---------------- CREATE SEATS ---------------- */
export const createSeats = async (req: Request, res: Response) => {
  const { seats } = req.body;

  try {
    await Seat.insertMany(seats, { ordered: false });
    res.json({ message: "Seats created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create seats", error: err });
  }
};

/* ---------------- HOLD SEAT ---------------- */
export const holdSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ message: "seatId/userId required" });
  }

 // bookSeat
const seat = await Seat.findOneAndUpdate(
  {
    seatId,
    holdBy: userId,
    holdExpiresAt: { $gt: new Date() },
  },
  {
    status: "booked",
    holdBy: undefined,
    holdExpiresAt: undefined,
  },
  { new: true }
);

  if (!seat) {
    return res.status(400).json({ message: "Seat already locked or booked" });
  }

  io.emit("seat_update", { seatId: seat.seatId, status: "locked" });
  res.json(seat);
};

/* ---------------- RELEASE EXPIRED SEATS ---------------- */
export const releaseExpiredSeats = (io: Server) => {
  setInterval(async () => {
    const now = new Date();

    const expiredSeats = await Seat.find({
      holdExpiresAt: { $lt: now },
      holdBy: { $ne: null },
    });
// releaseExpiredSeats
for (const seat of expiredSeats) {
  seat.holdBy = undefined;
  seat.holdExpiresAt = undefined;
  await seat.save();

  io.emit("seat_update", {
    seatId: seat.seatId,
    status: "available",
  });
}

  }, 5000);
};

/* ---------------- BOOK SEAT ---------------- */
export const bookSeat = (io: Server) => async (req: Request, res: Response) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ message: "seatId/userId required" });
  }

  const seat = await Seat.findOneAndUpdate(
    {
      seatId,
      holdBy: userId,
      holdExpiresAt: { $gt: new Date() },
    },
    {
      status: "booked",
      holdBy: null,
      holdExpiresAt: null,
    },
    { new: true }
  );

  if (!seat) {
    return res.status(400).json({ message: "Seat cannot be booked" });
  }

  io.emit("seat_update", { seatId: seat.seatId, status: "booked" });
  res.json(seat);
};
