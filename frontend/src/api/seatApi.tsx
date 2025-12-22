import axios from "axios";
import { Seat } from "../context/SeatContext";

// Backend URL from environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getSeats = async (): Promise<Seat[][]> => {
  try {
    const res = await axios.get(`${BASE_URL}/seats`);
    return res.data;
  } catch (err) {
    console.error("Error fetching seats:", err);
    return [];
  }
};

export const bookSeat = async (seatId: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/seats/book`, { seatId });
    return res.data;
  } catch (err) {
    console.error("Error booking seat:", err);
    throw err;
  }
};
