export const AUTH_CONSTANTS = {
    SALT_ROUNDS: 12,
    SESSION_MAX_AGE: 7 * 24 * 60 * 60,
    SESSION_DEFAULT_AGE: 24 * 60 * 60,
    PASSWORD_MIN_LENGTH: 8,
} as const;

export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: "Email atau kata sandi salah",
    USER_EXISTS: "Pengguna dengan email ini sudah terdaftar",
    USER_NOT_FOUND: "Pengguna tidak ditemukan",
    REGISTRATION_FAILED: "Gagal membuat akun. Silakan coba lagi.",
    UNKNOWN_ERROR: "Terjadi kesalahan. Silakan coba lagi.",
} as const;

export const AUTH_ROUTES = {
    SIGN_IN: "/auth",
    SIGN_UP: "/auth/sign-up",
    HOME: "/",
} as const;