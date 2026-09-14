import PostForm from "../PostForm";
import styles from "../../../admin.module.css";

export default function NewPost() {
  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>مقاله‌ی جدید</h1>
          <p className={styles.pageSub}>یک مقاله‌ی تازه برای وبلاگ بنویسید</p>
        </div>
      </div>
      <PostForm />
    </>
  );
}
