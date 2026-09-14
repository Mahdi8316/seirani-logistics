import { getNodes, getNetworkHeader } from "@/lib/content";
import styles from "./Network.module.css";

const PATH = "M 60 210 C 220 120, 360 250, 500 170 S 780 90, 940 130";

export default async function Network() {
  const [header, nodes] = await Promise.all([getNetworkHeader(), getNodes()]);

  return (
    <section id="network" className={styles.section} aria-labelledby="network-title">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <div className={styles.eyebrow}>
            <span className={styles.line} />
            {header.eyebrow}
          </div>
          <h2 id="network-title" className={styles.title}>
            {header.title}
          </h2>
          <p className={styles.lead}>{header.lead}</p>
        </div>

        <div className={styles.panel} data-reveal>
          <div className={styles.gridBackdrop} aria-hidden="true" />
          <div className={styles.panelInner}>
            <svg
              viewBox="0 0 1000 300"
              className={styles.map}
              role="img"
              aria-label="نقشه‌ی کریدور زمینی از تهران تا اروپا"
            >
              <path d={PATH} fill="none" stroke="oklch(0.3 0.01 250)" strokeWidth={2} />
              <path
                d={PATH}
                fill="none"
                stroke="oklch(0.84 0.075 74)"
                strokeWidth={2.5}
                strokeDasharray="10 12"
                className={styles.dash}
              />
              <circle r={7} fill="oklch(0.9 0.06 78)" className={styles.convoy}>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            <div className={styles.nodes}>
              {nodes.map((nd) => (
                <div key={nd.id ?? nd.city} className={styles.node}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.city}>{nd.city}</span>
                  <span className={styles.tag}>{nd.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
