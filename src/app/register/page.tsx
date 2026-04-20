import AuthFrame from "@/features/auth/components/AuthFrame";
import RegisterUiForm from "@/features/auth/components/RegisterUiForm";

export default function RegisterPage() {
  return (
    <AuthFrame
      title="Welcome to Note App"
      copy="Daftar dengan akun Google untuk membuat workspace baru Anda."
    >
      <RegisterUiForm />
    </AuthFrame>
  );
}
