import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage.jsx";

// 임시 페이지들 (나중에 다른 팀원이 교체)
function DummyLogin() {
  return <div>로그인 페이지 (추후 구현)</div>;
}

function DummyRoom() {
  return <div>좌석 배치도 페이지 (추후 구현)</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<DummyLogin />} />
        <Route path="/rooms/:roomId" element={<DummyRoom />} />

        {/* 이상한 경로 들어오면 메인으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
