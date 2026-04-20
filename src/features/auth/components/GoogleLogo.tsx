type GoogleLogoProps = {
  className?: string;
};

export default function GoogleLogo({ className }: GoogleLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.33-2.04 3.04l3.3 2.55c1.92-1.77 3.03-4.38 3.03-7.49 0-.71-.06-1.39-.18-2.04H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.73 0 5.02-.9 6.7-2.44l-3.3-2.55c-.9.6-2.04.96-3.4.96-2.61 0-4.83-1.77-5.61-4.14H2.97v2.64A10 10 0 0 0 12 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.39 13.83A6.02 6.02 0 0 1 6.08 12c0-.63.12-1.23.31-1.83V7.53H2.97A9.97 9.97 0 0 0 2 12c0 1.62.39 3.15.97 4.47l3.42-2.64z"
      />
      <path
        fill="#FBBC05"
        d="M12 6.03c1.5 0 2.85.51 3.9 1.5l2.91-2.9C17 2.99 14.72 2 12 2 8.09 2 4.73 4.24 2.97 7.53l3.42 2.64c.78-2.37 3-4.14 5.61-4.14z"
      />
    </svg>
  );
}
