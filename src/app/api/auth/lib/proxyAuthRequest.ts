import { NextResponse } from "next/server";

const AUTH_PROXY_TIMEOUT_MS = 10_000;

type AuthEndpoint = "login" | "register";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveBackendApiUrl(request: Request) {
  const configuredUrl = process.env.BACKEND_API_URL?.trim();

  if (configuredUrl) {
    const parsed = new URL(configuredUrl);
    return trimTrailingSlash(parsed.origin);
  }

  const requestUrl = new URL(request.url);
  const isLocalRequest =
    requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";

  if (!isLocalRequest) {
    throw new Error("BACKEND_API_URL is required for non-local environments");
  }

  const fallbackPort = requestUrl.port === "3000" ? "3001" : "3000";
  return `${requestUrl.protocol}//${requestUrl.hostname}:${fallbackPort}`;
}

function parseJsonText(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function proxyAuthRequest(request: Request, endpoint: AuthEndpoint) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  let backendApiUrl: string;

  try {
    backendApiUrl = resolveBackendApiUrl(request);
  } catch {
    return NextResponse.json(
      {
        message:
          "BACKEND_API_URL tidak valid. Gunakan URL absolut backend, contoh: http://localhost:3001",
      },
      { status: 500 }
    );
  }

  const requestOrigin = new URL(request.url).origin;

  if (backendApiUrl === requestOrigin) {
    return NextResponse.json(
      {
        message:
          "BACKEND_API_URL mengarah ke frontend. Gunakan host/port backend yang berbeda.",
      },
      { status: 500 }
    );
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), AUTH_PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(`${backendApiUrl}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: timeoutController.signal,
    });

    const rawBody = await response.text();
    const parsedBody = rawBody ? parseJsonText(rawBody) : null;

    if (parsedBody) {
      return NextResponse.json(parsedBody, { status: response.status });
    }

    return NextResponse.json(
      {
        message: response.ok ? "Success" : "Auth request failed",
      },
      { status: response.status }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          message:
            "Auth request timeout. Periksa backend service dan konfigurasi BACKEND_API_URL.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { message: "Backend service is unavailable" },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
