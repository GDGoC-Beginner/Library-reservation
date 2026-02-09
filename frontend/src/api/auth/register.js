// src/api/auth/register.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep } from "../../mocks/mockData";
import { setMockAuthed, setMockUserId } from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// 로그인: POST /auth/login  (백엔드: {message:"로그인 성공"} 형태로 Map 반환)
export const login = async (username, password) => {
  if (USE_MOCK) {
    await sleep(200);

    if (!username || !password) {
      const err = new Error("Bad Request");
      err.response = {
        status: 400,
        data: { message: "아이디/비밀번호를 입력해 주세요." },
      };
      throw err;
    }

    setMockAuthed(true);
    setMockUserId(username);

    return {
      message: "로그인 성공(Mock)",
    };
  }

  const res = await apiClient.post("/auth/login", { username, password });
  return res.data; // { message: "로그인 성공" }
};

// 회원가입: POST /auth/register  (백엔드: String "회원가입 성공" 반환)
export const register = async (userData) => {
  if (USE_MOCK) {
    await sleep(200);

    if (!userData?.username || !userData?.password || !userData?.name) {
      const err = new Error("Bad Request");
      err.response = {
        status: 400,
        data: { message: "필수값(아이디/비밀번호/이름)을 입력해 주세요." },
      };
      throw err;
    }

    return "회원가입 성공(Mock)"; // 백엔드가 String 반환이라 맞춰줌
  }

  // ✅ 백엔드 컨트롤러: @RequestMapping("/auth") + @PostMapping("/register")
  const res = await apiClient.post("/auth/register", userData);
  return res.data; // "회원가입 성공" (문자열)
};

// 아이디 중복확인: POST /auth/check  (백엔드: { available: boolean, message: string } 반환)
export const checkUsername = async (username) => {
  if (USE_MOCK) {
    await sleep(150);

    const dup = new Set(["admin", "test", "test123", "pknu"]);
    const available = !!username && !dup.has(String(username).toLowerCase());

    return {
      message: available
        ? "사용 가능한 아이디예요.(Mock)"
        : "이미 사용 중인 아이디예요.(Mock)",
      available,
    };
  }

  // ✅ 백엔드가 UsernameCheckRequest에서 request.getUsername()을 읽음
  const res = await apiClient.post("/auth/check", { username });
  return res.data; // { available: true/false, message: "..." }
};
