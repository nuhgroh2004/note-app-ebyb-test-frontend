import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export async function proxyProfileRequest(request: Request, endpoint: string) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    const rawBody = await response.text();

    if (rawBody) {
      try {
        return NextResponse.json(JSON.parse(rawBody), { status: response.status });
      } catch {
        return NextResponse.json(
          {
            message: response.ok ? "Success" : "Profile request failed",
          },
          { status: response.status }
        );
      }
    }

    return NextResponse.json(
      {
        message: response.ok ? "Success" : "Profile request failed",
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
