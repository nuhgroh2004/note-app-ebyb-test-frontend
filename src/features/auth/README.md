# Frontend Auth Module

## Tujuan
Menyediakan antarmuka Login dan Register untuk Notes App.

## Tahap Saat Ini
Tahap ini sudah terintegrasi API:
- Halaman Login tersedia di /login
- Halaman Register tersedia di /register
- Validasi form berjalan di sisi klien
- Login/Register memanggil API backend melalui Next Route Handler
- Token dan data user disimpan di localStorage
- Redirect ke halaman /notes setelah autentikasi berhasil

## Komponen
- components/AuthFrame.tsx
- components/LoginUiForm.tsx
- components/RegisterUiForm.tsx
- lib/authValidators.ts
- lib/authApi.ts
- lib/authSession.ts
- styles/auth.module.css

## Endpoint Auth yang Digunakan
- POST /api/auth/register
- POST /api/auth/login

## Konfigurasi Environment
Tambahkan file .env.local di root frontend:

```env
BACKEND_API_URL=http://localhost:3000
```
