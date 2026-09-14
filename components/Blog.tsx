import Link from "next/link";
import { getBlogHeader, getPublishedPosts } from "@/lib/content";
import { faDate } from "@/lib/persian";
import styles from "./Blog.module.css";

export default async function Blog() {
  const [header, posts] = await Promise.all([
    getBlogHeader(),
    getPublishedPosts(3),
  ]);

  return (
    <section id="blog" className={styles.section} aria-labelledby="blog-title">
      <div className={styles.inner}>
        <div className={styles.head} data-reveal>
          <div className={styles.headText}>
            <div className={styles.eyebrow}>
              <span className={styles.line} />
              {header.eyebrow}
            </div>
            <h2 id="blog-title" className={styles.title}>
              {header.title}
            </h2>
            <p className={styles.lead}>{header.lead}</p>
          </div>
          <Link href="/blog" className={styles.allLink}>
            همه مقالات
            <span className={styles.arrow} aria-hidden="true">
              ←
            </span>
          </Link>
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
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.excerpt}>{p.excerpt}</p>
                  <span className={styles.readMore}>ادامه مطلب ←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
