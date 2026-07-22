FROM node:22.11.0-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
  && apt-get install --yes --no-install-recommends libatomic1 \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --global --force @pnpm/exe@11.7.0

FROM base AS deps

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi && pnpm db:generate

FROM base AS runner

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm db:deploy && pnpm db:seed && pnpm dev --hostname 0.0.0.0"]
