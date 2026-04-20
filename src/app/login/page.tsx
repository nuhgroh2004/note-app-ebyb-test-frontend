import AuthFrame from "@/features/auth/components/AuthFrame";
import LoginUiForm from "@/features/auth/components/LoginUiForm";

export default function LoginPage() {
  return (
    <AuthFrame
      title="Welcome to Note App"
      copy="Please enter your credentials to log in or continue with SSO."
    >
      <LoginUiForm />
    </AuthFrame>
  );
}
