// src/api/search/getReadingRooms.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep, mockRooms } from "../../mocks/mockData";
import { isMockAuthed } from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getReadingRooms = async () => {
  if (USE_MOCK) {
    await sleep(200);

    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    return { message: "열람실 목록(Mock)", rooms: mockRooms };
  }

  const res = await apiClient.get("/search/reading-rooms");
  return res.data;
};
