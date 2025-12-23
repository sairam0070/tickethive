"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSeat = exports.releaseExpiredSeats = exports.holdSeat = exports.createSeats = exports.getSeats = void 0;
const Seat_1 = __importDefault(require("../models/Seat"));
/* ---------------- GET SEATS ---------------- */
const getSeats = async (req, res) => {
    const seats = await Seat_1.default.find();
    res.json(seats);
};
exports.getSeats = getSeats;
/* ---------------- CREATE SEATS ---------------- */
const createSeats = async (req, res) => {
    const { seats } = req.body;
    try {
        await Seat_1.default.insertMany(seats, { ordered: false });
        res.json({ message: "Seats created" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create seats", error: err });
    }
};
exports.createSeats = createSeats;
/* ---------------- HOLD SEAT ---------------- */
const holdSeat = (io) => async (req, res) => {
    const { seatId, userId } = req.body;
    if (!seatId || !userId) {
        return res.status(400).json({ message: "seatId/userId required" });
    }
    // bookSeat
    const seat = await Seat_1.default.findOneAndUpdate({
        seatId,
        holdBy: userId,
        holdExpiresAt: { $gt: new Date() },
    }, {
        status: "booked",
        holdBy: undefined,
        holdExpiresAt: undefined,
    }, { new: true });
    if (!seat) {
        return res.status(400).json({ message: "Seat already locked or booked" });
    }
    io.emit("seat_update", { seatId: seat.seatId, status: "locked" });
    res.json(seat);
};
exports.holdSeat = holdSeat;
/* ---------------- RELEASE EXPIRED SEATS ---------------- */
const releaseExpiredSeats = (io) => {
    setInterval(async () => {
        const now = new Date();
        const expiredSeats = await Seat_1.default.find({
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
exports.releaseExpiredSeats = releaseExpiredSeats;
/* ---------------- BOOK SEAT ---------------- */
const bookSeat = (io) => async (req, res) => {
    const { seatId, userId } = req.body;
    if (!seatId || !userId) {
        return res.status(400).json({ message: "seatId/userId required" });
    }
    const seat = await Seat_1.default.findOneAndUpdate({
        seatId,
        holdBy: userId,
        holdExpiresAt: { $gt: new Date() },
    }, {
        status: "booked",
        holdBy: null,
        holdExpiresAt: null,
    }, { new: true });
    if (!seat) {
        return res.status(400).json({ message: "Seat cannot be booked" });
    }
    io.emit("seat_update", { seatId: seat.seatId, status: "booked" });
    res.json(seat);
};
exports.bookSeat = bookSeat;
