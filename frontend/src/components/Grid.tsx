import Seat from "./Seat";
import { Seat as SeatType } from "../store/seatStore";

interface Props {
  seats: SeatType[];
  cols: number;
  userId: string;
  onSeatClick: (seat: SeatType) => void;
}

export default function Grid({ seats, cols, userId, onSeatClick }: Props) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
      {seats.map((seat) => (
        <Seat key={seat.seatId} seat={seat} userId={userId} onClick={() => onSeatClick(seat)} />
      ))}
    </div>
  );
}
