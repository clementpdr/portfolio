import type { Metadata } from "next";
import Link from "next/link";
import PocketTerminal from "./PocketTerminal";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Aperçu du portfolio — Clément Poudrée",
  robots: { index: false },
};

export default function PreviewPage() {
  return (
    <div className={styles.preview} lang="fr">
      <header className={styles.header}>
        <div className={styles.signature}>
          <span className={styles.monogram} aria-hidden="true">cp.</span>
          <span>Clément Poudrée</span>
        </div>
        <Link className={styles.back} href="/">Retour au portfolio</Link>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="preview-title">
          <h1 id="preview-title">Le web,<br /><em>par curiosité.</em></h1>
          <p>Je développe des applications web et j’explore la sécurité applicative.</p>
          <Link className={styles.work} href="/gallery">Voir mes projets</Link>
        </section>

        <PocketTerminal />
      </main>

      <footer className={styles.footer}>
        <span>Rennes, France</span>
        <Link href="/contact">Me contacter</Link>
      </footer>
    </div>
  );
}
