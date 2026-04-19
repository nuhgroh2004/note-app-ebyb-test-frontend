type ProfileErrorItem = {
  field?: string;
  message?: string;
};

type ProfileApiResponse<T> = {
  message?: string;
  data?: T;
  errors?: ProfileErrorItem[];
};

export type ProfileDetail = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileDashboard = {
  profile: ProfileDetail;
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

function normalizeDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 10);
}

function parseErrorMessage(payload: ProfileApiResponse<unknown>, fallback: string) {
  if (payload.errors && payload.errors.length > 0) {
    const firstError = payload.errors[0];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (payload.message) {
    return payload.message;
  }

  return fallback;
}

async function requestProfileApi<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as ProfileApiResponse<T>;

  if (!response.ok || payload.data === undefined) {
    throw new Error(parseErrorMessage(payload, "Permintaan profile gagal"));
  }

  return payload.data;
}

export function fetchProfileDetail(token: string) {
  return requestProfileApi<ProfileDetail>("/api/profile", token).then((result) => ({
    ...result,
    createdAt: normalizeDate(result.createdAt),
    updatedAt: normalizeDate(result.updatedAt),
  }));
}

export async function fetchProfileDashboard(token: string) {
  const result = await requestProfileApi<ProfileDashboard>("/api/profile/dashboard", token);

  return {
    ...result,
    profile: {
      ...result.profile,
      createdAt: normalizeDate(result.profile.createdAt),
      updatedAt: normalizeDate(result.profile.updatedAt),
    },
    upcomingNotes: result.upcomingNotes.map((item) => ({
      ...item,
      noteDate: normalizeDate(item.noteDate),
    })),
  };
}
