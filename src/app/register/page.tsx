import AuthFrame from "@/features/auth/components/AuthFrame";
import RegisterUiForm from "@/features/auth/components/RegisterUiForm";

export default function RegisterPage() {
  return (
    <AuthFrame
      title="Welcome to Note App"
      copy="Please enter your credentials to sign up or continue with SSO."
    >
      <RegisterUiForm />
    </AuthFrame>
  );
}
