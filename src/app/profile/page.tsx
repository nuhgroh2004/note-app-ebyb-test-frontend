import { Manrope } from "next/font/google";
import ProfileWorkspace from "@/features/profile/components/ProfileWorkspace";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProfilePage() {
  return (
    <div className={manrope.className}>
      <ProfileWorkspace />
    </div>
  );
}
