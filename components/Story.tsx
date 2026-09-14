import { getScenes } from "@/lib/content";
import styles from "./Story.module.css";

export default async function Story() {
  const scenes = await getScenes();

  return (
    <section id="story" aria-label="مسیر ما">
      {scenes.map((sc) => (
        <div key={sc.id ?? sc.no} className={styles.scene}>
          <video
            className={styles.video}
            src={sc.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className={styles.ovSide} aria-hidden="true" />
          <div className={styles.ovRadial} aria-hidden="true" />
          <div className={styles.captionWrap} data-reveal>
            <div className={styles.caption}>
              <div className={styles.eyebrow}>
                <span className={styles.no}>{sc.no}</span>
                <span className={styles.line} />
                {sc.kicker}
              </div>
              <h2 className={styles.title}>{sc.title}</h2>
              <p className={styles.body}>{sc.body}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
