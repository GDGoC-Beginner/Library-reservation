// ===== API 클라이언트 불러오기 =====
// apiClient: axios 인스턴스
// 경로: src/lib/apiClient.js
import apiClient from '../../lib/apiClient';

// 로그인 API 함수
//  - Method: POST
//  - URL: /auth/login
//  - 요청: { username, password }
//  - 응답(성공): { userId, message, role, expiredAt, lastLoginAt }
//  - 응답(실패): { message, errorCode, loginFailCount }
export const login = async (username, password) => {
  // apiClient.post(URL, 데이터)로 POST 요청
  // await: 응답이 올 때까지 기다림
  const res = await apiClient.post('/auth/login', { username, password });
  
  // res.data: 서버에서 보낸 응답 데이터
  return res.data;
};

// 회원가입 API 함수
//  - Method: POST
//  - URL: /api/register
//  - 요청: { username, email, password, name }
//  - 응답(성공): { message, data: { userId, createdAt } }
//  - 응답(실패): { message, errorCode }
//  - errorCode 종류: DUPLICATE_ID, INVALID_EMAIL, WEAK_PASSWORD
export const register = async (userData) => {
  // userData 객체 구조:
  // {
  //   username: "아이디",
  //   email: "이메일",
  //   password: "비밀번호",
  //   name: "이름"
  // }
  const res = await apiClient.post('/api/signup', userData);
  
  return res.data;
};

// 아이디 중복확인 API 함수
//  - Method: POST
//  - URL: /auth/check
//  - 요청: { userId }
//  - 응답(성공): { message, noDuplicate: true }  → 사용 가능
//  - 응답(실패): { message, noDuplicate: false, errorCode } → 중복
export const checkUsername = async (userId) => {
  // userId: 중복 확인할 아이디 문자열
  const res = await apiClient.post('/auth/check', { userId });
  
  return res.data;
};