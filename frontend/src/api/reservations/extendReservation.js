import apiClient from "../../lib/apiClient";

export const extendReservation = async (reservationId) => {
  const res = await apiClient.patch(`/reservations/${reservationId}/extend`, {});
  return res.data;
};
