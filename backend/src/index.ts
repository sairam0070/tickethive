import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seatRoutes from "./routes/seatRoutes";
import { releaseExpiredSeats } from "./controllers/seatController";

dotenv.config();

// IMPORTANT: Disable mongoose buffering
mongoose.set("bufferCommands", false);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// Routes
app.use("/api/seats", seatRoutes(io));

const PORT = process.env.PORT || 5000;

// 🔥 CONNECT DB FIRST, THEN START SERVER
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");

    // Start release job ONLY after DB connection
    releaseExpiredSeats(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
