"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { readAuthToken, readAuthUser } from "@/features/auth/lib/authSession";
import CalendarSection from "@/features/calendar/components/CalendarSection";
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
  type NoteItem,
} from "@/features/notes/lib/notesApi";
import DashboardDocsSection from "./DashboardDocsSection";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopBar";
import {
  DASHBOARD_NAV_ITEMS,
  type DashboardDocItem,
  type DashboardNavKey,
} from "./dashboardData";
import styles from "../styles/dashboard.module.css";

const DASHBOARD_ACTIVE_NAV_STORAGE_KEY = "dashboard_active_nav_v1";
const DASHBOARD_ACTIVE_NAV_EVENT = "dashboard-active-nav-changed";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

function isDashboardNavKey(value: string | null): value is DashboardNavKey {
  return (
    value === "all-docs" ||
    value === "tasks" ||
    value === "calendar" ||
    value === "imagine" ||
    value === "shared"
  );
}

function getStoredActiveNavSnapshot(): DashboardNavKey {
  if (typeof window === "undefined") {
    return "all-docs";
  }

  const savedNav = window.localStorage.getItem(DASHBOARD_ACTIVE_NAV_STORAGE_KEY);
  return isDashboardNavKey(savedNav) ? savedNav : "all-docs";
}

function subscribeActiveNav(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== DASHBOARD_ACTIVE_NAV_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  };

  const onCustomEvent = () => {
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(DASHBOARD_ACTIVE_NAV_EVENT, onCustomEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(DASHBOARD_ACTIVE_NAV_EVENT, onCustomEvent);
  };
}

function persistActiveNav(nextNav: DashboardNavKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DASHBOARD_ACTIVE_NAV_STORAGE_KEY, nextNav);
  window.dispatchEvent(new Event(DASHBOARD_ACTIVE_NAV_EVENT));
}

