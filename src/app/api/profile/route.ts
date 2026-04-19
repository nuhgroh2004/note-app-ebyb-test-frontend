import { proxyProfileRequest } from "./lib/proxyProfileRequest";

export async function GET(request: Request) {
  return proxyProfileRequest(request, "/api/profile");
}
