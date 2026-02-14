// src/api/reservations/cancelReservation.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep } from "../../mocks/mockData";
import {
  isMockAuthed,
  getMockCurrentReservation,
  setMockCurrentReservation,
  pushMockHistoryItem,
} from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

function todayYYYYMMDD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const cancelReservation = async (reservationId) => {
  if (USE_MOCK) {
    await sleep(200);

    if (!isMockAuthed()) {
      const err = new Error("Unauthorized");
      err.response = { status: 401, data: { message: "로그인이 필요합니다.(Mock)" } };
      throw err;
    }

    const cur = getMockCurrentReservation();
    if (!cur || cur.reservationId !== reservationId) {
      const err = new Error("Not Found");
      err.response = { status: 404, data: { message: "예약을 찾을 수 없어요.(Mock)" } };
      throw err;
    }

    // history에 기록 추가 
    pushMockHistoryItem({
      reservationId: cur.reservationId,
      date: todayYYYYMMDD(),
      roomName: cur.roomName ?? "-",
      seatNumber: cur.seatNumber ?? "-",
      startTime: cur.startTime,
      endTime: new Date().toISOString().slice(0, 19), // 반납 시각을 종료로 연출
    });

    // 현재 예약 비우기
    setMockCurrentReservation(null);

    return { message: "좌석 반납 완료(Mock)" };
  }

  const res = await apiClient.delete(`/reservations/${reservationId}`);
  return res.data;
};
