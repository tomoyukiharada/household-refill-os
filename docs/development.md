# Development Guide

このガイドは開発者向けです。

## セットアップ

```bash
cp .env.example .env.local
pnpm install
pnpm setup
pnpm dev
```

## 環境変数

```bash
DATABASE_URL="file:../data/app.db"
AUTH_SECRET="replace-me"
APP_BASE_URL="http://localhost:3000"
INITIAL_OWNER_EMAIL="owner@example.local"
INITIAL_OWNER_PASSWORD="change-me"
INITIAL_HOUSEHOLD_NAME="Home"
```

`DATABASE_URL` は `prisma/schema.prisma` 基準の相対パスです。`file:../data/app.db` はリポジトリ直下の `data/app.db` を指します。

## DB操作

Prisma Client生成:

```bash
pnpm db:generate
```

migration適用:

```bash
pnpm db:deploy
```

開発用migration作成:

```bash
pnpm db:migrate --name <name>
```

初期owner作成:

```bash
pnpm db:seed
```

## 認証まわりの実装場所

- `lib/auth/options.ts`: NextAuth設定
- `lib/auth/session.ts`: server-side session helper
- `lib/auth/schema.ts`: credentials validation
- `app/api/auth/[...nextauth]/route.ts`: NextAuth Route Handler
- `app/(app)/layout.tsx`: 認証済みlayout
- `app/(auth)/login/page.tsx`: login page

## seedの方針

`prisma/seed.ts` はidempotentです。

- ownerが存在しない場合は作成する
- ownerが既に存在する場合はパスワードを上書きしない
- owner membershipがなければ家庭を作ってownerにする

## テスト

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

Playwrightは `data/e2e.db` を使います。

## Docker

```bash
docker compose build
docker compose up
```

Composeは起動時にmigrationとseedを実行します。`INITIAL_OWNER_PASSWORD` を変えたい場合は、shell環境変数または `.env` で指定してください。

## Phase 2で触る場所

Phase 2では以下を追加する予定です。

- `Product`
- `InventoryItem`
- `Store`
- `ShoppingList`
- `ShoppingListItem`
- 買い物リスト追加/チェック保存
- 残量更新

DBアクセス時は必ず `session.user.householdId` を使い、家庭ごとのデータ分離を守ります。
