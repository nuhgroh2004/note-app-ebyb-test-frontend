import { NextResponse } from "next/server";

const BACKEND_PROXY_TIMEOUT_MS = 10_000;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveBackendApiUrl(request: Request) {
  const configuredUrl = process.env.BACKEND_API_URL?.trim();

  if (configuredUrl) {
    try {
      const parsed = new URL(configuredUrl);
      return trimTrailingSlash(parsed.origin);
    } catch {
      throw new Error(
        "BACKEND_API_URL tidak valid. Gunakan URL absolut backend, contoh: http://localhost:8080"
      );
    }
  }

  const requestUrl = new URL(request.url);
  const isLocalRequest =
    requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";

  if (!isLocalRequest) {
    throw new Error(
      "BACKEND_API_URL belum dikonfigurasi. Silakan atur di environment variable (Railway Dashboard)."
    );
  }

  return `${requestUrl.protocol}//${requestUrl.hostname}:8080`;
}

function parseJsonText(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

type ProxyBackendRequestOptions = {
  request: Request;
  backendPath: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

export async function proxyBackendRequest({
  request,
  backendPath,
  method,
}: ProxyBackendRequestOptions) {
  let backendApiUrl: string;

  try {
    backendApiUrl = resolveBackendApiUrl(request);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Konfigurasi backend tidak tersedia",
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
      { status: 500 },
    );
  }

  const requestUrl = new URL(request.url);
  const targetUrl = `${backendApiUrl}${backendPath}${requestUrl.search}`;

  const headers = new Headers();
  const authorization = request.headers.get("authorization");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  let body: string | undefined;

  if (method !== "GET" && method !== "DELETE") {
    body = await request.text();

    if (body) {
      headers.set("Content-Type", "application/json");
    }
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), BACKEND_PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
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
        message: response.ok ? "Success" : "Backend request failed",
      },
      { status: response.status },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          message: "Request timeout. Periksa backend service dan konfigurasi BACKEND_API_URL.",
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { message: "Backend service is unavailable" },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
