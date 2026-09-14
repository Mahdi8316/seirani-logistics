import {
  getHero,
  getServicesHeader,
  getBlogHeader,
  getAbout,
  getContact,
  getScenes,
} from "@/lib/content";
import ScenesEditor from "./ScenesNodesEditor";
import {
  saveHero,
  saveServicesHeader,
  saveBlogHeader,
  saveAbout,
  saveContact,
} from "../../actions";
import styles from "../../admin.module.css";

const savedLabels: Record<string, string> = {
  hero: "بخش Hero ذخیره شد ✓",
  services: "سرتیتر خدمات ذخیره شد ✓",
  network: "سرتیتر شبکه ذخیره شد ✓",
  blog: "سرتیتر وبلاگ ذخیره شد ✓",
  about: "بخش درباره ما ذخیره شد ✓",
  contact: "اطلاعات تماس ذخیره شد ✓",
};

export default async function ContentAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [hero, servicesH, blogH, about, contact, scenes] = [
    getHero(),
    getServicesHeader(),
    getBlogHeader(),
    getAbout(),
    getContact(),
    getScenes(),
  ] as const;

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>محتوای بخش‌ها</h1>
          <p className={styles.pageSub}>ویرایش متن‌های بخش‌های اصلی صفحه</p>
        </div>
      </div>

      {saved && savedLabels[saved] && (
        <div className={styles.savedMsg}>{savedLabels[saved]}</div>
      )}

      {/* -------------------- Hero -------------------- */}
      <form action={saveHero} className={styles.form} style={{ marginBottom: 34 }}>
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>بخش نخست (Hero)</h2>
          <div className={styles.field}>
            <label className={styles.label}>خط بالا (eyebrow)</label>
            <input name="eyebrow" className={styles.input} defaultValue={hero.eyebrow} />
          </div>
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>عنوان — خط اول</label>
              <input name="titleLine1" className={styles.input} defaultValue={hero.titleLine1} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>عنوان — بخش تأکیدی (طلایی)</label>
              <input name="titleAccent" className={styles.input} defaultValue={hero.titleAccent} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>توضیح</label>
            <textarea name="lead" rows={3} className={styles.textarea} defaultValue={hero.lead} />
          </div>
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>دکمه‌ی اصلی</label>
              <input name="ctaPrimary" className={styles.input} defaultValue={hero.ctaPrimary} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>دکمه‌ی دوم</label>
              <input name="ctaSecondary" className={styles.input} defaultValue={hero.ctaSecondary} />
            </div>
          </div>
          <label className={styles.label}>سه آمار کوچک پایین Hero</label>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.twoCol}>
              <div className={styles.field}>
                <input
                  name={`stat-num-${i}`}
                  className={styles.input}
                  placeholder="عدد (مثلاً ۱۲+)"
                  defaultValue={hero.stats[i]?.num ?? ""}
                />
              </div>
              <div className={styles.field}>
                <input
                  name={`stat-label-${i}`}
                  className={styles.input}
                  placeholder="برچسب"
                  defaultValue={hero.stats[i]?.label ?? ""}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btn}>ذخیره‌ی Hero</button>
        </div>
      </form>

      {/* -------------------- سرتیتر خدمات -------------------- */}
      <HeaderForm
        action={saveServicesHeader}
        title="سرتیتر بخش خدمات"
        data={servicesH}
      />

      {/* -------------------- صحنه‌های مسیر -------------------- */}
      <div style={{ marginBottom: 34 }}>
        <ScenesEditor scenes={scenes} />
      </div>

      {/* -------------------- سرتیتر وبلاگ -------------------- */}
      <HeaderForm action={saveBlogHeader} title="سرتیتر بخش مقالات" data={blogH} />

      {/* -------------------- درباره ما -------------------- */}
      <form action={saveAbout} className={styles.form} style={{ marginBottom: 34 }}>
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>بخش درباره ما</h2>
          <div className={styles.field}>
            <label className={styles.label}>خط بالا</label>
            <input name="eyebrow" className={styles.input} defaultValue={about.eyebrow} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>عنوان</label>
            <input name="title" className={styles.input} defaultValue={about.title} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>توضیح</label>
            <textarea name="lead" rows={4} className={styles.textarea} defaultValue={about.lead} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>متن دکمه</label>
            <input name="ctaText" className={styles.input} defaultValue={about.ctaText} />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btn}>ذخیره‌ی درباره ما</button>
        </div>
      </form>

      {/* -------------------- تماس -------------------- */}
      <form action={saveContact} className={styles.form}>
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>بخش تماس و اطلاعات تماس</h2>
          <div className={styles.field}>
            <label className={styles.label}>خط بالا</label>
            <input name="eyebrow" className={styles.input} defaultValue={contact.eyebrow} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>عنوان (برای شکستن خط، Enter بزنید)</label>
            <textarea name="title" rows={2} className={styles.textarea} defaultValue={contact.title} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>توضیح</label>
            <textarea name="lead" rows={2} className={styles.textarea} defaultValue={contact.lead} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>آدرس</label>
            <input name="address" className={styles.input} defaultValue={contact.address} />
          </div>
          <div className={styles.threeCol}>
            <div className={styles.field}>
              <label className={styles.label}>تلفن (نمایشی)</label>
              <input name="phoneDisplay" className={styles.input} defaultValue={contact.phoneDisplay} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>تلفن (پیوند tel:)</label>
              <input name="phoneHref" dir="ltr" className={styles.input} defaultValue={contact.phoneHref} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>ایمیل</label>
              <input name="email" dir="ltr" className={styles.input} defaultValue={contact.email} />
            </div>
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btn}>ذخیره‌ی تماس</button>
        </div>
      </form>
    </>
  );
}

function HeaderForm({
  action,
  title,
  data,
}: {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  data: { eyebrow: string; title: string; lead: string };
}) {
  return (
    <form action={action} className={styles.form} style={{ marginBottom: 34 }}>
      <div className={styles.formCard}>
        <h2 className={styles.formCardTitle}>{title}</h2>
        <div className={styles.field}>
          <label className={styles.label}>خط بالا</label>
          <input name="eyebrow" className={styles.input} defaultValue={data.eyebrow} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>عنوان</label>
          <input name="title" className={styles.input} defaultValue={data.title} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>توضیح</label>
          <textarea name="lead" rows={3} className={styles.textarea} defaultValue={data.lead} />
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.btn}>ذخیره</button>
      </div>
    </form>
  );
}
