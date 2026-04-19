# Frontend Profile Module

## Tujuan
Menyediakan halaman profile dashboard untuk user yang sudah login.

## Tahap Saat Ini
Tahap ini sudah terintegrasi API:
- Profile detail dari GET /api/profile
- Dashboard stats dan upcoming notes dari GET /api/profile/dashboard
- Frontend menggunakan proxy route Next untuk menghindari isu CORS
- Mendukung refresh data dashboard dari halaman profile

## Struktur
- components/ProfileUiWorkspace.tsx
- components/ProfileOverviewPanel.tsx
- components/ProfileStatsPanel.tsx
- components/UpcomingNotesPanel.tsx
- lib/profileApi.ts
- styles/profile.module.css

## Endpoint Proxy Frontend
- GET /api/profile
- GET /api/profile/dashboard
