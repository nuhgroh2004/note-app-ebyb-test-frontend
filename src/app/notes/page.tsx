import { Suspense } from "react";
import { Manrope } from "next/font/google";
import NotesWorkspace from "@/features/notes/components/NotesWorkspace";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function NotesPage() {
  return (
    <div className={manrope.className}>
      <Suspense fallback={null}>
        <NotesWorkspace />
      </Suspense>
    </div>
  );
}
