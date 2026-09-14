import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
import { faDate } from "@/lib/persian";
import styles from "./post.module.css";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) return { title: "مقاله یافت نشد" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
  };
}

// رندر ساده‌ی متن مقاله: عنوان‌های ## و ### و پاراگراف‌ها (بدون HTML خام).
function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return <h3 key={i}>{block.slice(4)}</h3>;
        }
        if (block.startsWith("## ")) {
          return <h2 key={i}>{block.slice(3)}</h2>;
        }
        const lines = block.split("\n");
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = getPublishedPosts(4).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <Header hrefBase="/" />
      <main className={styles.page}>
        <article className={styles.article}>
          <Link href="/blog" className={styles.back}>
            → بازگشت به مقالات
          </Link>

          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{faDate(post.created_at)}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

          {post.cover && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className={styles.cover} src={post.cover} alt={post.title} />
          )}

          <ArticleBody body={post.body} />
        </article>

        {related.length > 0 && (
          <aside className={styles.related}>
            <h2 className={styles.relatedTitle}>مقالات مرتبط</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                  <span className={styles.relatedCat}>{p.category}</span>
                  <span className={styles.relatedName}>{p.title}</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>
      <Footer hrefBase="/" />
    </>
  );
}
