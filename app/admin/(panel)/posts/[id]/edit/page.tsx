import { notFound } from "next/navigation";
import { getPostById } from "@/lib/content";
import PostForm from "../../PostForm";
import styles from "../../../../admin.module.css";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>ویرایش مقاله</h1>
          <p className={styles.pageSub}>{post.title}</p>
        </div>
      </div>
      <PostForm post={post} />
    </>
  );
}
