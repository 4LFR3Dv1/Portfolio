# Renan Melo — Portfolio

Personal portfolio and editorial surface.

## Public product

The main portfolio remains a React/Vite application. Astro is used only as the static publication engine under `/editorial/*`.

```text
/
├── selected work
├── architecture
├── about
└── contact

/editorial/
├── current studies
└── published essays
```

The public-language rule is simple: explain the idea before introducing technical vocabulary. Repository/governance language is not used as a substitute for explanation, and the existence of a project in GitHub does not imply that it belongs on the public site.

## Build

```bash
npm ci
npm run verify
npm run build:composed
```

`build:composed` builds the Vite portfolio, builds the Astro editorial publication into `dist/editorial/`, and then generates social preview images from the final publication metadata.

## Social metadata

The root portfolio has current Open Graph and Twitter metadata with a generated `1200×627` fallback image at `/og.png`.

The Editorial index has its own generated image at:

```text
/editorial/og/editorial.png
```

Every published essay emits individual metadata and an individual social card:

```text
/editorial/<slug>/
/editorial/og/<slug>.png
```

Article pages include canonical URL, `og:type=article`, title, description, publication time, author, section, topic tags, image dimensions/alt text, Twitter large-card metadata and a LinkedIn share action. Social PNGs are generated deterministically during the composed build rather than maintained manually.

## Preview

The isolated successor preview is served from Railway. Production DNS and `renan.snelabs.space` are intentionally outside the scope of this branch until an explicit cutover decision.
