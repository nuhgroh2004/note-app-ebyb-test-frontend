import { proxyNotesRequest } from "./lib/proxyNotesRequest";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  const endpoint = search ? `/api/notes${search}` : "/api/notes";

  return proxyNotesRequest(request, {
    endpoint,
    method: "GET",
  });
}

export async function POST(request: Request) {
  return proxyNotesRequest(request, {
    endpoint: "/api/notes",
    method: "POST",
    includeBody: true,
  });
}
