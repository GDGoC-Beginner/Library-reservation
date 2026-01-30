import apiClient from "../../lib/apiClient";

export const getHistory = async () => {
  const res = await apiClient.get("/reservations/history");
  return res.data; // { items: [...] }
};
