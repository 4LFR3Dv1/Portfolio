FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY editorial-shell/package.json editorial-shell/package-lock.json ./editorial-shell/
RUN npm ci --prefix editorial-shell --ignore-scripts

COPY . .
RUN npm run build:composed

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=build /app/dist ./dist
COPY editorial-shell/runtime/composed-preview-runtime.mjs ./editorial-shell/runtime/composed-preview-runtime.mjs

EXPOSE 8080
CMD ["node", "editorial-shell/runtime/composed-preview-runtime.mjs"]
