import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer({ hrefBase = "" }: { hrefBase?: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Image
          src="/assets/logo.jpg"
          alt={siteConfig.name}
          width={32}
          height={32}
          className={styles.logo}
        />
        <span className={styles.copy}>© ۱۴۰۴ — تمامی حقوق محفوظ است</span>
      </div>
      <nav className={styles.links} aria-label="ناوبری پاورقی">
        <a href={`${hrefBase}#services`}>خدمات</a>
        <Link href="/blog">مقالات</Link>
        <a href={`${hrefBase}#contact`}>تماس</a>
      </nav>
    </footer>
  );
}
