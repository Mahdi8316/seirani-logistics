import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { unreadSubmissionCount } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { logout } from "../actions";
import AdminNav from "../AdminNav";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "مدیریت",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const unread = unreadSubmissionCount();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Image
            src="/assets/logo.jpg"
            alt={siteConfig.name}
            width={32}
            height={32}
            className={styles.brandLogo}
          />
          <div>
            <div className={styles.brandName}>{siteConfig.name}</div>
            <div className={styles.brandSub}>پنل مدیریت</div>
          </div>
        </div>

        <AdminNav unread={unread} />

        <div className={styles.sidebarFoot}>
          <Link href="/" className={styles.viewSite} target="_blank">
            مشاهده‌ی سایت ↗
          </Link>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>
              خروج از حساب
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
