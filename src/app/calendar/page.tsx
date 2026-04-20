import { Manrope } from "next/font/google";
import DashboardWorkspace from "@/features/dashboard/components/DashboardWorkspace";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CalendarPage() {
  return (
    <div className={manrope.className}>
      <DashboardWorkspace fixedNavId="calendar" />
    </div>
  );
}
