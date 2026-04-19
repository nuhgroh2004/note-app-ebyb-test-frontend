import type { LoginUiState, RegisterUiState } from "./authValidators";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};

type AuthErrorItem = {
  field?: string;
  message?: string;
};

type AuthApiResponse = {
  message?: string;
  data?: AuthResult;
  errors?: AuthErrorItem[];
};

function resolveErrorMessage(payload: AuthApiResponse, fallbackMessage: string) {
  if (payload.errors && payload.errors.length > 0) {
    const firstError = payload.errors[0];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (payload.message) {
    return payload.message;
  }

  return fallbackMessage;
}

async function postAuthRequest(
  endpoint: "login" | "register",
  payload: LoginUiState | RegisterUiState
): Promise<AuthResult> {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as AuthApiResponse;

  if (!response.ok || !body.data) {
    const message = resolveErrorMessage(body, "Autentikasi gagal");
    throw new Error(message);
  }

  return body.data;
}

export function loginWithApi(payload: LoginUiState) {
  return postAuthRequest("login", payload);
}

export function registerWithApi(payload: RegisterUiState) {
  return postAuthRequest("register", payload);
}
