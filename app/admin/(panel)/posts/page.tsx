import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { faDate } from "@/lib/persian";
import { removePost } from "../../actions";
import styles from "../../admin.module.css";

export default async function PostsAdmin() {
  const posts = getAllPosts();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>مقالات و وبلاگ</h1>
          <p className={styles.pageSub}>مدیریت مقالات منتشرشده و پیش‌نویس‌ها</p>
        </div>
        <Link href="/admin/posts/new" className={styles.btn}>
          + مقاله‌ی جدید
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>هنوز مقاله‌ای ثبت نشده است.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>عنوان</th>
                <th>دسته</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.category || "—"}</td>
                  <td>
                    <span
                      className={`${styles.pill} ${
                        p.published ? styles.pillOn : styles.pillOff
                      }`}
                    >
                      {p.published ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td>{faDate(p.created_at)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/admin/posts/${p.id}/edit`}
                        className={styles.linkAction}
                      >
                        ویرایش
                      </Link>
                      {p.published && (
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          className={styles.linkAction}
                        >
                          مشاهده
                        </Link>
                      )}
                      <form action={removePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className={styles.btnDanger}>
                          حذف
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
