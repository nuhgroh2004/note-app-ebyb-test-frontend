import { readAuthToken } from "@/features/auth/lib/authSession";

export type ProfileItem = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileDashboardItem = {
  profile: ProfileItem;
  stats: {
    totalNotes: number;
    notesThisMonth: number;
  };
  upcomingNotes: Array<{
    id: number;
    title: string;
    noteDate: string;
  }>;
};

type ProfileApiResponse<T> = {
  message?: string;
  data?: T;
};

function getAuthTokenOrThrow() {
  const token = readAuthToken();

  if (!token) {
    throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
  }

  return token;
}

function resolveApiErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  if ("errors" in payload && Array.isArray((payload as { errors?: unknown[] }).errors)) {
    const [firstError] = (payload as { errors?: Array<{ message?: string }> }).errors ?? [];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if ("message" in payload && typeof (payload as { message?: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }

  return fallbackMessage;
}

async function requestProfileApi<T>(endpoint: string) {
  const token = getAuthTokenOrThrow();
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ProfileApiResponse<T> | null;

  if (!response.ok || !payload?.data) {
    throw new Error(resolveApiErrorMessage(payload, "Request profile API gagal"));
  }

  return payload.data;
}

export function getProfileDetail() {
  return requestProfileApi<ProfileItem>("/api/profile");
}

export function getProfileDashboard() {
  return requestProfileApi<ProfileDashboardItem>("/api/profile/dashboard");
}
