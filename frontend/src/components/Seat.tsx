import React from "react";
import { Seat as SeatType } from "../context/SeatContext";

interface Props {
  seat: SeatType;
  onClick: () => void;
}

const Seat: React.FC<Props> = ({ seat, onClick }) => {
  const color =
    seat.status === "available"
      ? "bg-green-500"
      : seat.status === "selected"
      ? "bg-amber-400"
      : seat.status === "locked"
      ? "bg-gray-400"
      : "bg-red-500";

  return (
    <div
      className={`w-10 h-10 m-1 rounded cursor-pointer ${color}`}
      onClick={seat.status === "locked" || seat.status === "booked" ? undefined : onClick}
    />
  );
};

export default Seat;
