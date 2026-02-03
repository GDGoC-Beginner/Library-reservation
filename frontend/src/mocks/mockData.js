// src/mocks/mockData.js

export const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const EXTEND_LIMIT = 1;

// 기본 열람실 목록(Mock)
export const mockRooms = [
  { roomId: 1, roomName: "제1열람실", availableSeats: 12, totalSeats: 60 },
  { roomId: 2, roomName: "제2열람실", availableSeats: 5, totalSeats: 40 },
  { roomId: 3, roomName: "제3열람실", availableSeats: 20, totalSeats: 80 },
];

// 기본 현재 예약(Mock) — 연장 1회 정책
export function mockCurrentReservation() {
  return {
    reservationId: 999,
    roomId: 1,
    roomName: "제1열람실",
    seatId: 12,
    seatNumber: 12,

    startTime: "2026-02-03T10:00:00",
    endTime: "2026-02-03T14:00:00",

    extendCount: 0,
    extendLimit: EXTEND_LIMIT, //  1로 고정
    status: "ACTIVE",
  };
}

// 사용 이력(Mock) — status 대신 시간 보여줄 거라 start/end 포함
export const mockHistorySeed = [
  {
    reservationId: 101,
    date: "2026-02-01",
    roomName: "제1열람실",
    seatNumber: 7,
    startTime: "2026-02-01T09:00:00",
    endTime: "2026-02-01T12:00:00",
  },
  {
    reservationId: 102,
    date: "2026-02-02",
    roomName: "제2열람실",
    seatNumber: 3,
    startTime: "2026-02-02T13:00:00",
    endTime: "2026-02-02T15:30:00",
  },
];
