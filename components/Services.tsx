import { getServices, getServicesHeader } from "@/lib/content";
import styles from "./Services.module.css";

export default async function Services() {
  const [header, services] = await Promise.all([
    getServicesHeader(),
    getServices(),
  ]);

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <div className={styles.eyebrow}>
            <span className={styles.line} />
            {header.eyebrow}
          </div>
          <h2 id="services-title" className={styles.title}>
            {header.title}
          </h2>
          <p className={styles.lead}>{header.lead}</p>
        </div>

        <div className={styles.grid}>
          {services.map((sv) => (
            <article key={sv.id ?? sv.no} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} aria-hidden="true">
                  {sv.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className={styles.iconImg} src={sv.icon} alt="" />
                  ) : (
                    <span className={styles.glyph} />
                  )}
                </div>
                <span className={styles.index}>{sv.no}</span>
              </div>
              <h3 className={styles.cardTitle}>{sv.title}</h3>
              <p className={styles.cardBody}>{sv.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
