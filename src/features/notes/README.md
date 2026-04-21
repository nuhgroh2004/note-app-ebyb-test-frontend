# Frontend Notes Module

## Tujuan
Modul Notes menyediakan editor dokumen/catatan dengan kemampuan create, edit, load by noteId, format teks, insert table, attachment, image, code block, dan penyimpanan ke backend.

## Teknologi dan Dependensi
- React hooks + Next App Router search params
- SweetAlert2 untuk konfirmasi save saat user menekan back
- API client notes (fetch + bearer token)
- Content disimpan sebagai JSON string terstruktur

File utama:
- src/features/notes/components/NotesWorkspace.tsx
- src/features/notes/components/NotesEditorCanvas.tsx
- src/features/notes/components/NotesRightPanel.tsx
- src/features/notes/components/NotesTopBar.tsx
- src/features/notes/lib/notesApi.ts

## Lokasi Implementasi
### Halaman
- /notes -> src/app/notes/page.tsx

### API frontend
- GET /api/notes
- POST /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id

## Kemampuan User
- Membuat note/document baru
- Membuka note dari query noteId
- Menyimpan perubahan manual (toolbar save atau Ctrl/Cmd+S)
- Konfirmasi simpan saat back jika ada perubahan belum tersimpan
- Menambah page break
- Menambah table (baris/kolom dinamis)
- Menambah block: heading, checklist, card, code, line
- Upload attachment/image ke editor (blob URL lokal browser)

## Contoh Penggunaan API Client
```ts
const created = await createNote({
  title: trimmedTitle,
  content: payloadContent,
  noteDate: getTodayNoteDate(),
  entryType: noteEntryType,
  location: 'All Docs',
});
```

## Bentuk Data Sukses (Create)
```json
{
  "message": "Note created",
  "data": {
    "id": 101,
    "title": "Project Plan",
    "content": "{\"version\":1,...}",
    "noteDate": "2026-04-21T00:00:00.000Z",
    "entryType": "document",
    "label": "Dokumen",
    "color": "blue",
    "time": "",
    "isStarred": false,
    "location": "All Docs",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

## Potongan Kode Penting
### 1) Save note (create/update)
```ts
if (resolvedNoteId) {
  await updateNote(resolvedNoteId, {
    title: trimmedTitle,
    content: payloadContent,
  });
} else {
  const created = await createNote({
    title: trimmedTitle,
    content: payloadContent,
    noteDate: getTodayNoteDate(),
    entryType: noteEntryType,
    location: 'All Docs',
  });
  syncNoteIdToUrl(created.id);
}
```

### 2) Guard saat user menekan back
```ts
if (isNoteDirtyRef.current) {
  const result = await swalWithBootstrapButtons.fire({
    title: 'Simpan perubahan?',
    showCancelButton: true,
  });

  if (result.isConfirmed) {
    await saveNoteRef.current();
  }
}
```

### 3) Request API notes dengan bearer token
```ts
const response = await fetch(endpoint, {
  method: options.method,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
});
```

## Integrasi ke Modul Lain
- Dari dashboard: /notes?source=dashboard&noteId=...
- Dari calendar untuk dokumen: /notes?source=calendar&entry=document&noteId=...
- Draft kalender disimpan sementara di sessionStorage key notes_calendar_document_draft
