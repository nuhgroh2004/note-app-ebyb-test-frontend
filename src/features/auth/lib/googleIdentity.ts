const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const DEFAULT_GOOGLE_CLIENT_ID =
  "682901587483-492tqbud3m76gr868maeean7o46sial5.apps.googleusercontent.com";

export type GoogleCredentialResponse = {
  credential?: string;
};

export type GoogleButtonOptions = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
};

export type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
  prompt: (listener?: (notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean }) => void) => void;
  cancel?: () => void;
};

type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
};

function getGoogleAccountsId() {
  if (typeof window === "undefined") {
    return null;
  }

  const googleWindow = window as GoogleWindow;
  return googleWindow.google?.accounts?.id || null;
}

export function getGoogleClientId() {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || DEFAULT_GOOGLE_CLIENT_ID;
}

export async function ensureGoogleIdentityClient(): Promise<GoogleAccountsId> {
  const existingClient = getGoogleAccountsId();

  if (existingClient) {
    return existingClient;
  }

  await new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Identity hanya tersedia di browser"));
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Gagal memuat Google Identity script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Gagal memuat Google Identity script"));
    };

    document.head.appendChild(script);
  });

  const client = getGoogleAccountsId();

  if (!client) {
    throw new Error("Google Identity client belum tersedia");
  }

  return client;
}
