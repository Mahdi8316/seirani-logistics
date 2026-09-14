import Link from "next/link";
import {
  getAllPosts,
  getServices,
  getSubmissions,
  unreadSubmissionCount,
} from "@/lib/content";
import { faNumber } from "@/lib/persian";
import styles from "../admin.module.css";

export default async function Dashboard() {
  const posts = getAllPosts();
  const published = posts.filter((p) => p.published).length;
  const services = getServices();
  const submissions = getSubmissions();
  const unread = unreadSubmissionCount();

  const cards = [
    { num: posts.length, label: "کل مقالات" },
    { num: published, label: "مقالات منتشرشده" },
    { num: services.length, label: "خدمات" },
    { num: submissions.length, label: "درخواست‌های تماس" },
  ];

  const tiles = [
    {
      href: "/admin/posts/new",
      title: "نوشتن مقاله‌ی جدید",
      desc: "افزودن مقاله به وبلاگ با عنوان، خلاصه، دسته و متن کامل.",
    },
    {
      href: "/admin/posts",
      title: "مدیریت مقالات",
      desc: "ویرایش، انتشار/پیش‌نویس و حذف مقالات موجود.",
    },
    {
      href: "/admin/services",
      title: "خدمات و آمار",
      desc: "ویرایش کارت‌های خدمات و اعداد آماری بخش «درباره ما».",
    },
    {
      href: "/admin/content",
      title: "محتوای بخش‌ها",
      desc: "ویرایش متن‌های Hero، مسیر ما، درباره، وبلاگ و اطلاعات تماس.",
    },
    {
      href: "/admin/submissions",
      title: `درخواست‌های تماس${unread > 0 ? ` (${faNumber(unread)} جدید)` : ""}`,
      desc: "مشاهده و مدیریت پیام‌های ارسال‌شده از فرم تماس.",
    },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>داشبورد</h1>
          <p className={styles.pageSub}>نمای کلی محتوای سایت</p>
        </div>
      </div>

      <div className={styles.cards}>
        {cards.map((c) => (
          <div key={c.label} className={styles.statCard}>
            <div className={styles.statCardNum}>{faNumber(c.num)}</div>
            <div className={styles.statCardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.tiles}>
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className={styles.tile}>
            <div className={styles.tileTitle}>{t.title}</div>
            <div className={styles.tileDesc}>{t.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
