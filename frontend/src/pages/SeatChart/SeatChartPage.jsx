import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SeatMap from "./SeatMap";
import { initialLayout } from "./seatLayout";
import "./SeatChartPage.css";

import { createReservation } from "@/api/reservations/createReservation";
import { getRoomSeats } from "@/api/search/getRoomSeats";

export default function SeatChartPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // 서버 좌석 데이터
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [seatNumberToId, setSeatNumberToId] = useState(new Map()); // seatNumber -> seatId
  const [occupiedNumbers, setOccupiedNumbers] = useState(new Set()); // 화면에서 막힐 seatNumber들

  // 선택은 "좌석번호" 기준으로 (UI)
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  // ✅ 좌석 상태 로드
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getRoomSeats(roomId);

        /**
         * ⚠️ 여기 응답 shape는 백엔드 RoomSeatsResponse에 맞춰 조정해야 함.
         * 예시로 seats 배열이 있다고 가정:
         * data.seats = [{ seatId, seatNumber, isAvailable }] 또는 [{ id, number, isAvailable }]
         */
        const seats = data?.seats ?? data?.items ?? [];

        const map = new Map();
        const occ = new Set();

        seats.forEach((s) => {
          const seatId = s.seatId ?? s.id;
          const seatNumber = s.seatNumber ?? s.number;

          if (seatId == null || seatNumber == null) return;

          map.set(Number(seatNumber), Number(seatId));

          // 사용중 판정: isAvailable이 "N"이면 막기 (현재 백엔드 기준)
          const isAvail = s.isAvailable ?? s.available; // "Y"/"N" 또는 boolean일 수도
          const occupied =
            isAvail === "N" || isAvail === false || s.status === "OCCUPIED";

          if (occupied) occ.add(Number(seatNumber));
        });

        setSeatNumberToId(map);
        setOccupiedNumbers(occ);

        // 선택 좌석이 이제 점유된 좌석이면 선택 해제
        setSelectedNumber((prev) => (prev && occ.has(prev) ? null : prev));
      } catch (e) {
        setLoadError("좌석 정보를 불러오지 못했어요.");
        setSeatNumberToId(new Map());
        setOccupiedNumbers(new Set());
        setSelectedNumber(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [roomId]);

  const seatsInfo = useMemo(
    () => ({
      isOccupied: (seatNumber) => occupiedNumbers.has(seatNumber),
      isSelected: (seatNumber) => selectedNumber === seatNumber,
    }),
    [occupiedNumbers, selectedNumber]
  );

  const handleSeatClick = (seatNumber) => {
    if (occupiedNumbers.has(seatNumber)) return;
    setSelectedNumber((prev) => (prev === seatNumber ? null : seatNumber));
  };

  const handleReserve = async () => {
    if (!selectedNumber || isReserving) return;

    // ✅ seatNumber -> seatId 매핑 없으면 예약 불가
    const seatId = seatNumberToId.get(selectedNumber);
    if (!seatId) {
      alert("좌석 정보를 찾지 못했어요. 새로고침 후 다시 시도해주세요.");
      return;
    }

    if (!window.confirm(`${selectedNumber}번 좌석을 예약하시겠습니까?`)) return;

    setIsReserving(true);
    try {
      /**
       * ✅ 실서비스 추천: start/endTime을 프론트가 만들지 말고
       * 백엔드에서 정책(6시간)을 적용하도록 하는 게 가장 안전함.
       *
       * 백엔드가 아직 start/endTime을 요구하면, 그때만 보내기.
       */
      await createReservation({
        seatId,
        // startTime/endTime이 서버에서 필요 없으면 제거 권장
      });

      alert(`${selectedNumber}번이 예약되었습니다`);
      navigate("/");
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
          <button className="backBtn" onClick={() => navigate(-1)}>
            ←
          </button>
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
        {loading ? (
          <div style={{ padding: 16 }}>좌석 정보를 불러오는 중...</div>
        ) : loadError ? (
          <div style={{ padding: 16 }}>{loadError}</div>
        ) : (
          <SeatMap
            layout={initialLayout}
            seatsInfo={seatsInfo}
            onSeatClick={handleSeatClick}
          />
        )}

        <div className="bottomBar">
          <div className="selection">
            선택 좌석: <b>{selectedNumber ? `${selectedNumber}번` : "없음"}</b>
          </div>
          <button
            className="reserveBtn"
            disabled={!selectedNumber || isReserving || loading || !!loadError}
            onClick={handleReserve}
          >
            {isReserving ? "예약 중..." : "예약하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
