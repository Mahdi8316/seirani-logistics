const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * تبدیل ارقام لاتین به فارسی و جداکننده‌ی هزارگان «,» به «٬»
 * (Arabic thousands separator) — مطابق README.
 */
export function toFa(input: string | number): string {
  return String(input)
    .replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)])
    .replace(/,/g, "٬");
}

/** عددی را با جداکننده‌ی هزارگان و ارقام فارسی برمی‌گرداند. مثال: 8400 → «۸٬۴۰۰» */
export function faNumber(n: number): string {
  return toFa(n.toLocaleString("en-US"));
}

/** تاریخ ISO را به تاریخ شمسی با ارقام فارسی تبدیل می‌کند. مثال: «۲۴ مرداد ۱۴۰۴» */
export function faDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return toFa(d.toISOString().slice(0, 10));
  }
}
