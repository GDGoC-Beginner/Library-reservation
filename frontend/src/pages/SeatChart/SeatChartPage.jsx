import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SeatMap from "./SeatMap";
import { initialLayout } from "./seatLayout";
import "./SeatChartPage.css";

import { createReservation } from "@/api/reservations/createReservation";

// LocalDateTime 파싱 안전 포맷: "YYYY-MM-DDTHH:mm:ss"
const toLocalDateTime = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function SeatChartPage() {
  const navigate = useNavigate();
  const { roomId } = useParams(); // UI 표시에만 사용

  const [occupied] = useState(() => new Set([2, 9, 20, 34, 37, 42, 47, 54]));
  const [selected, setSelected] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  const seatsInfo = useMemo(
    () => ({
      isOccupied: (id) => occupied.has(id),
      isSelected: (id) => selected === id,
    }),
    [occupied, selected]
  );

  const handleSeatClick = (id) => {
    if (occupied.has(id)) return;
    setSelected((prev) => (prev === id ? null : id));
  };

  const handleReserve = async () => {
    if (!selected || isReserving) return;

    setIsReserving(true);
    try {
      const start = new Date();
      const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // ✅ 6시간

      await createReservation({
        seatId: selected, // ✅ 좌석번호 = seatId 라고 했으니 그대로
        startTime: toLocalDateTime(start),
        endTime: toLocalDateTime(end),
      });

      alert(`${selected}번이 예약되었습니다`);
      navigate("/"); // 메인으로 이동
    } catch (e) {
      const status = e.response?.status;

      if (status === 401) alert("로그인이 필요합니다.");
      else if (status === 409) alert("이미 예약된 좌석이에요.");
      else if (status === 400) alert("요청 값이 올바르지 않아요.");
      else alert("예약에 실패했어요. 잠시 후 다시 시도해주세요.");

      console.error("예약 실패:", e);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-left">
          <button className="backBtn" onClick={() => navigate(-1)}>←</button>
          <div className="titleWrap">
            <div className="title">좌석발권</div>
            <div className="subtitle">열람실 {roomId}</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="pill pill-available">사용 가능</span>
        </div>
      </header>

      <div className="content">
        <SeatMap
          layout={initialLayout}
          seatsInfo={seatsInfo}
          onSeatClick={handleSeatClick}
        />
        <div className="bottomBar">
          <div className="selection">
            선택 좌석: <b>{selected ? `${selected}번` : "없음"}</b>
          </div>
          <button
            className="reserveBtn"
            disabled={!selected || isReserving}
            onClick={handleReserve}
          >
            {isReserving ? "예약 중..." : "예약하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
