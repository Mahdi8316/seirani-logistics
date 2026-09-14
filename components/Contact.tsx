import { getContact } from "@/lib/content";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";

export default async function Contact() {
  const info = await getContact();

  return (
    <section className={styles.section} aria-labelledby="contact-title">
      <div className={styles.wrap}>
        <div className={styles.info} data-reveal>
          <div className={styles.eyebrow}>
            <span className={styles.line} />
            {info.eyebrow}
          </div>
          <h2 id="contact-title" className={styles.title}>
            {info.title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className={styles.lead}>{info.lead}</p>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.rowDot} aria-hidden="true" />
              {info.address}
            </div>
            <a className={styles.row} dir="ltr" href={`tel:${info.phoneHref}`}>
              <span className={styles.rowDot} aria-hidden="true" />
              {info.phoneDisplay}
            </a>
            <a className={styles.row} dir="ltr" href={`mailto:${info.email}`}>
              <span className={styles.rowDot} aria-hidden="true" />
              {info.email}
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
