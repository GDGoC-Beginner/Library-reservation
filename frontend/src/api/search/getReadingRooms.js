import apiClient from "../../lib/apiClient";

export const getReadingRooms = async () => {
  const res = await apiClient.get("/search/reading-rooms");
  return res.data; // { message, rooms: [...] }
};
