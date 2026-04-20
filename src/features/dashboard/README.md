# Frontend Dashboard Module

## Tujuan
Menyediakan halaman dashboard frontend dengan tampilan bergaya Craft docs, dengan struktur komponen modular.

## Cakupan Fitur
- Sidebar statis (fixed) tanpa scroll.
- Topbar dengan search bar yang lebih besar dan border tegas.
- Satu ikon notifikasi (bell) pada sisi kanan topbar.
- Grid dokumen dengan context menu per kartu.
- Efek bayangan border pada area body kartu dokumen.

## Struktur
- components/dashboardData.ts
- components/DashboardIcons.tsx
- components/DashboardSidebar.tsx
- components/DashboardTopBar.tsx
- components/DashboardDocCard.tsx
- components/DashboardDocsSection.tsx
- components/DashboardWorkspace.tsx
- styles/dashboard.module.css

## Integrasi Route
- Route dashboard: /dashboard
- Entry file route: src/app/dashboard/page.tsx

## Catatan Implementasi
- Data dokumen masih static untuk kebutuhan tampilan frontend.
- Search bekerja secara client-side pada daftar dokumen static.