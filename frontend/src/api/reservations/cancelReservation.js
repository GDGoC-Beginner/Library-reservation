import apiClient from "../../lib/apiClient";

export const cancelReservation = async (reservationId) => {
  const res = await apiClient.delete(`/reservations/${reservationId}`);
  return res.data;
};
