import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogHeader, getPublishedPosts } from "@/lib/content";
import { faDate } from "@/lib/persian";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "مقالات",
  description:
    "یادداشت‌ها و مقالات درباره‌ی ترخیص گمرکی، ترانزیت زمینی و بازرگانی بین‌الملل.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const [header, posts] = await Promise.all([
    getBlogHeader(),
    getPublishedPosts(),
  ]);

  return (
    <>
      <Header hrefBase="/" />
      <main className={styles.page}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>
            <span className={styles.line} />
            {header.eyebrow}
          </div>
          <h1 className={styles.title}>{header.title}</h1>
          <p className={styles.lead}>{header.lead}</p>
        </div>

        {posts.length === 0 ? (
          <p className={styles.empty}>هنوز مقاله‌ای منتشر نشده است.</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={styles.card}>
                <div
                  className={styles.cover}
                  style={
                    p.cover ? { backgroundImage: `url(${p.cover})` } : undefined
                  }
                  aria-hidden="true"
                >
                  {!p.cover && <span className={styles.coverMark} />}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{p.category}</span>
                    <span className={styles.date}>{faDate(p.created_at)}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  <p className={styles.excerpt}>{p.excerpt}</p>
                  <span className={styles.readMore}>ادامه مطلب ←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer hrefBase="/" />
    </>
  );
}
