// تایپ‌های مشترک محتوا — استفاده در دیتابیس، لایه‌ی محتوا و پنل ادمین.

export type NavLink = { href: string; label: string };

export type Scene = {
  id?: number;
  no: string;
  src: string;
  kicker: string;
  title: string;
  body: string;
  sort?: number;
};

export type Service = {
  id?: number;
  no: string;
  title: string;
  body: string;
  icon?: string | null; // تصویر آیکون به‌صورت data URL (اختیاری)
  sort?: number;
};

export type NetworkNode = {
  id?: number;
  city: string;
  tag: string;
  sort?: number;
};

export type Stat = {
  id?: number;
  n: number;
  suffix: string;
  label: string;
  sort?: number;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  category: string;
  published: number; // 0 | 1
  created_at: string;
  updated_at: string;
};

export type Submission = {
  id: number;
  name: string;
  phone: string;
  service: string;
  description: string;
  created_at: string;
  read: number; // 0 | 1
};

export type AdminUser = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

/* ---- بلوک‌های متنی هر بخش (در جدول settings به‌صورت JSON ذخیره می‌شوند) ---- */

export type HeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: { num: string; label: string }[];
};

export type SectionHeader = {
  eyebrow: string;
  title: string;
  lead: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  lead: string;
  ctaText: string;
};

export type ContactInfo = {
  eyebrow: string;
  title: string;
  lead: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
};

export type SettingsMap = {
  hero: HeroContent;
  services: SectionHeader;
  network: SectionHeader;
  blog: SectionHeader;
  about: AboutContent;
  contact: ContactInfo;
};

export type SettingsKey = keyof SettingsMap;