function formatDashboardUpdatedLabel(updatedAtIso: string) {
  const updatedAt = new Date(updatedAtIso);

  if (Number.isNaN(updatedAt.getTime())) {
    return "Updated just now";
  }

  const diffMs = Date.now() - updatedAt.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Updated just now";
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Updated ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function mapNoteToDashboardDocItem(note: NoteItem): DashboardDocItem {
  return {
    id: note.id,
    title: note.title,
    date: formatDashboardUpdatedLabel(note.updatedAt),
    isStarred: note.isStarred,
    location: note.location || "All Docs",
  };
}

type DashboardWorkspaceProps = {
  fixedNavId?: DashboardNavKey;
};

export default function DashboardWorkspace({ fixedNavId }: DashboardWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const storedActiveNavId = useSyncExternalStore<DashboardNavKey>(
    subscribeActiveNav,
    getStoredActiveNavSnapshot,
    (): DashboardNavKey => "all-docs",
  );
  const activeNavId = fixedNavId ?? storedActiveNavId;
  const [userInitial, setUserInitial] = useState("M");
  const [docs, setDocs] = useState<DashboardDocItem[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const [docsErrorMessage, setDocsErrorMessage] = useState("");
  const [docsReloadKey, setDocsReloadKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [openMenuDocId, setOpenMenuDocId] = useState<number | null>(null);

  useEffect(() => {
    const handleWindowClick = () => {
      setOpenMenuDocId(null);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  useEffect(() => {
    const token = readAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const user = readAuthUser();
    const initial = user?.name?.trim().charAt(0).toUpperCase();

    if (initial) {
      setUserInitial(initial);
    }
  }, [router]);

  useEffect(() => {
    if (!fixedNavId) {
      return;
    }

    persistActiveNav(fixedNavId);
  }, [fixedNavId]);

  useEffect(() => {
    if (pathname !== "/dashboard") {
      return;
    }

    if (activeNavId === "calendar") {
      router.replace("/calendar");
    }
  }, [activeNavId, pathname, router]);

  useEffect(() => {
    if (activeNavId !== "all-docs") {
      return;
    }

    let isCancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setIsDocsLoading(true);
      setDocsErrorMessage("");

      try {
        const result = await listNotes({
          page: 1,
          limit: 100,
          entryType: "document",
          search: searchValue.trim() || undefined,
          sort: "updatedAtDesc",
        });

        if (isCancelled) {
          return;
        }

        setDocs(result.items.map(mapNoteToDashboardDocItem));
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Gagal memuat dokumen dari server.";
        setDocsErrorMessage(message);
        setDocs([]);
      } finally {
        if (!isCancelled) {
          setIsDocsLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [activeNavId, searchValue, docsReloadKey]);

  const searchPlaceholder =
    activeNavId === "calendar" ? "Cari catatan atau dokumen kalender" : "Cari dokumen";

  const sectionTitleByNav: Record<Exclude<DashboardNavKey, "all-docs" | "calendar">, string> = {
    tasks: "Tasks",
    imagine: "Imagine",
    shared: "Shared With Me",
  };

  function openDocInNewTab(doc: DashboardDocItem) {
    if (typeof window === "undefined") {
      return;
    }

    const query = new URLSearchParams({
      source: "dashboard",
      noteId: String(doc.id),
    });

    window.open(`/notes?${query.toString()}`, "_blank", "noopener,noreferrer");
  }

  async function toggleDocStar(docId: number) {
    const currentDoc = docs.find((doc) => doc.id === docId);

    if (!currentDoc) {
      return;
    }

    try {
      const updated = await updateNote(docId, {
        isStarred: !currentDoc.isStarred,
      });

      setDocs((currentDocs) =>
        currentDocs.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                isStarred: updated.isStarred,
                date: formatDashboardUpdatedLabel(updated.updatedAt),
              }
            : doc,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengubah status bintang dokumen.";
      setDocsErrorMessage(message);
    }
  }

  async function duplicateDoc(docId: number) {
    try {
      const sourceNote = await getNoteById(docId);

      await createNote({
        title: `${sourceNote.title} Copy`,
        content: sourceNote.content,
        noteDate: sourceNote.noteDate.slice(0, 10),
        entryType: "document",
        label: sourceNote.label || "Dokumen",
        color: sourceNote.color || "blue",
        time: sourceNote.time || "",
        isStarred: false,
        location: sourceNote.location || "All Docs",
      });

      setDocsReloadKey((current) => current + 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menduplikasi dokumen.";
      setDocsErrorMessage(message);
    }
  }

  function deleteDoc(docId: number) {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteNote(docId);
            setDocs((currentDocs) => currentDocs.filter((doc) => doc.id !== docId));
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Gagal menghapus dokumen.";
            setDocsErrorMessage(message);
            return;
          }

          await swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          await swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });
  }

  function renderActiveSection() {
    if (activeNavId === "all-docs") {
      return (
        <DashboardDocsSection
          docs={docs}
          isLoading={isDocsLoading}
          errorMessage={docsErrorMessage}
          openMenuDocId={openMenuDocId}
          onToggleDocMenu={(docId) => {
            setOpenMenuDocId((currentDocId) => (currentDocId === docId ? null : docId));
          }}
          onCloseDocMenus={() => setOpenMenuDocId(null)}
          onOpenInNewTab={openDocInNewTab}
          onToggleStar={toggleDocStar}
          onDuplicate={duplicateDoc}
          onDelete={deleteDoc}
        />
      );
    }

    if (activeNavId === "calendar") {
      return <CalendarSection searchValue={searchValue} />;
    }

    const sectionKey = activeNavId as keyof typeof sectionTitleByNav;
    const sectionTitle = sectionTitleByNav[sectionKey] || "Workspace";

    return (
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>{sectionTitle}</h1>
        <p className={styles.emptyState}>Fitur {sectionTitle} sedang disiapkan.</p>
      </section>
    );
  }

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.dashboardShell}>
        <DashboardSidebar
          userInitial={userInitial}
          activeNavId={activeNavId}
          navItems={DASHBOARD_NAV_ITEMS}
          onSelectNav={(nextNav) => {
            persistActiveNav(nextNav);
            setOpenMenuDocId(null);

            if (pathname === "/dashboard" && nextNav === "calendar") {
              router.push("/calendar");
              return;
            }

            if (pathname === "/calendar" && nextNav !== "calendar") {
              router.push("/dashboard");
            }
          }}
        />

        <section className={styles.mainPane}>
          <DashboardTopbar
            searchValue={searchValue}
            searchPlaceholder={searchPlaceholder}
            onSearchValueChange={(nextValue) => {
              setSearchValue(nextValue);
              setOpenMenuDocId(null);
            }}
          />

          {renderActiveSection()}
        </section>
      </section>
    </main>
  );
}