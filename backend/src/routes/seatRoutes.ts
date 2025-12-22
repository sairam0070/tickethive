import { Router } from "express";
import { getSeats, holdSeat, bookSeat } from "../controllers/seatController";
import { Server } from "socket.io";

const seatRoutes = (io: Server) => {
  const router = Router();

  router.get("/", getSeats);
  router.post("/hold", holdSeat(io));
  router.post("/book", bookSeat(io));

  return router;
};

export default seatRoutes;
