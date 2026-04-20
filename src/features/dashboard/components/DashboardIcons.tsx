import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

export type DashboardIconName =
  | "grid"
  | "book"
  | "clock"
  | "calendar"
  | "orbit"
  | "users"
  | "display"
  | "download"
  | "trash"
  | "search"
  | "bell"
  | "more-vertical"
  | "chevron-down";

function SvgWrapper({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function DashboardIcon({ name, className }: { name: DashboardIconName } & IconProps) {
  switch (name) {
    case "grid":
      return (
        <SvgWrapper className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </SvgWrapper>
      );
    case "book":
      return (
        <SvgWrapper className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </SvgWrapper>
      );
    case "clock":
      return (
        <SvgWrapper className={className}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </SvgWrapper>
      );
    case "calendar":
      return (
        <SvgWrapper className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </SvgWrapper>
      );
    case "orbit":
      return (
        <SvgWrapper className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </SvgWrapper>
      );
    case "users":
      return (
        <SvgWrapper className={className}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </SvgWrapper>
      );
    case "display":
      return (
        <SvgWrapper className={className}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </SvgWrapper>
      );
    case "download":
      return (
        <SvgWrapper className={className}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </SvgWrapper>
      );
    case "trash":
      return (
        <SvgWrapper className={className}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </SvgWrapper>
      );
    case "search":
      return (
        <SvgWrapper className={className}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </SvgWrapper>
      );
    case "bell":
      return (
        <SvgWrapper className={className}>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </SvgWrapper>
      );
    case "more-vertical":
      return (
        <SvgWrapper className={className}>
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </SvgWrapper>
      );
    case "chevron-down":
      return (
        <SvgWrapper className={className}>
          <polyline points="6 9 12 15 18 9" />
        </SvgWrapper>
      );
    default:
      return null;
  }
}