import type { AuthUser } from "./authApi";

const TOKEN_KEY = "notes_app_token";
const USER_KEY = "notes_app_user";

export type SessionUser = AuthUser;

export type SessionState = {
  token: string;
  user: SessionUser;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function saveAuthSession(state: SessionState) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, state.token);
  localStorage.setItem(USER_KEY, JSON.stringify(state.user));
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function readAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function readAuthUser() {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    return null;
  }
}
