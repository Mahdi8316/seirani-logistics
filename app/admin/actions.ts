"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  requireAdmin,
  verifyCredentials,
  setSession,
  clearSession,
} from "@/lib/auth";
import {
  saveSetting,
  replaceServices,
  replaceStats,
  replaceScenes,
  replaceNodes,
  createPost,
  updatePost,
  deletePost,
  slugExists,
  markSubmissionRead,
  deleteSubmission,
} from "@/lib/content";
import type {
  Service,
  Stat,
  Scene,
  NetworkNode,
  HeroContent,
  SectionHeader,
  AboutContent,
  ContactInfo,
} from "@/lib/types";

/* --------------------------------- کمکی‌ها --------------------------------- */

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function sanitizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/blog");
}

/* ---------------------------------- ورود ---------------------------------- */

export type LoginState = { error: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = str(formData, "username");
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { error: "نام‌کاربری و رمز عبور را وارد کنید." };
  }
  const user = verifyCredentials(username, password);
  if (!user) {
    return { error: "نام‌کاربری یا رمز عبور نادرست است." };
  }
  await setSession(user);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}

/* --------------------------------- مقالات --------------------------------- */

export type PostState = { error: string } | null;

export async function savePost(
  _prev: PostState,
  formData: FormData
): Promise<PostState> {
  await requireAdmin();

  const idRaw = str(formData, "id");
  const id = idRaw ? Number(idRaw) : null;

  const title = str(formData, "title");
  const excerpt = str(formData, "excerpt");
  const body = String(formData.get("body") ?? "").trim();
  const category = str(formData, "category");
  const coverRaw = str(formData, "cover");
  const cover = coverRaw || null;
  const published = formData.get("published") ? 1 : 0;

  if (!title) return { error: "عنوان مقاله الزامی است." };

  let slug = sanitizeSlug(str(formData, "slug") || title);
  if (!slug) slug = `post-${Date.now()}`;
  if (slugExists(slug, id ?? undefined)) {
    return { error: "این نامک (slug) قبلاً استفاده شده است." };
  }

  const input = { slug, title, excerpt, body, cover, category, published };
  if (id) updatePost(id, input);
  else createPost(input);

  revalidateSite();
  redirect("/admin/posts");
}

export async function removePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  if (id) deletePost(id);
  revalidateSite();
  revalidatePath("/admin/posts");
}

/* ------------------------------ خدمات و آمار ------------------------------ */

export async function saveServices(
  items: Pick<Service, "no" | "title" | "body" | "icon">[]
): Promise<void> {
  await requireAdmin();
  replaceServices(
    items.map((s) => ({
      no: s.no,
      title: s.title,
      body: s.body,
      icon: s.icon ?? null,
    }))
  );
  revalidateSite();
  revalidatePath("/admin/services");
}

export async function saveStats(
  items: Pick<Stat, "n" | "suffix" | "label">[]
): Promise<void> {
  await requireAdmin();
  replaceStats(
    items.map((s) => ({ n: Number(s.n) || 0, suffix: s.suffix, label: s.label }))
  );
  revalidateSite();
  revalidatePath("/admin/services");
}

/* ------------------------- صحنه‌های مسیر و گره‌ها ------------------------- */

export async function saveScenes(
  items: Pick<Scene, "no" | "kicker" | "title" | "body" | "src">[]
): Promise<void> {
  await requireAdmin();
  replaceScenes(
    items.map((s) => ({
      no: s.no,
      kicker: s.kicker,
      title: s.title,
      body: s.body,
      src: s.src,
    }))
  );
  revalidateSite();
  revalidatePath("/admin/content");
}

export async function saveNodes(
  items: Pick<NetworkNode, "city" | "tag">[]
): Promise<void> {
  await requireAdmin();
  replaceNodes(items.map((n) => ({ city: n.city, tag: n.tag })));
  revalidateSite();
  revalidatePath("/admin/content");
}

/* --------------------------- محتوای بخش‌ها (متن) --------------------------- */

export async function saveHero(formData: FormData): Promise<void> {
  await requireAdmin();
  const stats: HeroContent["stats"] = [0, 1, 2].map((i) => ({
    num: str(formData, `stat-num-${i}`),
    label: str(formData, `stat-label-${i}`),
  }));
  const hero: HeroContent = {
    eyebrow: str(formData, "eyebrow"),
    titleLine1: str(formData, "titleLine1"),
    titleAccent: str(formData, "titleAccent"),
    lead: str(formData, "lead"),
    ctaPrimary: str(formData, "ctaPrimary"),
    ctaSecondary: str(formData, "ctaSecondary"),
    stats,
  };
  saveSetting("hero", hero);
  revalidateSite();
  redirect("/admin/content?saved=hero");
}

async function saveHeader(
  key: "services" | "network" | "blog",
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const header: SectionHeader = {
    eyebrow: str(formData, "eyebrow"),
    title: str(formData, "title"),
    lead: str(formData, "lead"),
  };
  saveSetting(key, header);
  revalidateSite();
  redirect(`/admin/content?saved=${key}`);
}

export async function saveServicesHeader(formData: FormData): Promise<void> {
  await saveHeader("services", formData);
}
export async function saveNetworkHeader(formData: FormData): Promise<void> {
  await saveHeader("network", formData);
}
export async function saveBlogHeader(formData: FormData): Promise<void> {
  await saveHeader("blog", formData);
}

export async function saveAbout(formData: FormData): Promise<void> {
  await requireAdmin();
  const about: AboutContent = {
    eyebrow: str(formData, "eyebrow"),
    title: str(formData, "title"),
    lead: str(formData, "lead"),
    ctaText: str(formData, "ctaText"),
  };
  saveSetting("about", about);
  revalidateSite();
  redirect("/admin/content?saved=about");
}

export async function saveContact(formData: FormData): Promise<void> {
  await requireAdmin();
  const contact: ContactInfo = {
    eyebrow: str(formData, "eyebrow"),
    title: String(formData.get("title") ?? "").trim(),
    lead: str(formData, "lead"),
    address: str(formData, "address"),
    phoneDisplay: str(formData, "phoneDisplay"),
    phoneHref: str(formData, "phoneHref"),
    email: str(formData, "email"),
  };
  saveSetting("contact", contact);
  revalidateSite();
  redirect("/admin/content?saved=contact");
}

/* ----------------------------- درخواست‌های تماس ----------------------------- */

export async function toggleSubmissionRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  const read = str(formData, "read") === "1" ? 1 : 0;
  if (id) markSubmissionRead(id, read);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function removeSubmission(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  if (id) deleteSubmission(id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
