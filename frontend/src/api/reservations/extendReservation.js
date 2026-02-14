// src/api/reservations/extendReservation.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep, EXTEND_LIMIT } from "../../mocks/mockData";
import {
  isMockAuthed,
  getMockCurrentReservation,
  setMockCurrentReservation,
} from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const extendReservation = async (reservationId) => {
  if (USE_MOCK) {
    await sleep(200);

    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    const cur = getMockCurrentReservation();
    if (!cur || !cur.reservationId || cur.reservationId !== reservationId) {
      const err = new Error("Not Found");
      err.response = { status: 404, data: { message: "예약을 찾을 수 없어요.(Mock)" } };
      throw err;
    }

    const count = cur.extendCount ?? 0;
    if (count >= EXTEND_LIMIT) {
      const err = new Error("Conflict");
      err.response = {
        status: 409,
        data: { message: "연장은 최대 1번만 가능해요.(Mock)" },
      };
      throw err;
    }

    // 연장 처리
    const next = { ...cur, extendCount: count + 1 };

    try {
      const end = new Date(next.endTime);
      end.setHours(end.getHours() + 1);
      next.endTime = end.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
    } catch {

    }

    setMockCurrentReservation(next);

    return { message: "연장 성공(Mock)" };
  }

  const res = await apiClient.patch(`/reservations/${reservationId}/extend`, {});
  return res.data;
};
