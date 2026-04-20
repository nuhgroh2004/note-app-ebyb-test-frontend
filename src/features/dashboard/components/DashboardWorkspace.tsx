"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CalendarSection from "@/features/calendar/components/CalendarSection";
import DashboardDocsSection from "./DashboardDocsSection";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopBar";
import {
  DASHBOARD_DOCS,
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

type DashboardWorkspaceProps = {
  fixedNavId?: DashboardNavKey;
};

export default function DashboardWorkspace({ fixedNavId }: DashboardWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const storedActiveNavId = useSyncExternalStore(
    subscribeActiveNav,
    getStoredActiveNavSnapshot,
    () => "all-docs",
  );
  const activeNavId = fixedNavId ?? storedActiveNavId;
  const [docsState, setDocsState] = useState<DashboardDocItem[]>(() => DASHBOARD_DOCS.map((doc) => ({ ...doc })));
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

  const docs = useMemo(() => {
    if (activeNavId !== "all-docs") {
      return [];
    }

    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return docsState;
    }

    return docsState.filter((doc) => {
      const normalizedDoc = `${doc.title} ${doc.date} ${doc.location}`.toLowerCase();
      return normalizedDoc.includes(normalizedSearch);
    });
  }, [activeNavId, docsState, searchValue]);

  const searchPlaceholder =
    activeNavId === "calendar" ? "Cari catatan atau dokumen kalender" : "Open";

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
      docId: String(doc.id),
      title: doc.title,
    });

    window.open(`/notes?${query.toString()}`, "_blank", "noopener,noreferrer");
  }

  function toggleDocStar(docId: number) {
    setDocsState((currentDocs) =>
      currentDocs.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isStarred: !doc.isStarred,
              date: "Updated just now",
            }
          : doc,
      ),
    );
  }

  function duplicateDoc(docId: number) {
    setDocsState((currentDocs) => {
      const sourceDocIndex = currentDocs.findIndex((doc) => doc.id === docId);
      if (sourceDocIndex === -1) {
        return currentDocs;
      }

      const sourceDoc = currentDocs[sourceDocIndex];
      const nextDocId = currentDocs.reduce((highestDocId, doc) => Math.max(highestDocId, doc.id), 0) + 1;
      const duplicatedDoc: DashboardDocItem = {
        ...sourceDoc,
        id: nextDocId,
        title: `${sourceDoc.title} Copy`,
        isStarred: false,
        date: "Updated just now",
      };

      const nextDocs = [...currentDocs];
      nextDocs.splice(sourceDocIndex + 1, 0, duplicatedDoc);
      return nextDocs;
    });
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
      .then((result) => {
        if (result.isConfirmed) {
          setDocsState((currentDocs) => currentDocs.filter((doc) => doc.id !== docId));
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
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

    return (
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>{sectionTitleByNav[activeNavId]}</h1>
        <p className={styles.emptyState}>Fitur {sectionTitleByNav[activeNavId]} sedang disiapkan.</p>
      </section>
    );
  }

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.dashboardShell}>
        <DashboardSidebar
          userInitial="M"
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