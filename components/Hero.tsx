import { getHero } from "@/lib/content";
import styles from "./Hero.module.css";

export default async function Hero() {
  const hero = await getHero();

  return (
    <section id="hero" className={styles.hero} aria-label="معرفی">
      <div className={styles.pin}>
        {/* لایه‌ی رسانه — ویدئوی پس‌زمینه با درجه‌بندی رنگ خاکستری سینمایی */}
        <div className={styles.media} data-hero-media>
          <video
            className={styles.video}
            src="/assets/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        {/* لایه‌های همپوشانی (به ترتیب) */}
        <div className={styles.ovColor} aria-hidden="true" />
        <div className={styles.ovOverlay} aria-hidden="true" />
        <div className={styles.ovScreen} aria-hidden="true" />
        <div className={styles.ovVignette} aria-hidden="true" />
        <div className={styles.ovScrim} aria-hidden="true" />

        {/* لایه‌ی متن */}
        <div className={styles.copy} data-hero-copy>
          <div className={styles.center}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {hero.eyebrow}
              <span className={styles.eyebrowLine} />
            </div>
            <h1 className={styles.h1}>
              {hero.titleLine1}
              <br />
              <span className={styles.h1Accent}>{hero.titleAccent}</span>
            </h1>
            <p className={styles.lead}>{hero.lead}</p>
            <div className={styles.actions}>
              <a href="#services" className={styles.ctaPrimary}>
                {hero.ctaPrimary}
              </a>
              <a href="#contact" className={styles.ctaSecondary}>
                {hero.ctaSecondary}
              </a>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <div className={styles.stats}>
              {hero.stats.map((st, i) => (
                <div className={styles.stat} key={i}>
                  <div className={styles.statNum}>{st.num}</div>
                  <div className={styles.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.scrollHint}>
              برای شروع سفر اسکرول کنید
              <span className={styles.scrollTick} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
