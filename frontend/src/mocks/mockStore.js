// src/mocks/mockStore.js

const KEY_AUTH = "mock_authed";
const KEY_USERID = "mock_userid";
const KEY_CURRENT = "mock_current_reservation";
const KEY_HISTORY = "mock_history_items";

export function isMockAuthed() {
  return localStorage.getItem(KEY_AUTH) === "true";
}
export function setMockAuthed(v) {
  localStorage.setItem(KEY_AUTH, v ? "true" : "false");
}
export function setMockUserId(userId) {
  localStorage.setItem(KEY_USERID, userId ?? "");
}
export function getMockUserId() {
  return localStorage.getItem(KEY_USERID) || "test123";
}

export function setMockCurrentReservation(currentObjOrNull) {
  if (!currentObjOrNull) {
    localStorage.removeItem(KEY_CURRENT);
    return;
  }
  localStorage.setItem(KEY_CURRENT, JSON.stringify(currentObjOrNull));
}
export function getMockCurrentReservation() {
  const raw = localStorage.getItem(KEY_CURRENT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setMockHistoryItems(items) {
  localStorage.setItem(KEY_HISTORY, JSON.stringify(items ?? []));
}
export function getMockHistoryItems() {
  const raw = localStorage.getItem(KEY_HISTORY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
export function pushMockHistoryItem(item) {
  const items = getMockHistoryItems();
  items.unshift(item); // 최신이 위로
  setMockHistoryItems(items);
}

export function clearMockSession() {
  setMockAuthed(false);
  localStorage.removeItem(KEY_USERID);
  // current/history는 유지하고 싶으면 여기서 지우지 말고,
  // 완전 초기화 원하면 아래 두 줄 주석 해제
  // localStorage.removeItem(KEY_CURRENT);
  // localStorage.removeItem(KEY_HISTORY);
}
