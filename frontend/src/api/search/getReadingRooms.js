// src/api/search/getReadingRooms.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep, mockRooms } from "../../mocks/mockData";
import { isMockAuthed } from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getReadingRooms = async () => {
  if (USE_MOCK) {
    await sleep(200);

    // 너 MainPage에서 401/403일 때 "로그인 후 확인" 메시지 띄우니까
    // 여기서는 로그인 안 하면 401 흉내내도 되고,
    // 그냥 목록 보여주고 싶으면 이 블록을 지워도 돼.
    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    return { message: "열람실 목록(Mock)", rooms: mockRooms };
  }

  const res = await apiClient.get("/search/reading-rooms");
  return res.data; // { message, rooms: [...] }
};
