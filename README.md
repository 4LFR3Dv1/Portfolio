# Renan Melo — Portfolio

Public portfolio for Renan Melo, a blockchain and agentic systems engineer building financial products, real-time runtimes, AI agent platforms, and developer tooling.

## Product surfaces

- Landing page with English and Portuguese content.
- Shareable case-study routes under `/work/:projectId`.
- Architecture explorer under `/architecture`.
- Public evidence room linking to deployments, repositories, endpoints, and documents.
- Vercel Analytics and SPA rewrites.

## Featured work

- **VIRA** — synchronized multiplayer football with authoritative state and deterministic replay.
- **XS Wallet / Domini R&D** — public pre-beta self-custody codebase across Bitcoin, Liquid, and Lightning; no public release.
- **Agentic Systems & Foundry** — operational control planes for agents, review, and evidence.
- **SNE OS** — public sovereign-account product surface.
- **VERIFY SYSTEMS** — technical publication about verifiable and reconcilable systems.

Visibility labels follow the current public evidence surface. Private projects are described at architectural level and are never presented as publicly auditable; public source is not presented as a production release.

## Stack

- React 18 and TypeScript
- Vite and Tailwind CSS
- Mermaid loaded on demand with strict rendering
- Vitest and ESLint
- Vercel Analytics

## Local development

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run verify
```

The verification gate runs strict TypeScript checks, lint, tests, and the production build. The same gate runs in GitHub Actions for pushes and pull requests.

## Public links

- Portfolio: [renan.snelabs.space](https://renan.snelabs.space)
- GitHub: [4LFR3Dv1](https://github.com/4LFR3Dv1)
- LinkedIn: [renan-melo-connexions](https://linkedin.com/in/renan-melo-connexions)
