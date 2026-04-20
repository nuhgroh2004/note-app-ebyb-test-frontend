import { proxyBackendRequest } from "../lib/proxyBackendRequest";

export async function GET(request: Request) {
  return proxyBackendRequest({
    request,
    backendPath: "/api/notes",
    method: "GET",
  });
}

export async function POST(request: Request) {
  return proxyBackendRequest({
    request,
    backendPath: "/api/notes",
    method: "POST",
  });
}
