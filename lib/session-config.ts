// ثابت‌های نشست — بدون هیچ وابستگی Node، تا در middleware (اجرای Edge) هم قابل import باشد.
export const SESSION_COOKIE = "seirani_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // یک هفته (ثانیه)
