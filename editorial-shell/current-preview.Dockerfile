FROM node:22-bookworm-slim

WORKDIR /app

COPY editorial-shell/package.json editorial-shell/package-lock.json ./editorial-shell/
RUN cd editorial-shell && npm ci

COPY . .
RUN cd editorial-shell && npm run build:current

ENV NODE_ENV=production
ENV PORT=4322
EXPOSE 4322

CMD ["node", "editorial-shell/runtime/current-preview-runtime.mjs"]
