# Frontend Auth Module

## Tujuan
Menyediakan antarmuka Login dan Register untuk Notes App.

## Tahap Saat Ini
Tahap ini adalah UI-only:
- Halaman Login tersedia di /login
- Halaman Register tersedia di /register
- Validasi form berjalan di sisi klien
- Belum terhubung ke API backend

## Komponen
- components/AuthFrame.tsx
- components/LoginUiForm.tsx
- components/RegisterUiForm.tsx
- lib/authValidators.ts
- styles/auth.module.css

## Integrasi API
Integrasi API akan ditambahkan pada tahap berikutnya dengan endpoint:
- POST /api/auth/register
- POST /api/auth/login
