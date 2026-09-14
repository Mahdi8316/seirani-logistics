/**
 * پیکربندی سراسری سایت.
 *
 * ⚠️ جایگزین‌های زیر پیش از انتشار باید با اطلاعات واقعی شرکت جایگزین شوند
 * (README → "Placeholders to replace before launch"):
 *   - نام شرکت، آدرس، تلفن، ایمیل، دامنه و مبدأ مسیر.
 * نام برند فعلی از نام پوشه‌ی پروژه («seirani») استنباط شده است.
 */
export const siteConfig = {
  name: "سیرانی",
  legalName: "سیرانی",
  // شعار/توضیح کوتاه برای SEO
  tagline: "ترخیص گمرکی و بازرگانی بین‌الملل",
  description:
    "ترخیص گمرکی، بازرگانی بین‌الملل و ترانزیت زمینی؛ مهندسی‌شده برای جابه‌جایی روان بار در مسیر ایران، ترکیه و اروپا.",
  // دامنه‌ی واقعی را در متغیر محیطی NEXT_PUBLIC_SITE_URL تنظیم کنید.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ir",
  locale: "fa_IR",
  contact: {
    address: "تهران، بزرگراه … ، پلاک …",
    phoneDisplay: "+۹۸ ۲۱ ۰۰۰۰ ۰۰۰۰",
    phoneHref: "+982100000000",
    email: "info@company.ir",
  },
} as const;

export type SiteConfig = typeof siteConfig;
