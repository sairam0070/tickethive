import { Seat as SeatType } from "../store/seatStore";

interface Props {
  seat: SeatType;
  userId: string;
  onClick: () => void;
}

export default function Seat({ seat, userId, onClick }: Props) {
  const isMine = seat.holdBy === userId;
  const color =
    seat.status === "booked"
      ? "bg-red-500"
      : isMine
      ? "bg-amber-400"
      : seat.holdBy
      ? "bg-gray-400"
      : "bg-green-500";

  return (
    <div
      onClick={!seat.holdBy || isMine ? onClick : undefined}
      className={`w-10 h-10 rounded cursor-pointer ${color}`}
    />
  );
}
