import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MainPage.css";

// auth
import { logout } from "@/api/auth/logout";

// reservations
import { getMyReservation } from "@/api/reservations/getMyReservation";
import { cancelReservation } from "@/api/reservations/cancelReservation";
import { extendReservation } from "@/api/reservations/extendReservation";
import { getHistory } from "@/api/reservations/getHistory";

// search
import { getReadingRooms } from "@/api/search/getReadingRooms";

// utils
import { formatTimeRange } from "@/lib/time";

export default function MainPage() {
  const navigate = useNavigate();

  // ✅ 연장 정책: 무조건 1회 고정
  const EXTEND_LIMIT = 1;

  // ===== 상태 =====
  const [isAuthed, setIsAuthed] = useState(false);
  const [me, setMe] = useState(null);
  const [current, setCurrent] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // ===== API =====
  const fetchMe = async () => {
    try {
      setMeLoading(true);
      const data = await getMyReservation();
      setIsAuthed(true);
      setMe({ userId: data.userId, name: data.name });
      setCurrent(data.currentReservation ?? null);
    } catch (err) {
      if (err?.response?.status === 401) {
        setIsAuthed(false);
        setMe(null);
        setCurrent(null);
      }
    } finally {
      setMeLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      setRoomsError("");
      const data = await getReadingRooms();
      setRooms(data.rooms ?? []);
    } catch (err) {
      const s = err?.response?.status;
      if (s === 401 || s === 403) {
        setRoomsError("열람실 정보는 로그인 후 확인할 수 있어요.");
      } else {
        setRoomsError("열람실 정보를 불러오지 못했어요.");
      }
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const data = await getHistory();

      // ✅ 서버가 배열(List)로 주는 경우와 { items: [] } 둘 다 대응
      const items = Array.isArray(data) ? data : (data?.items ?? []);

      setHistory(items);
    } catch (err) {
      if (err?.response?.status === 401) {
        setHistoryError("사용 이력은 로그인 후 확인할 수 있어요.");
      } else {
        setHistoryError("사용 이력을 불러오지 못했어요.");
      }
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };


  useEffect(() => {
    fetchMe();
    fetchRooms();
    fetchHistory();
  }, []);

  // ===== 계산값 =====
  const timeText = useMemo(() => {
    if (!current) return "-";
    return formatTimeRange(current.startTime, current.endTime);
  }, [current]);

  const canReturn = !!current && current.status === "ACTIVE";

  // ✅ 연장 가능 조건: 최대 1회로 강제
  const canExtend =
    !!current &&
    current.status === "ACTIVE" &&
    (current.extendCount ?? 0) < EXTEND_LIMIT;

  // ===== handlers =====
  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthed(false);
      setMe(null);
      setCurrent(null);
      setHistory([]);
    } catch {
      alert("로그아웃에 실패했습니다.");
    }
  };

  const handleReturn = async () => {
    if (!current?.reservationId) return;
    if (!window.confirm("좌석을 반납할까요?")) return;

    try {
      await cancelReservation(current.reservationId);
      await fetchMe();
      await fetchHistory();
    } catch {
      alert("좌석 반납에 실패했습니다.");
    }
  };

  const handleExtend = async () => {
    if (!current?.reservationId) return;

    // ✅ 연장 확인창 추가
    if (!window.confirm("좌석을 연장하시겠습니까?")) return;

    try {
      await extendReservation(current.reservationId);
      await fetchMe(); // 연장 후 현재 예약 갱신
    } catch {
      alert("연장에 실패했습니다.");
    }
  };

  // ===== render =====
  return (
    <div className="mp-root">
      {/* 헤더 */}
      <header className="mp-header">
        <div className="mp-headerInner">
          <div className="mp-logoText">도서관 Logo</div>
        </div>
      </header>

      {/* 본문 */}
      <main className="mp-container">
        {/* 1) 나의 예약 */}
        <section className="mp-section">
          <div className="mp-sectionTitle">
            <span className="mp-icon">📖</span>
            <span>나의 예약</span>
          </div>

          <div className="mp-card mp-reserveCard">
            {meLoading ? (
              <div className="mp-muted">불러오는 중...</div>
            ) : !isAuthed ? (
              <div className="mp-reserveGrid mp-reserveGrid--loggedOut">
                <div className="mp-reserveLeft">
                  <button
                    className="mp-btn mp-btnPrimary"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </button>
                </div>

                <div className="mp-reserveInfo">
                  <div className="mp-infoRow">
                    <span className="mp-infoLabel">열람실</span>
                    <span className="mp-infoValue">-</span>
                  </div>
                  <div className="mp-infoRow">
                    <span className="mp-infoLabel">좌석번호</span>
                    <span className="mp-infoValue">-</span>
                  </div>
                  <div className="mp-infoRow">
                    <span className="mp-infoLabel">사용시간</span>
                    <span className="mp-infoValue">-</span>
                  </div>
                  <div className="mp-infoRow">
                    <span className="mp-infoLabel">연장횟수</span>
                    <span className="mp-infoValue">-</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 상단: 사용자 / 로그아웃 */}
                <div className="mp-userBar">
                  <div className="mp-userText">
                    <span className="mp-userName">{me?.name}</span>
                    <span className="mp-userId">{me?.userId}</span>
                  </div>

                  <button className="mp-btn mp-btnGhost" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>

                {/* 내용: 예약 정보 */}
                <div className="mp-reserveGrid mp-reserveGrid--loggedIn">
                  <div className="mp-reserveInfo">
                    <div className="mp-infoRow">
                      <span className="mp-infoLabel">열람실</span>
                      <span className="mp-infoValue">
                        {current?.roomName ?? "-"}
                      </span>
                    </div>

                    <div className="mp-infoRow">
                      <span className="mp-infoLabel">좌석번호</span>
                      <span className="mp-infoValue">
                        {current?.seatNumber ?? "-"}
                      </span>

                      <button
                        className="mp-btn mp-btnSecondary mp-inlineBtn"
                        disabled={!canReturn}
                        onClick={handleReturn}
                        title={!canReturn ? "예약이 있을 때만 반납 가능" : ""}
                      >
                        반납
                      </button>
                    </div>

                    <div className="mp-infoRow">
                      <span className="mp-infoLabel">사용시간</span>
                      <span className="mp-infoValue">
                        {current ? timeText : "-"}
                      </span>
                    </div>

                    <div className="mp-infoRow">
                      <span className="mp-infoLabel">연장횟수</span>
                      <span className="mp-infoValue">
                        {current
                          ? `${current.extendCount ?? 0} / ${EXTEND_LIMIT}`
                          : "-"}
                      </span>

                      <button
                        className="mp-btn mp-btnSecondary mp-inlineBtn"
                        disabled={!canExtend}
                        onClick={handleExtend}
                        title={!canExtend ? "연장은 최대 1번만 가능해요." : ""}
                      >
                        연장
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 2) 좌석 예약 */}
        <section className="mp-section">
          <div className="mp-sectionTitle">
            <span className="mp-icon">✏️</span>
            <span>좌석 예약</span>
          </div>

          {roomsLoading ? (
            <div className="mp-card">
              <div className="mp-muted">불러오는 중...</div>
            </div>
          ) : roomsError ? (
            <div className="mp-card">
              <div className="mp-muted">{roomsError}</div>
            </div>
          ) : (
            <div className="mp-roomRow" aria-label="열람실 선택">
              {/* ✅ 제1열람실만 표시 (roomId=1 기준) */}
              {rooms
                .filter((r) => r.roomId === 1)
                .map((r) => (
                  <button
                    key={r.roomId}
                    className="mp-roomCard"
                    onClick={() => navigate(`/rooms/${r.roomId}`)}
                  >
                    <div className="mp-roomName">{r.roomName}</div>
                    <div className="mp-roomMeta">
                      사용 가능 {r.availableSeats} / {r.totalSeats}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>

        {/* 3) 사용 이력 */}
        <section className="mp-section mp-sectionLast">
          <div className="mp-sectionTitle">
            <span className="mp-icon">🧾</span>
            <span>사용 이력</span>
          </div>

          <div className="mp-card">
            {!isAuthed ? (
              <div className="mp-muted">먼저 로그인을 해 주세요</div>
            ) : historyLoading ? (
              <div className="mp-muted">불러오는 중...</div>
            ) : historyError ? (
              <div className="mp-muted">{historyError}</div>
            ) : history.length === 0 ? (
              <div className="mp-muted">사용 이력이 없어요.</div>
            ) : (
              <div className="mp-historyList">
                {[...history]
                  .sort((a, b) => {
                    const ta = new Date(a.createdAt ?? 0).getTime();
                    const tb = new Date(b.createdAt ?? 0).getTime();
                    return tb - ta; // 최신이 위로
                  })
                  .map((h) => {
                    const dateText = h.useDate
                      ? String(h.useDate).replaceAll("-", ". ")
                      : "-";

                    // "사용 시간"은 서버가 start/end를 안 주므로 일단 createdAt 시각만 표시
                    const timeText = h.createdAt
                      ? (() => {
                        const d = new Date(h.createdAt);
                        const hh = String(d.getHours()).padStart(2, "0");
                        const mm = String(d.getMinutes()).padStart(2, "0");
                        return `${hh}:${mm}`;
                      })()
                      : "-";

                    // 좌석 "번호"가 따로 없어서 일단 seatId를 번호처럼 표시 (백엔드 수정되면 교체)
                    const seatNumberText = h.seatNumber ?? h.seatId ?? "-";

                    return (
                      <div key={h.historyId ?? h.reservationId} className="mp-historyItem">
                        <div className="mp-historyLeft">
                          <div className="mp-historyDate">{dateText}</div>

                          <div className="mp-historyRoom">발권 시간: {timeText}</div>
                        </div>

                        <div className="mp-historySeat">좌석 번호: {seatNumberText}</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
