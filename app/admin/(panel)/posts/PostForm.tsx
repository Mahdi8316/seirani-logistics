"use client";

import { useActionState } from "react";
import Link from "next/link";
import { savePost, type PostState } from "../../actions";
import type { Post } from "@/lib/types";
import styles from "../../admin.module.css";

const initial: PostState = null;

export default function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, initial);

  return (
    <form action={action} className={styles.form}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className={styles.formCard}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            عنوان مقاله *
          </label>
          <input
            id="title"
            name="title"
            className={styles.input}
            defaultValue={post?.title ?? ""}
            required
          />
        </div>

        <div className={styles.twoCol}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="slug">
              نامک (slug)
            </label>
            <input
              id="slug"
              name="slug"
              dir="ltr"
              className={styles.input}
              defaultValue={post?.slug ?? ""}
              placeholder="در صورت خالی‌بودن از عنوان ساخته می‌شود"
            />
            <span className={styles.hint}>در آدرس مقاله استفاده می‌شود.</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              دسته‌بندی
            </label>
            <input
              id="category"
              name="category"
              className={styles.input}
              defaultValue={post?.category ?? ""}
              placeholder="مثلاً: گمرک، ترانزیت"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="cover">
            نشانی تصویر شاخص (اختیاری)
          </label>
          <input
            id="cover"
            name="cover"
            dir="ltr"
            className={styles.input}
            defaultValue={post?.cover ?? ""}
            placeholder="/assets/cover.jpg یا آدرس کامل تصویر"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="excerpt">
            خلاصه
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            className={styles.textarea}
            defaultValue={post?.excerpt ?? ""}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="body">
            متن مقاله
          </label>
          <textarea
            id="body"
            name="body"
            rows={16}
            className={styles.textarea}
            defaultValue={post?.body ?? ""}
            placeholder={"با ## برای عنوان و خط خالی برای جدا کردن پاراگراف‌ها بنویسید."}
          />
          <span className={styles.hint}>
            برای عنوان‌ها از «## عنوان» و «### زیرعنوان» و برای جدا کردن پاراگراف‌ها
            از خط خالی استفاده کنید.
          </span>
        </div>

        <label className={styles.checkRow}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={post ? post.published === 1 : true}
          />
          انتشار روی سایت (در غیر این صورت پیش‌نویس می‌ماند)
        </label>
      </div>

      {state?.error && <p className={styles.errorMsg}>{state.error}</p>}

      <div className={styles.formActions}>
        <button type="submit" className={styles.btn} disabled={pending}>
          {pending ? "در حال ذخیره…" : post ? "ذخیره‌ی تغییرات" : "ثبت مقاله"}
        </button>
        <Link href="/admin/posts" className={styles.btnGhost}>
          انصراف
        </Link>
      </div>
    </form>
  );
}
