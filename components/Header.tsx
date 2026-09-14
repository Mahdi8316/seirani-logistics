import Image from "next/image";
import { navLinks } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import styles from "./Header.module.css";

/**
 * hrefBase: در صفحه‌ی اصلی خالی است (لنگرهای هم‌صفحه‌ای مثل #services).
 * در زیرصفحه‌ها «/» تا لینک‌ها ابتدا به خانه بروند و سپس به بخش (/#services).
 */
export default function Header({ hrefBase = "" }: { hrefBase?: string }) {
  return (
    <header className={styles.header}>
      <a
        href={`${hrefBase}#hero`}
        className={styles.logoLink}
        aria-label={`${siteConfig.name} — خانه`}
      >
        <Image
          src="/assets/logo.jpg"
          alt={siteConfig.name}
          width={38}
          height={38}
          priority
          className={styles.logo}
        />
      </a>
      <nav className={styles.nav} aria-label="ناوبری اصلی">
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={`${hrefBase}${link.href}`}
            className={i === 0 && hrefBase === "" ? styles.navLinkActive : styles.navLink}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a href={`${hrefBase}#contact`} className={styles.cta}>
        درخواست مشاوره
      </a>
    </header>
  );
}
