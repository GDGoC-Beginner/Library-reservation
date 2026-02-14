// src/api/search/getRoomSeats.js
import apiClient from "../../lib/apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getRoomSeats = async (roomId) => {
  if (USE_MOCK) {
    return { roomId, seats: [] };
  }

  const res = await apiClient.get(`/search/reading-rooms/${roomId}/seats`);
  return res.data;
};
