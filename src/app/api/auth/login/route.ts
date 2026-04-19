import { proxyAuthRequest } from "../lib/proxyAuthRequest";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "login");
}
