// src/api/reservations/getHistory.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep, mockHistorySeed } from "../../mocks/mockData";
import {
  isMockAuthed,
  getMockHistoryItems,
  setMockHistoryItems,
} from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getHistory = async () => {
  if (USE_MOCK) {
    await sleep(200);

    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    // 최초 1회 seed 주입
    const existing = getMockHistoryItems();
    if (!existing || existing.length === 0) {
      setMockHistoryItems(mockHistorySeed);
      return { items: mockHistorySeed };
    }

    return { items: existing };
  }

  const res = await apiClient.get("/histories/me");

  return res.data;
};
