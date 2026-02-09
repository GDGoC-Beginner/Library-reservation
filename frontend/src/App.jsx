import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainPage from "@/pages/MainPage/MainPage.jsx";
import LoginPage from "@/pages/Login/LoginPage.jsx";
import RegisterPage from "@/pages/Register/RegisterPage.jsx";
import SeatChartPage from "@/pages/SeatChart/SeatChartPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms/:roomId" element={<SeatChartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
