# Frontend Notes Module

## Tujuan
Menyediakan halaman editor notes frontend bergaya Craft dengan layout tiga panel yang responsif.

## Cakupan Fitur
- Route notes baru pada /notes.
- Dashboard sidebar action New Document diarahkan ke /notes.
- Draft dokumen dari menu Calendar dashboard dapat langsung diprefill ke canvas notes.
- Layout editor lengkap: left panel, topbar editor, canvas dokumen, dan right panel insert.
- Interaksi frontend:
  - Input judul halaman realtime.
  - Switch tab kanan (Insert, Format, Style, Info).
  - Insert item block ke canvas.
  - Insert line dan page break.
  - Preview hover + insert table berdasarkan jumlah row/column.
- Responsif:
  - Desktop: 3 panel penuh.
  - Tablet: right panel jadi drawer.
  - Mobile: left panel dan right panel jadi drawer dengan backdrop.

## Struktur
- components/notesEditorData.ts
- components/NotesIcon.tsx
- components/NotesLeftPanel.tsx
- components/NotesTopBar.tsx
- components/NotesEditorCanvas.tsx
- components/NotesRightPanel.tsx
- components/NotesWorkspace.tsx
- lib/notesEditorTypes.ts
- styles/notes.module.css

## Integrasi Route
- Route: src/app/notes/page.tsx
- Entry component: src/features/notes/components/NotesWorkspace.tsx

## Integrasi Draft Calendar
- Query param yang dikenali: source=calendar, source=dashboard, dan entry=document.
- Session storage key: notes_calendar_document_draft.
- Saat draft tersedia, judul halaman notes otomatis terisi, metadata asal calendar ditambahkan ke canvas, dan konten deskripsi draft diisikan sebagai paragraf awal.

## Perilaku Entry Type
- Jika halaman notes dibuka dengan source=dashboard, mode entry default adalah document.
- Jika query entry=document dikirim, mode entry juga dipaksa ke document.
- Jika query entry=note dikirim, mode entry dipaksa ke note.
- Jika halaman notes dibuka tanpa query entry, mode default adalah document.
