import AuthFrame from "@/features/auth/components/AuthFrame";
import LoginUiForm from "@/features/auth/components/LoginUiForm";

export default function LoginPage() {
  return (
    <AuthFrame
      title="Welcome to Note App"
      copy="Login dengan akun Google untuk melanjutkan ke workspace Anda."
    >
      <LoginUiForm />
    </AuthFrame>
  );
}
