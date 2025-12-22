import React from "react";
import Seat from "./Seat";
import { useSeatStore } from "../context/SeatContext";

interface Props {
  rows: number;
  cols: number;
  onSeatClick: (row: number, col: number) => void;
}

const Grid: React.FC<Props> = ({ rows, cols, onSeatClick }) => {
  const seats = useSeatStore((state) => state.seats);

  if (!seats.length) return null;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
      {seats.map((rowSeats, rIdx) =>
        rowSeats.map((seat, cIdx) => (
          <Seat key={seat.id} seat={seat} onClick={() => onSeatClick(rIdx, cIdx)} />
        ))
      )}
    </div>
  );
};

export default Grid;
