import React, { useState } from "react";
import { useSeatStore, SeatStatus } from "../context/SeatContext";

interface Props {
  onFilterChange?: (status: SeatStatus | "all") => void;
}

const Sidebar: React.FC<Props> = ({ onFilterChange }) => {
  const [filter, setFilter] = useState<SeatStatus | "all">("all");

  const handleFilter = (status: SeatStatus | "all") => {
    setFilter(status);
    if (onFilterChange) onFilterChange(status);
  };
  

  return (
    <div className="w-40 p-4 bg-gray-100 rounded">
      <h2 className="font-bold mb-2">Filter Seats</h2>
      <button
        className={`block w-full p-2 mb-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-white border"}`}
        onClick={() => handleFilter("all")}
      >
        All
      </button>
      <button
        className={`block w-full p-2 mb-1 rounded ${filter === "available" ? "bg-green-500 text-white" : "bg-white border"}`}
        onClick={() => handleFilter("available")}
      >
        Available
      </button>
      <button
        className={`block w-full p-2 mb-1 rounded ${filter === "selected" ? "bg-amber-400 text-white" : "bg-white border"}`}
        onClick={() => handleFilter("selected")}
      >
        Selected
      </button>
      <button
        className={`block w-full p-2 mb-1 rounded ${filter === "locked" ? "bg-gray-400 text-white" : "bg-white border"}`}
        onClick={() => handleFilter("locked")}
      >
        Locked
      </button>
      <button
        className={`block w-full p-2 mb-1 rounded ${filter === "booked" ? "bg-red-500 text-white" : "bg-white border"}`}
        onClick={() => handleFilter("booked")}
      >
        Booked
      </button>
    </div>
  );
};

export default Sidebar;
