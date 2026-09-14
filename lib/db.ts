import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/password";
import {
  defaultScenes,
  defaultServices,
  defaultNodes,
  defaultStats,
  defaultHero,
  defaultServicesHeader,
  defaultNetworkHeader,
  defaultBlogHeader,
  defaultAbout,
  defaultContact,
  defaultPosts,
} from "@/lib/data";

// نگه‌داشتن اتصال به‌صورت singleton تا در حالت توسعه (HMR) دوباره باز نشود.
const globalForDb = globalThis as unknown as {
  __seiraniDb?: DatabaseSync;
};

/** اجرای یک تابع درون تراکنش (node:sqlite متد transaction ندارد). */
export function transaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  no    TEXT NOT NULL,
  title TEXT NOT NULL,
  body  TEXT NOT NULL,
  icon  TEXT,
  sort  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  n      INTEGER NOT NULL,
  suffix TEXT NOT NULL DEFAULT '',
  label  TEXT NOT NULL,
  sort   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS scenes (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  no     TEXT NOT NULL,
  kicker TEXT NOT NULL,
  title  TEXT NOT NULL,
  body   TEXT NOT NULL,
  src    TEXT NOT NULL,
  sort   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nodes (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  tag  TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  excerpt    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  cover      TEXT,
  category   TEXT NOT NULL DEFAULT '',
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  service     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,
  read        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL
);
`;

function nowIso() {
  return new Date().toISOString();
}

function setSetting(db: DatabaseSync, key: string, value: unknown) {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, JSON.stringify(value));
}

function seed(db: DatabaseSync) {
  const count = (table: string) =>
    Number((db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get() as { c: number }).c);

  db.exec("BEGIN");
  try {
    // --- بخش‌های متنی (settings) ---
    const hasHero = db.prepare("SELECT 1 FROM settings WHERE key = 'hero'").get();
    if (!hasHero) {
      setSetting(db, "hero", defaultHero);
      setSetting(db, "services", defaultServicesHeader);
      setSetting(db, "network", defaultNetworkHeader);
      setSetting(db, "blog", defaultBlogHeader);
      setSetting(db, "about", defaultAbout);
      setSetting(db, "contact", defaultContact);
    }

    // --- خدمات ---
    if (count("services") === 0) {
      const ins = db.prepare(
        "INSERT INTO services (no, title, body, sort) VALUES (@no, @title, @body, @sort)"
      );
      defaultServices.forEach((s, i) => ins.run({ ...s, sort: i }));
    }

    // --- آمار ---
    if (count("stats") === 0) {
      const ins = db.prepare(
        "INSERT INTO stats (n, suffix, label, sort) VALUES (@n, @suffix, @label, @sort)"
      );
      defaultStats.forEach((s, i) => ins.run({ ...s, sort: i }));
    }

    // --- صحنه‌های مسیر ---
    if (count("scenes") === 0) {
      const ins = db.prepare(
        "INSERT INTO scenes (no, kicker, title, body, src, sort) VALUES (@no, @kicker, @title, @body, @src, @sort)"
      );
      defaultScenes.forEach((s, i) => ins.run({ ...s, sort: i }));
    }

    // --- گره‌های شبکه ---
    if (count("nodes") === 0) {
      const ins = db.prepare(
        "INSERT INTO nodes (city, tag, sort) VALUES (@city, @tag, @sort)"
      );
      defaultNodes.forEach((n, i) => ins.run({ ...n, sort: i }));
    }

    // --- مقالات ---
    if (count("posts") === 0) {
      const ins = db.prepare(
        `INSERT INTO posts (slug, title, excerpt, body, cover, category, published, created_at, updated_at)
         VALUES (@slug, @title, @excerpt, @body, @cover, @category, @published, @created_at, @updated_at)`
      );
      const base = Date.now();
      defaultPosts.forEach((p, i) => {
        const ts = new Date(base - i * 86400000).toISOString();
        ins.run({ ...p, created_at: ts, updated_at: ts });
      });
    }

    // --- کاربر ادمین اولیه ---
    if (count("users") === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const configuredPassword = process.env.ADMIN_PASSWORD;
      if (!configuredPassword && process.env.NODE_ENV === "production") {
        throw new Error("ADMIN_PASSWORD is required to seed the production admin user");
      }
      const password = configuredPassword || "development-only-password";
      db.prepare(
        "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)"
      ).run(username, hashPassword(password), nowIso());
    }

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function columnExists(db: DatabaseSync, table: string, column: string): boolean {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  return rows.some((r) => r.name === column);
}

/** مهاجرت‌های سبک برای دیتابیس‌های موجود (ستون‌هایی که بعداً اضافه شده‌اند). */
function migrate(db: DatabaseSync) {
  if (!columnExists(db, "services", "icon")) {
    db.exec("ALTER TABLE services ADD COLUMN icon TEXT");
  }
}

function createDb(): DatabaseSync {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "seirani.db"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(SCHEMA);
  migrate(db);
  seed(db);
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__seiraniDb) {
    globalForDb.__seiraniDb = createDb();
  }
  return globalForDb.__seiraniDb;
}
