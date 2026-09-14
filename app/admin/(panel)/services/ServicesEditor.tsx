"use client";

import { useState, useTransition } from "react";
import { saveServices, saveStats } from "../../actions";
import type { Service, Stat } from "@/lib/types";
import styles from "../../admin.module.css";

type ServiceRow = { no: string; title: string; body: string; icon: string };
type StatRow = { n: string; suffix: string; label: string };

const MAX_ICON_BYTES = 512 * 1024; // ۵۱۲ کیلوبایت

export default function ServicesEditor({
  services,
  stats,
}: {
  services: Service[];
  stats: Stat[];
}) {
  const [svc, setSvc] = useState<ServiceRow[]>(
    services.map((s) => ({
      no: s.no,
      title: s.title,
      body: s.body,
      icon: s.icon ?? "",
    }))
  );
  const [st, setSt] = useState<StatRow[]>(
    stats.map((s) => ({ n: String(s.n), suffix: s.suffix, label: s.label }))
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<"" | "svc" | "stats">("");

  function pickIcon(i: number, file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_ICON_BYTES) {
      alert("حجم آیکون باید کمتر از ۵۱۲ کیلوبایت باشد.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setSvc((prev) =>
        prev.map((r, j) => (j === i ? { ...r, icon: String(reader.result) } : r))
      );
    reader.readAsDataURL(file);
  }

  function saveSvc() {
    setSaved("");
    startTransition(async () => {
      await saveServices(
        svc.map((r) => ({
          no: r.no,
          title: r.title,
          body: r.body,
          icon: r.icon || null,
        }))
      );
      setSaved("svc");
    });
  }
  function saveStatsRows() {
    setSaved("");
    startTransition(async () => {
      await saveStats(st.map((s) => ({ n: Number(s.n) || 0, suffix: s.suffix, label: s.label })));
      setSaved("stats");
    });
  }

  return (
    <>
      {/* ---------------- خدمات ---------------- */}
      <section style={{ marginBottom: 40 }}>
        <h2 className={styles.formCardTitle} style={{ border: "none", paddingBottom: 4 }}>
          کارت‌های خدمات
        </h2>
        {svc.map((row, i) => (
          <div key={i} className={styles.editorRow}>
            <div className={styles.editorRowHead}>
              <span className={styles.editorRowNum}>خدمت #{i + 1}</span>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => setSvc(svc.filter((_, j) => j !== i))}
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
                  onChange={(e) =>
                    setSvc(svc.map((r, j) => (j === i ? { ...r, no: e.target.value } : r)))
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>عنوان</label>
                <input
                  className={styles.input}
                  value={row.title}
                  onChange={(e) =>
                    setSvc(svc.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))
                  }
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>توضیح</label>
              <textarea
                className={styles.textarea}
                rows={2}
                value={row.body}
                onChange={(e) =>
                  setSvc(svc.map((r, j) => (j === i ? { ...r, body: e.target.value } : r)))
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>آیکون (اختیاری — PNG/SVG، کمتر از ۵۱۲KB)</label>
              <div className={styles.iconRow}>
                <div className={styles.iconPreview} aria-hidden="true">
                  {row.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={row.icon} alt="" />
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <label className={styles.uploadBtn}>
                  {row.icon ? "تغییر آیکون" : "بارگذاری آیکون"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    hidden
                    onChange={(e) => {
                      pickIcon(i, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {row.icon && (
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={() =>
                      setSvc(svc.map((r, j) => (j === i ? { ...r, icon: "" } : r)))
                    }
                  >
                    حذف آیکون
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() =>
              setSvc([
                ...svc,
                { no: String(svc.length + 1).padStart(2, "0"), title: "", body: "", icon: "" },
              ])
            }
          >
            + افزودن خدمت
          </button>
          <button type="button" className={styles.btn} onClick={saveSvc} disabled={pending}>
            {pending ? "در حال ذخیره…" : "ذخیره‌ی خدمات"}
          </button>
          {saved === "svc" && <span className={styles.errorMsg} style={{ color: "var(--accent-bright)" }}>ذخیره شد ✓</span>}
        </div>
      </section>

      {/* ---------------- آمار ---------------- */}
      <section>
        <h2 className={styles.formCardTitle} style={{ border: "none", paddingBottom: 4 }}>
          اعداد آماری (بخش «درباره ما»)
        </h2>
        {st.map((row, i) => (
          <div key={i} className={styles.editorRow}>
            <div className={styles.editorRowHead}>
              <span className={styles.editorRowNum}>آمار #{i + 1}</span>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => setSt(st.filter((_, j) => j !== i))}
              >
                حذف
              </button>
            </div>
            <div className={styles.threeCol}>
              <div className={styles.field}>
                <label className={styles.label}>عدد</label>
                <input
                  type="number"
                  dir="ltr"
                  className={styles.input}
                  value={row.n}
                  onChange={(e) =>
                    setSt(st.map((r, j) => (j === i ? { ...r, n: e.target.value } : r)))
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>پسوند</label>
                <input
                  className={styles.input}
                  value={row.suffix}
                  placeholder="مثلاً + یا ٪"
                  onChange={(e) =>
                    setSt(st.map((r, j) => (j === i ? { ...r, suffix: e.target.value } : r)))
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>برچسب</label>
                <input
                  className={styles.input}
                  value={row.label}
                  onChange={(e) =>
                    setSt(st.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => setSt([...st, { n: "0", suffix: "", label: "" }])}
          >
            + افزودن آمار
          </button>
          <button type="button" className={styles.btn} onClick={saveStatsRows} disabled={pending}>
            {pending ? "در حال ذخیره…" : "ذخیره‌ی آمار"}
          </button>
          {saved === "stats" && <span className={styles.errorMsg} style={{ color: "var(--accent-bright)" }}>ذخیره شد ✓</span>}
        </div>
      </section>
    </>
  );
}
