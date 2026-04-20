import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearAuthSession } from "@/features/auth/lib/authSession";
import DashboardIcon from "./DashboardIcons";
import type { DashboardNavItem, DashboardNavKey } from "./dashboardData";
import styles from "../styles/dashboard.module.css";

type DashboardSidebarProps = {
  userInitial: string;
  activeNavId: DashboardNavKey;
  navItems: DashboardNavItem[];
  onSelectNav: (nextNav: DashboardNavKey) => void;
};

export default function DashboardSidebar({
  userInitial,
  activeNavId,
  navItems,
  onSelectNav,
}: DashboardSidebarProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  useEffect(() => {
    const handleWindowClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  function onLogout() {
    clearAuthSession();
    setIsHeaderMenuOpen(false);
    router.replace("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeaderWrap} ref={menuRef}>
        <button
          type="button"
          className={styles.sidebarHeader}
          aria-haspopup="menu"
          aria-expanded={isHeaderMenuOpen}
          onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
        >
          <div className={styles.avatar}>{userInitial}</div>
          <span className={styles.spaceName}>My Space</span>
          <DashboardIcon name="chevron-down" className={styles.chevronIcon} />
        </button>

        <div
          role="menu"
          className={`${styles.sidebarHeaderMenu} ${
            isHeaderMenuOpen ? styles.sidebarHeaderMenuOpen : ""
          }`}
        >
          <Link
            href="/profile"
            role="menuitem"
            className={styles.sidebarHeaderMenuItem}
            onClick={() => setIsHeaderMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className={styles.sidebarHeaderMenuItem}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.newDocumentWrap}>
        <button type="button" className={styles.newDocumentButton}>
          <DashboardIcon name="grid" className={styles.navIcon} />
          <span className={styles.navLabel}>New Document</span>
        </button>
      </div>

      <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const isActive = item.id === activeNavId;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => onSelectNav(item.id)}
            >
              <DashboardIcon name={item.icon} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}