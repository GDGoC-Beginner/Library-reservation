import apiClient from "../../lib/apiClient";

// mock
import { sleep } from "../../mocks/mockData";
import {
  isMockAuthed,
  getMockUserId,
  getMockCurrentReservation,
} from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getMyReservation = async () => {
  if (USE_MOCK) {
    await sleep(200);

    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    const userId = getMockUserId();

    // ✅ 자동 생성(seed) 금지: 없으면 진짜로 null
    const current = getMockCurrentReservation();

    return {
      userId,
      name: "테스트유저",
      currentReservation: current ?? null,
    };
  }

  const res = await apiClient.get("/reservations/me");
  return res.data; // { userId, name, currentReservation }
};
