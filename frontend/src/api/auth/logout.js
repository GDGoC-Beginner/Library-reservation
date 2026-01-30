import apiClient from "../../lib/apiClient";

// POST /auth/logout
export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data; // { message, status }
};
