# Frontend Notes Module

## Tujuan
Menyediakan workspace notes pada halaman /notes dengan alur CRUD yang modular.

## Tahap Saat Ini
Tahap ini adalah UI-only:
- Form tambah catatan
- Form edit catatan
- Hapus catatan
- Filter catatan berdasarkan tanggal
- Semua data disimpan sementara di state lokal (belum API)

## Struktur
- components/NotesWorkspace.tsx
- components/NotesFormPanel.tsx
- components/NotesListPanel.tsx
- components/NoteCard.tsx
- lib/notesTypes.ts
- lib/mockNotes.ts
- lib/noteValidators.ts
- styles/notes.module.css

## Tahap Berikutnya
Integrasi endpoint backend:
- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id
