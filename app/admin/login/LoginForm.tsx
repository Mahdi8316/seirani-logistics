"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import styles from "../admin.module.css";

const initial: LoginState = null;

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className={styles.form} style={{ gap: 16 }}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">
          نام‌کاربری
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={styles.input}
          required
        />
      </div>

      {state?.error && <p className={styles.errorMsg}>{state.error}</p>}

      <button type="submit" className={styles.btn} disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
        {pending ? "در حال ورود…" : "ورود"}
      </button>
    </form>
  );
}
