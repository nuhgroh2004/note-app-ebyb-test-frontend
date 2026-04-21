# Note App Frontend Documentation

## 1. Ringkasan
Frontend dibangun dengan Next.js App Router sebagai antarmuka utama untuk autentikasi, dashboard dokumen, editor notes, kalender, dan profile user.

Arsitektur frontend menggunakan pola:
- UI React component pada folder src/features
- API route internal Next.js pada src/app/api sebagai proxy ke backend
- Session token berbasis localStorage

## 2. Teknologi yang Digunakan
- Next.js 16 (App Router)
- React 19 + TypeScript 5
- CSS Modules
- Framer Motion
- Lenis
- SweetAlert2

## 3. Dependensi Project
### Runtime dependencies
- next
- react
- react-dom
- framer-motion
- lenis
- sweetalert2

### Development dependencies
- typescript
- eslint
- eslint-config-next
- tailwindcss
- @tailwindcss/postcss
- @types/node
- @types/react
- @types/react-dom

Sumber: package.json

## 4. Instalasi dan Menjalankan Frontend
### Prasyarat
- Node.js >= 20.9.0
- npm >= 9

### Langkah install
```bash
npm install
```

### Environment variable
Buat file .env.local di root frontend:
```env
BACKEND_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

### Jalankan development
```bash
npm run dev
```
Frontend berjalan di:
- http://localhost:8000

### Jalankan production mode lokal
```bash
npm run build
npm run start
```

## 5. Lokasi Implementasi Fitur
- Landing: src/app/page.tsx
- Auth pages: src/app/login/page.tsx, src/app/register/page.tsx
- Dashboard page: src/app/dashboard/page.tsx
- Calendar page: src/app/calendar/page.tsx
- Notes page: src/app/notes/page.tsx
- Profile page: src/app/profile/page.tsx

### API Proxy Layer (Next.js Route Handlers)
- Auth proxy: src/app/api/auth/lib/proxyAuthRequest.ts
- Backend proxy umum: src/app/api/lib/proxyBackendRequest.ts
- Notes API route: src/app/api/notes/route.ts, src/app/api/notes/[id]/route.ts
- Profile API route: src/app/api/profile/route.ts, src/app/api/profile/dashboard/route.ts

## 6. Dokumentasi Per Fitur
- Auth module: src/features/auth/README.md
- Notes module: src/features/notes/README.md
- Dashboard module: src/features/dashboard/README.md
- Calendar module: src/features/calendar/README.md

Catatan: Implementasi profile berada di:
- src/features/profile/components/ProfileWorkspace.tsx
- src/features/profile/lib/profileApi.ts

## 7. Alur Integrasi Frontend ke Backend
1. Komponen UI memanggil fungsi API client (contoh: listNotes, loginWithApi).
2. API client memanggil endpoint internal frontend (/api/*).
3. Route handler frontend meneruskan request ke BACKEND_API_URL.
4. Backend memproses request dan mengembalikan JSON.
5. Frontend merender state berdasarkan response.

Snippet penting alur proxy:
```ts
const configuredUrl = process.env.BACKEND_API_URL?.trim();
const parsed = new URL(configuredUrl);
const backendApiUrl = parsed.origin;
```

## 8. Troubleshooting
### Error: BACKEND_API_URL mengarah ke frontend
Penyebab:
- BACKEND_API_URL menunjuk ke domain frontend

Solusi:
- Set BACKEND_API_URL ke host backend yang berbeda
- Contoh local: http://localhost:8080
- Contoh production: https://note-app-ebyb-test-backend-production.up.railway.app

### Error: BACKEND_API_URL tidak valid
Pastikan menggunakan URL absolut lengkap, misal:
- http://localhost:8080
- https://your-backend-domain.up.railway.app

## 9. Referensi Backend
- Backend root docs: ../backend/README.md
- Backend API docs: ../backend/docs/API.md
- Backend auth docs: ../backend/src/modules/auth/README.md
- Backend notes docs: ../backend/src/modules/notes/README.md
- Backend profile docs: ../backend/src/modules/profile/README.md
