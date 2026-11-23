"use client";

import { useState } from "react";
import { AppWindow, Database, Server } from "lucide-react";
import styles from "./HeroSection.module.css";

const stages = [
  {
    label: "Browser",
    icon: AppWindow,
    topic: "Trust boundary",
    description: "The browser sends a request. The application treats any input from it as untrusted.",
  },
  {
    label: "Application",
    icon: Server,
    topic: "Access control",
    description: "The server checks who is making the request and whether they can access the resource.",
  },
  {
    label: "Database",
    icon: Database,
    topic: "Data access",
    description: "The application queries the database using a limited account and returns the permitted data.",
  },
] as const;

export default function RequestTrace() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <div className={styles.trace} aria-labelledby="trace-title" role="group">
      <h2 className={styles.traceTitle} id="trace-title">Trace a web request</h2>
      <div className={styles.map}>
        <div className={styles.nodes} role="group" aria-label="Request stages">
          {stages.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              className={styles.node}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className={styles.nodeIcon}><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.readout} aria-live="polite">
        <p className={styles.topic}>{stage.topic}</p>
        <p>{stage.description}</p>
      </div>
    </div>
  );
}
