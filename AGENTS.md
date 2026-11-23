<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Orchestration

- Handle small, cohesive changes directly. For complex work, the orchestrator owns the requirements, execution plan, integration, and final validation. Delegate when specialization or independent parallel work improves cost, speed, or quality.
- Use `explorer` for targeted investigation when entry points or dependencies are unclear. Reuse its findings in a short plan before assigning independent work to `frontend`, `backend`, or `docs`.
- Give each agent only the relevant paths, existing findings, acceptance criteria, and an explicit list of files it may edit. Run at most four subagents concurrently. Assign one writer per file. Serialize changes to shared interfaces or isolate conflicting edits and integrate them explicitly. Agents report to the orchestrator and do not spawn further agents.
- Use the configured role models. Reserve Astra for orchestration and complex reasoning, Sol for implementation and review, and Luna for focused exploration, documentation, and routine validation. If a role model is unavailable, surface the issue before using a more expensive model.
- Have `tester` validate the integrated changes and `reviewer` examine them for regressions and security issues when the scope warrants it. The orchestrator resolves findings, reruns affected checks, and reports the outcome and any remaining verification gaps.

## Repository conventions

- Follow the App Router conventions and preserve React server and client boundaries. Reuse components in `components/`, follow `DESIGN.md` for UI work, and preserve frontmatter in `content/projects/`.
- Run targeted ESLint checks for changed source files. Use `npm run lint` for broad changes and `npm run build` for changes that affect routing, rendering, or production compilation. For UI changes, verify the affected interaction, keyboard access, and relevant viewport sizes.
- Validate input at server boundaries. Keep credentials server-side and out of agent prompts, logs, and diffs. Use synthetic data or mocks for Resend checks and avoid live sends during validation.
