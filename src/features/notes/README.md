# Frontend Notes Module

## Tujuan
Menyediakan workspace notes pada halaman /notes dengan alur CRUD yang modular.

## Tahap Saat Ini
Tahap ini sudah terintegrasi API:
- Form tambah catatan terhubung POST /api/notes
- Form edit catatan terhubung PUT /api/notes/:id
- Hapus catatan terhubung DELETE /api/notes/:id
- List catatan terhubung GET /api/notes dengan pagination dan filter tanggal
- Request frontend memakai proxy route Next untuk menghindari isu CORS

## Struktur
- components/NotesWorkspace.tsx
- components/NotesFormPanel.tsx
- components/NotesListPanel.tsx
- components/NoteCard.tsx
- lib/notesTypes.ts
- lib/noteValidators.ts
- lib/notesApi.ts
- styles/notes.module.css

## Endpoint Proxy Frontend
- GET /api/notes
- POST /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id
