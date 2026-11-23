"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import styles from "./preview.module.css";

const commands = {
  whoami: ["Clément Poudrée", "Développeur web full-stack à Rennes."],
  stack: ["React · Next.js · TypeScript", "Des prototypes aux applications en production."],
  focus: ["Sécurité applicative", "Je m’intéresse à la conception sécurisée et aux tests défensifs."],
} as const;

type Command = keyof typeof commands;
const commandNames: Command[] = ["whoami", "stack", "focus"];

export default function PocketTerminal() {
  const [command, setCommand] = useState<Command>("whoami");
  const [title, description] = commands[command];

  return (
    <section className={styles.stage} aria-labelledby="terminal-title">
      <div className={styles.orbital} aria-hidden="true">
        <div className={styles.orbit} />
        <div className={styles.innerOrbit} />
        <div className={styles.satellite} />
        <div className={styles.promptTile}>
          <Terminal size={72} strokeWidth={1.6} />
        </div>
      </div>

      <div className={styles.console}>
        <div className={styles.consoleHeader}>
          <span className={styles.indicator} aria-hidden="true" />
          <h2 id="terminal-title">Terminal de poche</h2>
        </div>

        <div className={styles.result} role="status">
          <p className={styles.command}><span aria-hidden="true">$ </span>{command}</p>
          <p className={styles.resultTitle}>{title}</p>
          <p className={styles.resultDescription}>{description}</p>
        </div>

        <div className={styles.commands} role="group" aria-label="Commandes du terminal">
          {commandNames.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === command}
              onClick={() => setCommand(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
