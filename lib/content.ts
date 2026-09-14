import "server-only";
import { getDb, transaction } from "@/lib/db";
import {
  defaultHero,
  defaultServicesHeader,
  defaultNetworkHeader,
  defaultBlogHeader,
  defaultAbout,
  defaultContact,
} from "@/lib/data";
import type {
  Scene,
  Service,
  NetworkNode,
  Stat,
  Post,
  Submission,
  HeroContent,
  SectionHeader,
  AboutContent,
  ContactInfo,
  SettingsKey,
} from "@/lib/types";

// node:sqlite سطرها را با prototype برابر null برمی‌گرداند؛ برای پاس‌دادن به
// Client Componentها (و سریال‌سازی امن) آن‌ها را به آبجکت ساده تبدیل می‌کنیم.
function plainRow<T>(row: unknown): T {
  return { ...(row as Record<string, unknown>) } as T;
}
function plainRows<T>(rows: unknown[]): T[] {
  return rows.map((r) => ({ ...(r as Record<string, unknown>) }) as T);
}

/* ----------------------------- تنظیمات (settings) ----------------------------- */

const defaults: Record<SettingsKey, unknown> = {
  hero: defaultHero,
  services: defaultServicesHeader,
  network: defaultNetworkHeader,
  blog: defaultBlogHeader,
  about: defaultAbout,
  contact: defaultContact,
};

function getSetting<T>(key: SettingsKey): T {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  if (!row) return defaults[key] as T;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return defaults[key] as T;
  }
}

export function saveSetting(key: SettingsKey, value: unknown): void {
  getDb()
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, JSON.stringify(value));
}

export const getHero = () => getSetting<HeroContent>("hero");
export const getServicesHeader = () => getSetting<SectionHeader>("services");
export const getNetworkHeader = () => getSetting<SectionHeader>("network");
export const getBlogHeader = () => getSetting<SectionHeader>("blog");
export const getAbout = () => getSetting<AboutContent>("about");
export const getContact = () => getSetting<ContactInfo>("contact");

/* -------------------------------- خدمات و آمار -------------------------------- */

export function getServices(): Service[] {
  return plainRows<Service>(
    getDb().prepare("SELECT * FROM services ORDER BY sort ASC, id ASC").all()
  );
}

export function replaceServices(items: Omit<Service, "id" | "sort">[]): void {
  transaction(() => {
    const db = getDb();
    db.prepare("DELETE FROM services").run();
    const ins = db.prepare(
      "INSERT INTO services (no, title, body, icon, sort) VALUES (@no, @title, @body, @icon, @sort)"
    );
    items.forEach((s, i) =>
      ins.run({
        no: s.no,
        title: s.title,
        body: s.body,
        icon: s.icon ?? null,
        sort: i,
      })
    );
  });
}

export function getStats(): Stat[] {
  return plainRows<Stat>(
    getDb().prepare("SELECT * FROM stats ORDER BY sort ASC, id ASC").all()
  );
}

export function replaceStats(items: Omit<Stat, "id" | "sort">[]): void {
  transaction(() => {
    const db = getDb();
    db.prepare("DELETE FROM stats").run();
    const ins = db.prepare(
      "INSERT INTO stats (n, suffix, label, sort) VALUES (@n, @suffix, @label, @sort)"
    );
    items.forEach((s, i) => ins.run({ ...s, sort: i }));
  });
}

/* ------------------------------ صحنه‌ها و گره‌ها ------------------------------ */

export function getScenes(): Scene[] {
  return plainRows<Scene>(
    getDb().prepare("SELECT * FROM scenes ORDER BY sort ASC, id ASC").all()
  );
}

export function replaceScenes(items: Omit<Scene, "id" | "sort">[]): void {
  transaction(() => {
    const db = getDb();
    db.prepare("DELETE FROM scenes").run();
    const ins = db.prepare(
      "INSERT INTO scenes (no, kicker, title, body, src, sort) VALUES (@no, @kicker, @title, @body, @src, @sort)"
    );
    items.forEach((s, i) => ins.run({ ...s, sort: i }));
  });
}

export function getNodes(): NetworkNode[] {
  return plainRows<NetworkNode>(
    getDb().prepare("SELECT * FROM nodes ORDER BY sort ASC, id ASC").all()
  );
}

export function replaceNodes(items: Omit<NetworkNode, "id" | "sort">[]): void {
  transaction(() => {
    const db = getDb();
    db.prepare("DELETE FROM nodes").run();
    const ins = db.prepare(
      "INSERT INTO nodes (city, tag, sort) VALUES (@city, @tag, @sort)"
    );
    items.forEach((n, i) => ins.run({ ...n, sort: i }));
  });
}

/* ----------------------------------- مقالات ---------------------------------- */

export function getPublishedPosts(limit?: number): Post[] {
  const sql =
    "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC, id DESC" +
    (limit ? " LIMIT ?" : "");
  const stmt = getDb().prepare(sql);
  return plainRows<Post>(limit ? stmt.all(limit) : stmt.all());
}

export function getAllPosts(): Post[] {
  return plainRows<Post>(
    getDb().prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC").all()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  const row = getDb().prepare("SELECT * FROM posts WHERE slug = ?").get(slug);
  return row ? plainRow<Post>(row) : undefined;
}

export function getPostById(id: number): Post | undefined {
  const row = getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id);
  return row ? plainRow<Post>(row) : undefined;
}

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  category: string;
  published: number;
};

export function createPost(input: PostInput): number {
  const ts = new Date().toISOString();
  const info = getDb()
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, body, cover, category, published, created_at, updated_at)
       VALUES (@slug, @title, @excerpt, @body, @cover, @category, @published, @created_at, @updated_at)`
    )
    .run({ ...input, created_at: ts, updated_at: ts });
  return Number(info.lastInsertRowid);
}

export function updatePost(id: number, input: PostInput): void {
  getDb()
    .prepare(
      `UPDATE posts SET slug=@slug, title=@title, excerpt=@excerpt, body=@body,
        cover=@cover, category=@category, published=@published, updated_at=@updated_at
       WHERE id=@id`
    )
    .run({ ...input, id, updated_at: new Date().toISOString() });
}

export function deletePost(id: number): void {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

export function slugExists(slug: string, exceptId?: number): boolean {
  const row = getDb()
    .prepare("SELECT id FROM posts WHERE slug = ?")
    .get(slug) as { id: number } | undefined;
  if (!row) return false;
  return exceptId ? row.id !== exceptId : true;
}

/* --------------------------- درخواست‌های فرم تماس --------------------------- */

export function createSubmission(input: {
  name: string;
  phone: string;
  service: string;
  description: string;
}): void {
  getDb()
    .prepare(
      `INSERT INTO submissions (name, phone, service, description, created_at, read)
       VALUES (@name, @phone, @service, @description, @created_at, 0)`
    )
    .run({ ...input, created_at: new Date().toISOString() });
}

export function getSubmissions(): Submission[] {
  return plainRows<Submission>(
    getDb()
      .prepare("SELECT * FROM submissions ORDER BY created_at DESC, id DESC")
      .all()
  );
}

export function unreadSubmissionCount(): number {
  return (
    getDb()
      .prepare("SELECT COUNT(*) AS c FROM submissions WHERE read = 0")
      .get() as { c: number }
  ).c;
}

export function markSubmissionRead(id: number, read: number): void {
  getDb().prepare("UPDATE submissions SET read = ? WHERE id = ?").run(read, id);
}

export function deleteSubmission(id: number): void {
  getDb().prepare("DELETE FROM submissions WHERE id = ?").run(id);
}
