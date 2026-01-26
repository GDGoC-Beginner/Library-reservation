import React, { useMemo, useState } from "react";
import SeatMap from "./SeatMap";
import { initialLayout } from "./seatLayout";
import "./styles.css";

export default function App() {
  const [occupied] = useState(() => new Set([2, 9, 20, 34, 37, 42, 47, 54]));
  const [selected, setSelected] = useState(null);

  const seatsInfo = useMemo(() => {
    return {
      isOccupied: (id) => occupied.has(id),
      isSelected: (id) => selected === id,
    };
  }, [occupied, selected]);

  const handleSeatClick = (id) => {
    if (occupied.has(id)) return;
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-left">
          <button className="backBtn" onClick={() => alert("이전 화면으로 가시겠습니까?")}>←</button>
          <div className="titleWrap">
            <div className="title">좌석발권</div>
            <div className="subtitle">노트북 열람실 1</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="pill pill-available">사용 가능</span>
        </div>
      </header>

      <div className="content">
        <SeatMap layout={initialLayout} seatsInfo={seatsInfo} onSeatClick={handleSeatClick} />

        <div className="bottomBar">
          <div className="selection">
            선택 좌석: <b>{selected ? `${selected}번` : "없음"}</b>
          </div>
          <button className="reserveBtn" onClick={() => alert(`${selected ?? "?"}번이 예약되었습니다`)}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}