import { getServices, getStats } from "@/lib/content";
import ServicesEditor from "./ServicesEditor";
import styles from "../../admin.module.css";

export default async function ServicesAdmin() {
  const services = getServices();
  const stats = getStats();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>خدمات و آمار</h1>
          <p className={styles.pageSub}>
            ویرایش کارت‌های بخش «خدمات» و اعداد آماری بخش «درباره ما»
          </p>
        </div>
      </div>
      <ServicesEditor services={services} stats={stats} />
    </>
  );
}
