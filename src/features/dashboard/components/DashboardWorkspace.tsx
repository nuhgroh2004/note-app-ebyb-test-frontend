"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarSection from "@/features/calendar/components/CalendarSection";
import DashboardDocsSection from "./DashboardDocsSection";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopBar";
import {
  DASHBOARD_DOCS,
  DASHBOARD_NAV_ITEMS,
  type DashboardNavKey,
} from "./dashboardData";
import styles from "../styles/dashboard.module.css";

const DASHBOARD_ACTIVE_NAV_STORAGE_KEY = "dashboard_active_nav_v1";

function isDashboardNavKey(value: string | null): value is DashboardNavKey {
  return (
    value === "all-docs" ||
    value === "tasks" ||
    value === "calendar" ||
    value === "imagine" ||
    value === "shared"
  );
}

export default function DashboardWorkspace() {
  const [activeNavId, setActiveNavId] = useState<DashboardNavKey>(() => {
    if (typeof window === "undefined") {
      return "all-docs";
    }

    const savedNav = window.localStorage.getItem(DASHBOARD_ACTIVE_NAV_STORAGE_KEY);
    return isDashboardNavKey(savedNav) ? savedNav : "all-docs";
  });
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
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(DASHBOARD_ACTIVE_NAV_STORAGE_KEY, activeNavId);
  }, [activeNavId]);

  const docs = useMemo(() => {
    if (activeNavId !== "all-docs") {
      return [];
    }

    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return DASHBOARD_DOCS;
    }

    return DASHBOARD_DOCS.filter((doc) => {
      const normalizedDoc = `${doc.title} ${doc.date}`.toLowerCase();
      return normalizedDoc.includes(normalizedSearch);
    });
  }, [activeNavId, searchValue]);

  const searchPlaceholder =
    activeNavId === "calendar" ? "Cari catatan atau dokumen kalender" : "Open";

  const sectionTitleByNav: Record<Exclude<DashboardNavKey, "all-docs" | "calendar">, string> = {
    tasks: "Tasks",
    imagine: "Imagine",
    shared: "Shared With Me",
  };

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
            setActiveNavId(nextNav);
            setOpenMenuDocId(null);
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