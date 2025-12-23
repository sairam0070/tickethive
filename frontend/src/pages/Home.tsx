import { useEffect } from "react";
import { socket } from "../api/socket";
import { getSeats, createSeats, holdSeat, bookSeat } from "../api/seatApi";
import Grid from "../components/Grid";
import Controls from "../components/Controls";
import BookBar from "../components/BookBar";
import { useSeatStore } from "../store/seatStore";
import type { Seat } from "../store/seatStore";

interface SeatUpdate {
  seatId: string;
  status: "locked" | "booked";
}

export default function Home() {
  const { seats, setSeats, selected, toggleSelect, clearSelection } = useSeatStore();

  // Ensure userId exists
  const userId = localStorage.getItem("userId") || crypto.randomUUID();
  useEffect(() => localStorage.setItem("userId", userId), [userId]);

  // Initial fetch
  useEffect(() => {
    getSeats()
      .then(setSeats)
      .catch((err) => console.error("Failed to fetch seats:", err));
  }, [setSeats]);

  // Socket updates
  useEffect(() => {
    const handler = (update: SeatUpdate) => {
      setSeats((prev: Seat[]) =>
        prev.map((s) => (s.seatId === update.seatId ? { ...s, status: update.status } : s))
      );
    };
    socket.on("seat_update", handler);
    return () => {
      socket.off("seat_update", handler);
    };
  }, [setSeats]);

  // Generate grid + create seats in backend
  const handleGenerate = async (rows: number, cols: number) => {
    const newSeats: Seat[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        newSeats.push({ seatId: `${String.fromCharCode(65 + r)}${c}`, status: "available" });
      }
    }
    setSeats(newSeats);

    try {
      await createSeats(newSeats);
    } catch (err) {
      console.error("Failed to create seats in backend:", err);
    }
  };

  // Hold seat
  const handleSeatClick = async (seat: Seat) => {
    if (seat.status !== "available") return;

    try {
      await holdSeat(seat.seatId, userId);
      toggleSelect(seat.seatId);
    } catch (err: any) {
      console.error("Failed to hold seat:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to hold seat");
    }
  };

  // Book selected seats
  const handleBook = async () => {
    for (const id of selected) {
      try {
        await bookSeat(id, userId);
      } catch (err: any) {
        console.error("Failed to book seat:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Failed to book seat");
      }
    }
    clearSelection();
  };

  return (
    <div className="p-6">
      <Controls onGenerate={handleGenerate} />
      <Grid seats={seats} cols={5} userId={userId} onSeatClick={handleSeatClick} />
      <BookBar selected={selected} onBook={handleBook} />
    </div>
  );
}
