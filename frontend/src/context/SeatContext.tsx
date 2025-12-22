// import create from "zustand";
import { create } from 'zustand';
export type SeatStatus = "available" | "selected" | "locked" | "booked";

export interface Seat {
  id: string; // e.g., "B5"
  status: SeatStatus;
}

interface SeatState {
  seats: Seat[][];
  setSeats: (seats: Seat[][]) => void;
  updateSeat: (row: number, col: number, status: SeatStatus) => void;
}

export const useSeatStore = create<SeatState>((set) => ({
  seats: [],
  setSeats: (seats) => set({ seats }),
  updateSeat: (row, col, status) =>
    set((state) => {
      const newSeats = [...state.seats];
      newSeats[row][col] = { ...newSeats[row][col], status };
      return { seats: newSeats };
    }),
}));
