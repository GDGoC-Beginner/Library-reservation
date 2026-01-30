import apiClient from "../../lib/apiClient";

export const getMyReservation = async () => {
  const res = await apiClient.get("/reservations/me");
  return res.data; // { userId, name, currentReservation }
};
