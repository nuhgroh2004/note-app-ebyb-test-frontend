import { proxyBackendRequest } from "../../lib/proxyBackendRequest";

export async function GET(request: Request) {
  return proxyBackendRequest({
    request,
    backendPath: "/api/profile/dashboard",
    method: "GET",
  });
}
