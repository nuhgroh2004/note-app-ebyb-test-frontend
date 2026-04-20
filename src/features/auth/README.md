# Frontend Auth Module

## Tujuan
Menyediakan antarmuka Login dan Register untuk Notes App.

## Tahap Saat Ini
Tahap UI saat ini:
- Halaman Login tersedia di /login
- Halaman Register tersedia di /register
- UI menampilkan satu aksi autentikasi: Continue with Google
- Judul utama pada halaman auth: Welcome to Note App
- Integrasi backend OAuth Google belum diaktifkan pada endpoint API

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
