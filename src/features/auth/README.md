# Frontend Auth Module

## Tujuan
Modul ini menangani alur autentikasi user dari sisi frontend:
- Login email/password
- Register email/password
- Login dengan Google Identity Services
- Simpan session token dan user profile di localStorage

## Teknologi dan Dependensi
- React hooks (useState, useEffect, useCallback)
- next/navigation untuk redirect
- Google Identity Services script
- Fetch API ke route internal frontend

File utama:
- src/features/auth/components/LoginUiForm.tsx
- src/features/auth/components/RegisterUiForm.tsx
- src/features/auth/lib/authApi.ts
- src/features/auth/lib/authSession.ts
- src/features/auth/lib/authValidators.ts
- src/features/auth/lib/googleIdentity.ts

## Lokasi Implementasi
### Halaman
- /login -> src/app/login/page.tsx
- /register -> src/app/register/page.tsx

### Endpoint frontend (proxy)
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/google

Route handlers:
- src/app/api/auth/login/route.ts
- src/app/api/auth/register/route.ts
- src/app/api/auth/google/route.ts
- src/app/api/auth/lib/proxyAuthRequest.ts

## Konfigurasi Environment
```env
BACKEND_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=682901587483-492tqbud3m76gr868maeean7o46sial5.apps.googleusercontent.com
```

## Alur Kerja
1. User submit form login/register.
2. Form divalidasi di authValidators.
3. authApi mengirim POST ke route internal frontend.
4. Route proxy meneruskan ke backend /api/auth/*.
5. Jika sukses, token + user disimpan lewat saveAuthSession.
6. User diarahkan ke /dashboard.

## Contoh Penggunaan API di Frontend
```ts
const result = await loginWithApi({
  email: form.email.trim().toLowerCase(),
  password: form.password,
});

saveAuthSession(result);
router.push('/dashboard');
```

## Bentuk Data Sukses
Backend mengembalikan data:
```json
{
  "message": "Login success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "User Test",
      "email": "user@test.com",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Potongan Kode Penting
### 1) Wrapper request autentikasi
```ts
async function postAuthRequest(endpoint, payload) {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok || !body.data) {
    throw new Error(resolveErrorMessage(body, 'Autentikasi gagal'));
  }

  return body.data;
}
```

### 2) Simpan session auth
```ts
export function saveAuthSession(state) {
  localStorage.setItem('notes_app_token', state.token);
  localStorage.setItem('notes_app_user', JSON.stringify(state.user));
}
```

### 3) Inisialisasi Google Identity
```ts
client.initialize({
  client_id: getGoogleClientId(),
  callback: (response) => {
    void onGoogleCredential(response);
  },
});
```

## Catatan Implementasi
- Error backend ditampilkan sebagai pesan status di form.
- Google login fallback ke default client id jika env public tidak diisi.
- Session disimpan di localStorage, jadi fitur ini berjalan di client side.
