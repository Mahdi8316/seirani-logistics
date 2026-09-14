import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import LoginForm from "./LoginForm";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "ورود مدیریت",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginHead}>
          <h1 className={styles.loginTitle}>ورود به پنل مدیریت</h1>
          <p className={styles.loginSub}>{siteConfig.name} — بخش مدیریت محتوا</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
