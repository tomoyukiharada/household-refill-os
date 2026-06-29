FROM node:22-alpine AS deps

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

FROM node:22-alpine AS runner

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
