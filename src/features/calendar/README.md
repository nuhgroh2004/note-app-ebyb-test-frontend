# Frontend Calendar Module

## Tujuan
Menyediakan halaman Calendar sebagai modul frontend terpisah yang tetap dirender di route /dashboard.

## Cakupan Fitur
- Tampilan kalender bulanan dengan navigasi bulan.
- Tambah item per tanggal dengan dua tipe: catatan dan dokumen.
- Tipe dokumen memiliki tampilan khusus pada kotak kalender.
- Saat dokumen dibuat, pengguna langsung diarahkan ke /notes.
- Data kalender disimpan di localStorage.
- Konfirmasi hapus item menggunakan SweetAlert2.
- Mobile: panel item tampil sebagai sidebar kanan, bisa ditutup dengan klik di luar panel.

## Struktur
- components/CalendarGrid.tsx
- components/CalendarSection.tsx
- lib/calendarData.ts
- lib/calendarUtils.ts
- styles/calendar.module.css

## Integrasi Dengan Dashboard
- Route tetap: /dashboard
- Sidebar nav dashboard mengaktifkan tampilan Calendar saat menu calendar dipilih.
- Menu aktif sidebar disimpan agar state tetap setelah refresh.

## Integrasi Dengan Notes
- Draft dokumen calendar dikirim via sessionStorage key notes_calendar_document_draft.
- Redirect dokumen: /notes?source=calendar&entry=document
