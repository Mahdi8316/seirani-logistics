import { getSubmissions } from "@/lib/content";
import { faDate } from "@/lib/persian";
import { toggleSubmissionRead, removeSubmission } from "../../actions";
import styles from "../../admin.module.css";

export default async function SubmissionsAdmin() {
  const subs = getSubmissions();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>درخواست‌های تماس</h1>
          <p className={styles.pageSub}>پیام‌های ارسال‌شده از فرم تماس سایت</p>
        </div>
      </div>

      {subs.length === 0 ? (
        <div className={styles.empty}>هنوز درخواستی ثبت نشده است.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>نام</th>
                <th>تلفن</th>
                <th>خدمت</th>
                <th>توضیح</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.read === 0 && <span className={`${styles.pill} ${styles.pillNew}`} style={{ marginLeft: 8 }}>جدید</span>}
                    {s.name}
                  </td>
                  <td dir="ltr" style={{ textAlign: "right" }}>{s.phone}</td>
                  <td>{s.service || "—"}</td>
                  <td style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{s.description || "—"}</td>
                  <td>{faDate(s.created_at)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <form action={toggleSubmissionRead}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="read" value={s.read === 0 ? "1" : "0"} />
                        <button type="submit" className={styles.linkAction} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          {s.read === 0 ? "علامت‌گذاری خوانده‌شده" : "علامت‌گذاری نخوانده"}
                        </button>
                      </form>
                      <form action={removeSubmission}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className={styles.btnDanger}>حذف</button>
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
