import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

type AuthEndpoint = "login" | "register";

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

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
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
  } catch {
    return NextResponse.json(
      { message: "Backend service is unavailable" },
      { status: 503 }
    );
  }
}
