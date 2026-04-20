"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardDocsSection from "./DashboardDocsSection";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopBar";
import {
  DASHBOARD_DOCS,
  DASHBOARD_NAV_ITEMS,
  type DashboardNavKey,
} from "./dashboardData";
import styles from "../styles/dashboard.module.css";

export default function DashboardWorkspace() {
  const [activeNavId, setActiveNavId] = useState<DashboardNavKey>("all-docs");
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
            onSearchValueChange={(nextValue) => {
              setSearchValue(nextValue);
              setOpenMenuDocId(null);
            }}
          />

          <DashboardDocsSection
            docs={docs}
            openMenuDocId={openMenuDocId}
            onToggleDocMenu={(docId) => {
              setOpenMenuDocId((currentDocId) => (currentDocId === docId ? null : docId));
            }}
            onCloseDocMenus={() => setOpenMenuDocId(null)}
          />
        </section>
      </section>
    </main>
  );
}