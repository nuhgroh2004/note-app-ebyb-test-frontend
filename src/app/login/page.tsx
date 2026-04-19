import AuthFrame from "@/features/auth/components/AuthFrame";
import LoginUiForm from "@/features/auth/components/LoginUiForm";

export default function LoginPage() {
  return (
    <AuthFrame
      visualTitle="Masuk ke Notes App"
      visualCopy="Lanjutkan pengelolaan catatan harian, agenda tanggal, dan dashboard profile Anda."
      visualImage="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
    >
      <LoginUiForm />
    </AuthFrame>
  );
}
