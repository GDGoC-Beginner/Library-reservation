// src/api/auth/logout.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep } from "../../mocks/mockData";
import { clearMockSession } from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// POST /auth/logout
export const logout = async () => {
  if (USE_MOCK) {
    await sleep(150);
    clearMockSession();
    return { message: "로그아웃 성공(Mock)", status: "OK" };
  }

  const res = await apiClient.post("/auth/logout");
  return res.data; // { message, status }
};
