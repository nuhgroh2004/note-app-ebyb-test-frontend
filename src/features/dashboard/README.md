# Frontend Dashboard Module

## Tujuan
Dashboard adalah workspace utama setelah login untuk melihat dokumen, melakukan pencarian, membuka dokumen, duplicate, star/unstar, delete, dan berpindah ke mode Calendar.

## Teknologi dan Dependensi
- React hooks + useSyncExternalStore
- next/navigation
- SweetAlert2 (konfirmasi hapus)
- Integrasi ke notesApi

File utama:
- src/features/dashboard/components/DashboardWorkspace.tsx
- src/features/dashboard/components/DashboardSidebar.tsx
- src/features/dashboard/components/DashboardDocsSection.tsx
- src/features/dashboard/components/DashboardDocCard.tsx
- src/features/dashboard/components/dashboardData.ts

## Lokasi Implementasi
### Halaman
- /dashboard -> src/app/dashboard/page.tsx
- /calendar -> src/app/calendar/page.tsx (menggunakan DashboardWorkspace fixedNavId=calendar)

## Fitur yang Aktif
- All Docs: fetch dokumen dari backend (entryType=document)
- Search dokumen (dikirim sebagai query search ke backend)
- Open doc in new tab
- Toggle star
- Duplicate dokumen
- Delete dokumen
- Navigasi sidebar tersimpan di localStorage

## Fitur Placeholder
Section berikut sudah ada UI tetapi belum ada implementasi bisnis penuh:
- Tasks
- Imagine
- Shared With Me

## Contoh Alur Data Dokumen
```ts
const result = await listNotes({
  page: 1,
  limit: 100,
  entryType: 'document',
  search: searchValue.trim() || undefined,
  sort: 'updatedAtDesc',
});

setDocs(result.items.map(mapNoteToDashboardDocItem));
```

## Potongan Kode Penting
### 1) Persist menu aktif di localStorage
```ts
window.localStorage.setItem('dashboard_active_nav_v1', nextNav);
window.dispatchEvent(new Event('dashboard-active-nav-changed'));
```

### 2) Duplicate dokumen
```ts
const sourceNote = await getNoteById(docId);
await createNote({
  title: `${sourceNote.title} Copy`,
  content: sourceNote.content,
  noteDate: sourceNote.noteDate.slice(0, 10),
  entryType: 'document',
});
```

### 3) Redirect dari dashboard ke calendar
```ts
if (pathname === '/dashboard' && nextNav === 'calendar') {
  router.push('/calendar');
}
```

## Integrasi Modul
- Menggunakan CalendarSection saat nav active = calendar
- Menggunakan Notes API untuk CRUD dokumen dari dashboard
