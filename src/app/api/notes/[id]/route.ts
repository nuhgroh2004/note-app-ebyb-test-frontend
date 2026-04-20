import { proxyBackendRequest } from "../../lib/proxyBackendRequest";

type NotesRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: NotesRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest({
    request,
    backendPath: `/api/notes/${encodeURIComponent(id)}`,
    method: "GET",
  });
}

export async function PUT(request: Request, context: NotesRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest({
    request,
    backendPath: `/api/notes/${encodeURIComponent(id)}`,
    method: "PUT",
  });
}

export async function DELETE(request: Request, context: NotesRouteContext) {
  const { id } = await context.params;

  return proxyBackendRequest({
    request,
    backendPath: `/api/notes/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
}
