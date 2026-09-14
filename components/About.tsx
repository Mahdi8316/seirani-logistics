import { getAbout, getStats } from "@/lib/content";
import { faNumber } from "@/lib/persian";
import styles from "./About.module.css";

export default async function About() {
  const [about, stats] = await Promise.all([getAbout(), getStats()]);

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.wrap}>
        <div className={styles.intro} data-reveal>
          <div className={styles.eyebrow}>
            <span className={styles.line} />
            {about.eyebrow}
          </div>
          <h2 id="about-title" className={styles.title}>
            {about.title}
          </h2>
          <p className={styles.lead}>{about.lead}</p>
          <a href="#contact" className={styles.cta}>
            {about.ctaText}
          </a>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((st) => (
            <div key={st.id ?? st.label} className={styles.statCell}>
              <div
                className={styles.statNum}
                data-count={st.n}
                data-suffix={st.suffix}
              >
                {faNumber(st.n)}
                {st.suffix}
              </div>
              <div className={styles.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
