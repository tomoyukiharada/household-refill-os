# Household Refill OS

家庭内の買い物リストと補充判断を軽くするためのローカルWebアプリです。

日本語UI上の表示名は「お買い物リスト」です。

## 現在の実装範囲

Phase 1まで実装済みです。

- Next.js App Router + TypeScript + Tailwind CSS
- スマホファーストの買い物UI
- 今日買う / いつもの / 残量 / 設定
- Auth.js / NextAuth Credentials認証
- Prisma + SQLite
- 初期owner seed
- 未ログイン時のログイン画面リダイレクト
- ログアウト
- Docker Compose起動
- Playwright E2E

まだPhase 2の永続化CRUDは未実装です。買い物リスト、定番品、残量画面の表示データは引き続きモックです。

## 必要なもの

- Node.js 20.19以上
- pnpm 11系
- Docker Desktop または Docker Engine

Prisma 6系を使っているため、SQLite URLは `prisma/schema.prisma` から見た相対パスです。プロジェクト直下の `data/app.db` を使う場合は、次のように `../data` を指定します。

```bash
DATABASE_URL="file:../data/app.db"
```

## 初回セットアップ

```bash
cp .env.example .env.local
pnpm install
pnpm setup
pnpm dev
```

確認URL:

```text
http://localhost:3000
```

初期ログイン:

```text
email: owner@example.local
password: change-me
```

実運用前に `.env.local` の `AUTH_SECRET` と `INITIAL_OWNER_PASSWORD` は必ず変更してください。

## Docker Compose

```bash
docker compose build
docker compose up
```

Compose起動時に以下を実行します。

1. Prisma Client生成
2. migration適用
3. 初期owner seed
4. Next.js dev server起動

SQLite DBは `./data/app.db` に保存されます。`data/` はGit管理しません。

## よく使うコマンド

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm db:generate
pnpm db:deploy
pnpm db:migrate
pnpm db:seed
pnpm setup
pnpm test:e2e
```

## ドキュメント

- [Architecture](docs/architecture.md)
- [User Guide](docs/user-guide.md)
- [Development Guide](docs/development.md)

## フェーズ計画

次に進むならPhase 2です。

- Product / InventoryItem / Store / ShoppingList / ShoppingListItem
- 買い物リスト追加
- チェック状態保存
- 残量更新
- householdIdによるデータ分離
