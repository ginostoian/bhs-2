"use client";

import { useState } from "react";
import styles from "./prices.module.css";

const URL = "https://bhstudio.co.uk/prices";
const TITLE = "London renovation prices 2026";

// Share and cite controls so the page is easy to pass on, quote or link to.
export default function ShareTools({ citation, showCite = false }) {
  const [copied, setCopied] = useState("");
  const copy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: TITLE, url: URL });
      } catch {}
    } else {
      copy(URL, "link");
    }
  };
  const enc = encodeURIComponent;

  return (
    <>
      <div className={styles.share}>
        <span className={styles.shareLabel}>Share this price guide:</span>
        <button type="button" onClick={share}>
          Share
        </button>
        <button type="button" onClick={() => copy(URL, "link")}>
          {copied === "link" ? "Link copied" : "Copy link"}
        </button>
        <a href={`https://wa.me/?text=${enc(`${TITLE}: ${URL}`)}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(URL)}`} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`https://x.com/intent/post?url=${enc(URL)}&text=${enc(TITLE)}`} target="_blank" rel="noopener noreferrer">
          X
        </a>
        <a href={`mailto:?subject=${enc(TITLE)}&body=${enc(`Worth a look before you get quotes: ${URL}`)}`}>Email</a>
      </div>
      {showCite ? (
        <div className={styles.cite}>
          <strong>Quoting these prices?</strong>
          <code>{citation}</code>
          <div className={styles.share}>
            <button type="button" onClick={() => copy(citation, "cite")}>
              {copied === "cite" ? "Citation copied" : "Copy citation"}
            </button>
            <a href="/assets/prices/london-renovation-prices-2026.png" download>
              Download the summary chart
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
