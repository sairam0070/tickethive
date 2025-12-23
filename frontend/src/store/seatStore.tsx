import { create } from "zustand";

export type SeatStatus = "available" | "locked" | "booked";

export interface Seat {
  seatId: string;
  status: SeatStatus;
  holdBy?: string;
}

interface SeatStore {
  seats: Seat[];
  selected: string[];
  setSeats: (seats: Seat[] | ((prev: Seat[]) => Seat[])) => void;
  toggleSelect: (seatId: string) => void;
  clearSelection: () => void;
}

export const useSeatStore = create<SeatStore>((set) => ({
  seats: [],
  selected: [],
  setSeats: (seats) =>
    set((state) => ({
      seats: typeof seats === "function" ? seats(state.seats) : seats,
    })),
  toggleSelect: (seatId) =>
    set((state) => ({
      selected: state.selected.includes(seatId)
        ? state.selected.filter((s) => s !== seatId)
        : [...state.selected, seatId],
    })),
  clearSelection: () => set({ selected: [] }),
}));
