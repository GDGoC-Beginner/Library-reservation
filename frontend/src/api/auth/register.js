// src/api/auth/register.js
import apiClient from "../../lib/apiClient";

// mock
import { sleep } from "../../mocks/mockData";
import {
  setMockAuthed,
  setMockUserId,
  isMockAuthed,
  getMockUserId,
} from "../../mocks/mockStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// 로그인
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
      userId: username,
      message: "로그인 성공(Mock)",
      role: "USER",
      expiredAt: null,
      lastLoginAt: new Date().toISOString(),
    };
  }

  const res = await apiClient.post("/auth/login", { username, password });
  return res.data;
};

// 회원가입
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

    return {
      message: "회원가입 성공(Mock)",
      data: {
        userId: userData.username,
        createdAt: new Date().toISOString(),
      },
    };
  }

  const res = await apiClient.post("/api/signup", userData);
  return res.data;
};

// 아이디 중복확인
export const checkUsername = async (userId) => {
  if (USE_MOCK) {
    await sleep(150);

    const dup = new Set(["admin", "test", "test123", "pknu"]);
    const noDuplicate = !!userId && !dup.has(String(userId).toLowerCase());

    return {
      message: noDuplicate
        ? "사용 가능한 아이디예요.(Mock)"
        : "이미 사용 중인 아이디예요.(Mock)",
      noDuplicate,
      errorCode: noDuplicate ? null : "DUPLICATE_ID",
    };
  }

  const res = await apiClient.post("/auth/check", { userId });
  return res.data;
};
