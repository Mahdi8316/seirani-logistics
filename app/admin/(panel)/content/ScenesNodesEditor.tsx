"use client";

import { useState, useTransition } from "react";
import { saveScenes } from "../../actions";
import type { Scene } from "@/lib/types";
import styles from "../../admin.module.css";

type SceneRow = { no: string; kicker: string; title: string; body: string; src: string };

export default function ScenesEditor({ scenes }: { scenes: Scene[] }) {
  const [sc, setSc] = useState<SceneRow[]>(
    scenes.map((s) => ({
      no: s.no,
      kicker: s.kicker,
      title: s.title,
      body: s.body,
      src: s.src,
    }))
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function saveSc() {
    setSaved(false);
    startTransition(async () => {
      await saveScenes(sc);
      setSaved(true);
    });
  }

  return (
    <section>
      <h2 className={styles.formCardTitle} style={{ border: "none", paddingBottom: 4 }}>
        صحنه‌های بخش «مسیر ما»
      </h2>
      {sc.map((row, i) => (
        <div key={i} className={styles.editorRow}>
          <div className={styles.editorRowHead}>
            <span className={styles.editorRowNum}>صحنه #{i + 1}</span>
            <button
              type="button"
              className={styles.btnDanger}
              onClick={() => setSc(sc.filter((_, j) => j !== i))}
            >
              حذف
            </button>
          </div>
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>شماره</label>
              <input
                className={styles.input}
                value={row.no}
                onChange={(e) => setSc(sc.map((r, j) => (j === i ? { ...r, no: e.target.value } : r)))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>عنوان کوچک (kicker)</label>
              <input
                className={styles.input}
                value={row.kicker}
                onChange={(e) => setSc(sc.map((r, j) => (j === i ? { ...r, kicker: e.target.value } : r)))}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={row.title}
              onChange={(e) => setSc(sc.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>متن</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={row.body}
              onChange={(e) => setSc(sc.map((r, j) => (j === i ? { ...r, body: e.target.value } : r)))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>مسیر ویدئو</label>
            <input
              dir="ltr"
              className={styles.input}
              value={row.src}
              placeholder="/assets/clip-2.mp4"
              onChange={(e) => setSc(sc.map((r, j) => (j === i ? { ...r, src: e.target.value } : r)))}
            />
          </div>
        </div>
      ))}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() =>
            setSc([
              ...sc,
              { no: String(sc.length + 1).padStart(2, "0"), kicker: "", title: "", body: "", src: "" },
            ])
          }
        >
          + افزودن صحنه
        </button>
        <button type="button" className={styles.btn} onClick={saveSc} disabled={pending}>
          {pending ? "در حال ذخیره…" : "ذخیره‌ی صحنه‌ها"}
        </button>
        {saved && <span style={{ color: "var(--accent-bright)", fontSize: 14 }}>ذخیره شد ✓</span>}
      </div>
    </section>
  );
}
