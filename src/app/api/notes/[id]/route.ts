import { proxyNotesRequest } from "../lib/proxyNotesRequest";

type NotesParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: NotesParams) {
  const { id } = await context.params;

  return proxyNotesRequest(request, {
    endpoint: `/api/notes/${id}`,
    method: "GET",
  });
}

export async function PUT(request: Request, context: NotesParams) {
  const { id } = await context.params;

  return proxyNotesRequest(request, {
    endpoint: `/api/notes/${id}`,
    method: "PUT",
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: NotesParams) {
  const { id } = await context.params;

  return proxyNotesRequest(request, {
    endpoint: `/api/notes/${id}`,
    method: "DELETE",
  });
}
