import AuthFrame from "@/features/auth/components/AuthFrame";
import RegisterUiForm from "@/features/auth/components/RegisterUiForm";

export default function RegisterPage() {
  return (
    <AuthFrame
      visualTitle="Buat Akun Baru"
      visualCopy="Daftar untuk mulai memakai fitur autentikasi, CRUD catatan, kalender catatan, dan profile dashboard."
      visualImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
    >
      <RegisterUiForm />
    </AuthFrame>
  );
}
