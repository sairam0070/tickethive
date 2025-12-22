import React, { useEffect } from "react";
import Grid from "../components/Grid";
import { useSeatStore, Seat, SeatStatus } from "../context/SeatContext";
import { socket } from "../api/socket";
import { bookSeat } from "../api/seatApi";

const Home: React.FC = () => {
  const seats = useSeatStore((state) => state.seats);
  const setSeats = useSeatStore((state) => state.setSeats);

  // Initialize dummy seats if none
  useEffect(() => {
    if (!seats.length) {
      const rows = 5;
      const cols = 5;
      const newSeats: Seat[][] = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ({
          id: `${String.fromCharCode(65 + r)}${c + 1}`,
          status: "available" as const,
        }))
      );
      setSeats(newSeats);
    }
  }, [seats.length, setSeats]);

  // Socket.IO listener for real-time seat updates
  useEffect(() => {
 // Home.tsx, socket listener
socket.on("seat_update", (data: { row: number; col: number; status: SeatStatus }) => {
  useSeatStore.getState().updateSeat(data.row, data.col, data.status);
});


    return () => {
      socket.off("seat_update");
    };
  }, []);

 const handleSeatClick = async (row: number, col: number) => {
  const seat = seats[row][col];
  if (seat.status === "available") {
    try {
      await  bookSeat(seat.id); // call backend
    } catch (err) {
      console.error("Failed to book seat:", err);
    }
  } else if (seat.status === "selected") {
    useSeatStore.getState().updateSeat(row, col, "available");
  }
};
  const rows = seats.length;
  const cols = rows ? seats[0].length : 0;

  if (!rows) return <div>Loading seats...</div>;

  return <Grid rows={rows} cols={cols} onSeatClick={handleSeatClick} />;
};

export default Home;
