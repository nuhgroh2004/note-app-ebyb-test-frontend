# Frontend Auth Module

## Tujuan
Menyediakan antarmuka Login dan Register untuk Notes App.

## Tahap Saat Ini
Tahap UI saat ini:
- Halaman Login tersedia di /login
- Halaman Register tersedia di /register
- UI menampilkan dua alur autentikasi: Google dan manual (email/password)
- Judul utama pada halaman auth: Welcome to Note App
- Integrasi backend OAuth Google belum diaktifkan pada endpoint API, jadi tombol Google masih menampilkan info status

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
