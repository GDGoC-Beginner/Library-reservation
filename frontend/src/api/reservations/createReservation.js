// src/api/reservations/createReservation.js
import apiClient from "../../lib/apiClient";

export async function createReservation({ seatId, startTime, endTime }) {
  const res = await apiClient.post("/reservations", {
    seatId,
    startTime,
    endTime,
  });
  return res.data;
}
