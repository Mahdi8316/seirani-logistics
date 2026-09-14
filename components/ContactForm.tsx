"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import styles from "./Contact.module.css";

const initialState: ContactState = null;

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form className={styles.form} action={formAction} data-reveal>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="c-name">
          نام و نام خانوادگی
        </label>
        <input
          id="c-name"
          name="name"
          type="text"
          placeholder="نام شما"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-phone">
            تلفن همراه
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            dir="ltr"
            placeholder="0912 000 0000"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-service">
            نوع خدمت
          </label>
          <select id="c-service" name="service" className={styles.input} defaultValue="ترخیص گمرکی">
            <option>ترخیص گمرکی</option>
            <option>ترانزیت زمینی</option>
            <option>بازرگانی بین‌الملل</option>
            <option>سایر</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="c-desc">
          توضیح محموله
        </label>
        <textarea
          id="c-desc"
          name="description"
          rows={4}
          placeholder="نوع کالا، مبدأ و مقصد …"
          className={styles.textarea}
        />
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "در حال ارسال…" : "ارسال درخواست"}
      </button>

      {state && (
        <p
          className={state.ok ? styles.formOk : styles.formError}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
