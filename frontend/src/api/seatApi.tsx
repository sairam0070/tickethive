import axios from "axios";
import { Seat } from "../store/seatStore";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getSeats = async (): Promise<Seat[]> => {
  const res = await axios.get(`${BASE_URL}/seats`);
  return res.data;
};

// Save generated seats to backend
export const createSeats = async (seats: Seat[]) => {
  return axios.post(`${BASE_URL}/seats/create`, { seats });
};

// Hold a seat
export const holdSeat = async (seatId: string, userId: string) => {
  return axios.post(`${BASE_URL}/seats/hold`, { seatId, userId });
};

// Book a seat
export const bookSeat = async (seatId: string, userId: string) => {
  return axios.post(`${BASE_URL}/seats/book`, { seatId, userId });
};
