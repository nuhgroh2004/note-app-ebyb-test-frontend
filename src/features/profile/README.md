# Frontend Profile Module

## Tujuan
Menyediakan halaman profile dashboard untuk user yang sudah login.

## Tahap Saat Ini
Tahap ini adalah UI-only:
- Profile detail panel
- Stats panel (total notes dan notes bulan ini)
- Upcoming notes panel
- Belum terhubung ke endpoint profile backend

## Struktur
- components/ProfileUiWorkspace.tsx
- components/ProfileOverviewPanel.tsx
- components/ProfileStatsPanel.tsx
- components/UpcomingNotesPanel.tsx
- lib/profileUiMocks.ts
- styles/profile.module.css

## Tahap Berikutnya
Integrasi endpoint backend:
- GET /api/profile
- GET /api/profile/dashboard
