import express from "express";
import { getSeats, createSeats, holdSeat, bookSeat, releaseExpiredSeats } from "../controllers/seatController";
import { Server } from "socket.io";

const router = express.Router();
let io: Server;

export const setIO = (socketIO: Server) => {
  io = socketIO;
  releaseExpiredSeats(io); // start release timer
};

// Routes
router.get("/", getSeats); // GET /api/seats
router.post("/create", createSeats); // POST /api/seats/create
router.post("/hold", (req, res) => holdSeat(io)(req, res)); // POST /api/seats/hold
router.post("/book", (req, res) => bookSeat(io)(req, res)); // POST /api/seats/book

export default router;
