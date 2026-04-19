import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

type ProxyOptions = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  includeBody?: boolean;
};

function parseJsonText(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function proxyNotesRequest(request: Request, options: ProxyOptions) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let bodyValue: string | undefined;

  if (options.includeBody) {
    bodyValue = await request.text();
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${options.endpoint}`, {
      method: options.method,
      headers: {
        Authorization: authHeader,
        ...(options.includeBody ? { "Content-Type": "application/json" } : {}),
      },
      ...(options.includeBody ? { body: bodyValue || "{}" } : {}),
      cache: "no-store",
    });

    const rawBody = await response.text();
    const parsedBody = rawBody ? parseJsonText(rawBody) : null;

    if (parsedBody) {
      return NextResponse.json(parsedBody, { status: response.status });
    }

    return NextResponse.json(
      {
        message: response.ok ? "Success" : "Notes request failed",
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
