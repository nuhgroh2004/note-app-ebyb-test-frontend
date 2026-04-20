import type { ReactNode } from "react";
import type { NotesIconName } from "../lib/notesEditorTypes";

type NotesIconProps = {
  name: NotesIconName;
  className?: string;
};

function SvgIcon({ children, className }: { children: ReactNode; className?: string }) {
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

export default function NotesIcon({ name, className }: NotesIconProps) {
  switch (name) {
    case "doc":
      return (
        <SvgIcon className={className}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </SvgIcon>
      );
    case "list":
      return (
        <SvgIcon className={className}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </SvgIcon>
      );
    case "clock":
      return (
        <SvgIcon className={className}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </SvgIcon>
      );
    case "link":
      return (
        <SvgIcon className={className}>
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </SvgIcon>
      );
    case "search":
      return (
        <SvgIcon className={className}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </SvgIcon>
      );
    case "grid":
      return (
        <SvgIcon className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </SvgIcon>
      );
    case "image":
      return (
        <SvgIcon className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </SvgIcon>
      );
    case "code":
      return (
        <SvgIcon className={className}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </SvgIcon>
      );
    case "board":
      return (
        <SvgIcon className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </SvgIcon>
      );
    case "bell":
      return (
        <SvgIcon className={className}>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </SvgIcon>
      );
    case "info":
      return (
        <SvgIcon className={className}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </SvgIcon>
      );
    case "layout":
      return (
        <SvgIcon className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </SvgIcon>
      );
    case "share":
      return (
        <SvgIcon className={className}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 010 20" />
          <path d="M12 2a15.3 15.3 0 000 20" />
        </SvgIcon>
      );
    case "folder":
      return (
        <SvgIcon className={className}>
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </SvgIcon>
      );
    case "chevron-right":
      return (
        <SvgIcon className={className}>
          <polyline points="9 18 15 12 9 6" />
        </SvgIcon>
      );
    case "plus":
      return (
        <SvgIcon className={className}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </SvgIcon>
      );
    default:
      return null;
  }
}
