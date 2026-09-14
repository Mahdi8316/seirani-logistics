"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const items = [
  { href: "/admin", label: "داشبورد", exact: true },
  { href: "/admin/posts", label: "مقالات و وبلاگ", exact: false },
  { href: "/admin/services", label: "خدمات و آمار", exact: false },
  { href: "/admin/content", label: "محتوای بخش‌ها", exact: false },
  { href: "/admin/submissions", label: "درخواست‌های تماس", exact: false },
];

export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav style={{ display: "grid", gap: 6 }}>
      {items.map((it) => {
        const active = it.exact
          ? pathname === it.href
          : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={active ? styles.navItemActive : styles.navItem}
          >
            <span>{it.label}</span>
            {it.href === "/admin/submissions" && unread > 0 && (
              <span className={styles.badge}>{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
