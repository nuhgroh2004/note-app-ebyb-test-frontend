# Frontend Calendar Module

## Tujuan
Calendar menyediakan tampilan bulanan yang terhubung ke data notes backend untuk mengelola note/document per tanggal.

## Teknologi dan Dependensi
- React hooks + useMemo
- SweetAlert2 untuk konfirmasi delete
- Integrasi API notes (list/create/update/delete)

File utama:
- src/features/calendar/components/CalendarSection.tsx
- src/features/calendar/components/CalendarGrid.tsx
- src/features/calendar/lib/calendarData.ts
- src/features/calendar/lib/calendarUtils.ts

## Lokasi Implementasi
- Ditampilkan melalui DashboardWorkspace (nav Calendar)
- Halaman dedicated: /calendar -> src/app/calendar/page.tsx

## Fitur
- Navigasi bulan
- Load data notes per rentang bulan (startDate/endDate)
- Search item pada bulan aktif
- Tambah note
- Edit note
- Hapus note/document
- Buat document lalu redirect ke /notes dengan draft context
- Dukungan panel mobile drawer

## Contoh Request Data Bulanan
```ts
const result = await listNotes({
  page,
  limit: 100,
  startDate,
  endDate,
  search: normalizedSearch || undefined,
  sort: 'noteDateAsc',
});
```

## Potongan Kode Penting
### 1) Loop pagination bulanan
```ts
do {
  const result = await listNotes({ page, limit: 100, startDate, endDate });
  monthItems.push(...result.items);
  totalPages = Math.max(1, result.pagination.totalPages || 1);
  page += 1;
} while (page <= totalPages && page <= 100);
```

### 2) Save document lalu redirect ke notes
```ts
const createdNote = await createNote(payload);
if (createdNote.entryType === 'document') {
  saveDocumentDraftToSession(createdEntry);
  router.push(`/notes?source=calendar&entry=document&noteId=${createdEntry.id}`);
}
```

### 3) Konfirmasi delete
```ts
const confirmation = await swalWithBootstrapButtons.fire({
  title: 'Are you sure?',
  showCancelButton: true,
});

if (confirmation.isConfirmed) {
  await deleteNote(entryId);
}
```

## Integrasi dengan Notes
- Session draft key: notes_calendar_document_draft
- Query redirect: source=calendar, entry=document, noteId=<id>

## Integrasi dengan Backend
Semua CRUD item kalender menggunakan endpoint notes backend melalui proxy frontend.
