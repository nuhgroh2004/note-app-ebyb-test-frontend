import type { DashboardIconName } from "./DashboardIcons";

export type DashboardNavKey =
  | "all-docs"
  | "tasks"
  | "calendar"
  | "imagine"
  | "shared";

export type DashboardNavItem = {
  id: DashboardNavKey;
  label: string;
  icon: DashboardIconName;
};

export type DashboardDocItem = {
  id: number;
  title: string;
  date: string;
  isStarred: boolean;
  location: "All Docs" | "Tasks" | "Imagine" | "Shared With Me";
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: "all-docs", label: "All Docs", icon: "book" },
  { id: "tasks", label: "Tasks", icon: "clock" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "imagine", label: "Imagine", icon: "orbit" },
  { id: "shared", label: "Shared With Me", icon: "users" },
];

export const DASHBOARD_DOCS: DashboardDocItem[] = [
  {
    id: 1,
    title: "Untitled",
    date: "Updated 2 hours ago",
    isStarred: false,
    location: "All Docs",
  },
  {
    id: 2,
    title: "Meeting Notes",
    date: "Updated yesterday",
    isStarred: false,
    location: "All Docs",
  },
  {
    id: 3,
    title: "Project Roadmap",
    date: "Updated 3 days ago",
    isStarred: false,
    location: "All Docs",
  },
  {
    id: 4,
    title: "Design Brief",
    date: "Updated last week",
    isStarred: false,
    location: "All Docs",
  },
  {
    id: 5,
    title: "Hiring Plan",
    date: "Updated last week",
    isStarred: false,
    location: "All Docs",
  },
  {
    id: 6,
    title: "Q2 Goals",
    date: "Updated 9 days ago",
    isStarred: false,
    location: "All Docs",
  },
];