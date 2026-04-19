const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginUiState = {
  email: string;
  password: string;
};

export type RegisterUiState = {
  name: string;
  email: string;
  password: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateLoginUi(payload: LoginUiState): FieldErrors<keyof LoginUiState> {
  const errors: FieldErrors<keyof LoginUiState> = {};

  if (!EMAIL_REGEX.test(payload.email.trim().toLowerCase())) {
    errors.email = "Email tidak valid";
  }

  if (payload.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
  }

  return errors;
}

export function validateRegisterUi(
  payload: RegisterUiState
): FieldErrors<keyof RegisterUiState> {
  const errors: FieldErrors<keyof RegisterUiState> = {};

  if (payload.name.trim().length < 3) {
    errors.name = "Nama minimal 3 karakter";
  }

  if (!EMAIL_REGEX.test(payload.email.trim().toLowerCase())) {
    errors.email = "Email tidak valid";
  }

  if (payload.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
  }

  return errors;
}
