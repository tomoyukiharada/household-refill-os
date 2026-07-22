# Development Guide

このガイドは開発者向けです。Household Refill OSでは、開発・検証コマンドをDocker内で実行することを標準にします。ホスト側にNode.js、pnpm、`node_modules` を用意する必要はありません。

## 基本方針

- 通常起動は `docker compose up`
- 検証コマンドは `docker compose run --rm --no-deps app ...`
- E2Eは `docker compose run --rm e2e`
- `.env` はDocker Compose用
- `.env.local` はホストNode.jsで直接動かす場合だけ使用
- `node_modules` と `.next` はDocker named volumeに置く
- `./data/app.db` はアプリデータとしてホストに残す

## 初回セットアップ

```bash
cp .env.example .env
docker compose build
docker compose up
```

`http://localhost:3000` を開き、seed ownerでログインします。

```text
email: owner@example.local
password: change-me
```

実運用前に `.env` の `AUTH_SECRET` と `INITIAL_OWNER_PASSWORD` は必ず変更してください。既にDBがある場合、seedは既存ownerのパスワードを上書きしません。

## 環境変数

```bash
DATABASE_URL="file:../data/app.db"
AUTH_SECRET="replace-me"
APP_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
INITIAL_OWNER_EMAIL="owner@example.local"
INITIAL_OWNER_PASSWORD="change-me"
INITIAL_HOUSEHOLD_NAME="Home"
```

`DATABASE_URL` は `prisma/schema.prisma` 基準の相対パスです。`file:../data/app.db` はリポジトリ直下の `data/app.db` を指します。

Docker Composeは `.env` を使って環境変数を展開します。`.env.local` はNext.jsのローカル実行用ファイルなので、Docker運用では必須ではありません。

## よく使うDockerコマンド

| 目的 | コマンド |
|---|---|
| アプリ起動 | `docker compose up` |
| イメージ再ビルド | `docker compose build` |
| 型チェック | `docker compose run --rm --no-deps app pnpm typecheck` |
| lint | `docker compose run --rm --no-deps app pnpm lint` |
| Next.js build | `docker compose run --rm --no-deps app pnpm build` |
| Prisma Client生成 | `docker compose run --rm --no-deps app pnpm db:generate` |
| migration適用 | `docker compose run --rm --no-deps app pnpm db:deploy` |
| seed実行 | `docker compose run --rm --no-deps app pnpm db:seed` |
| E2Eイメージ作成 | `docker compose build e2e` |
| E2E | `docker compose run --rm e2e` |

`app` サービスの `node_modules` と `.next` はnamed volumeです。ホストのリポジトリには依存ファイルを作りません。

同じ `app_node_modules` volumeを共有するため、pnpmを使う検証コマンドは並列実行しないでください。`typecheck`, `lint`, `build` は順番に実行します。

## DB操作

Prisma Client生成:

```bash
docker compose run --rm --no-deps app pnpm db:generate
```

migration適用:

```bash
docker compose run --rm --no-deps app pnpm db:deploy
```

開発用migration作成:

```bash
docker compose run --rm --no-deps app pnpm db:migrate --name <name>
```

初期owner作成:

```bash
docker compose run --rm --no-deps app pnpm db:seed
```

SQLite DBは通常起動では `./data/app.db` に保存されます。E2Eはコンテナ内の一時ファイルシステムを使うため、実行ごとに初期化され、通常のアプリDBを壊しません。

## 認証まわりの実装場所

- `lib/auth/options.ts`: NextAuth設定
- `lib/auth/session.ts`: server-side session helper
- `lib/auth/schema.ts`: credentials validation
- `app/api/auth/[...nextauth]/route.ts`: NextAuth Route Handler
- `app/(app)/layout.tsx`: 認証済みlayout
- `app/(auth)/login/page.tsx`: login page
- `components/auth/LoginForm.tsx`: login form
- `components/auth/LogoutButton.tsx`: logout button
- `types/next-auth.d.ts`: session/JWT型拡張

サーバー側でログイン必須の処理を書く場合は、`requireAppSession()` を通して `userId`, `householdId`, `role` を取得します。Phase 2以降のDBアクセスでは、必ず `householdId` をwhere条件に含めます。

## seedの方針

`prisma/seed.ts` はidempotentです。

- ownerが存在しない場合は作成する
- ownerが既に存在する場合はパスワードを上書きしない
- owner membershipがなければ家庭を作ってownerにする
- 初期家庭名は `INITIAL_HOUSEHOLD_NAME` を使う

初期パスワードを変えてやり直したい場合は、既存DBをバックアップまたは削除してからseedを再実行します。

## テストと検証

変更後に最低限確認するコマンド:

```bash
docker compose run --rm --no-deps app pnpm typecheck
docker compose run --rm --no-deps app pnpm lint
docker compose run --rm --no-deps app pnpm build
docker compose run --rm e2e
```

E2EはPlaywright公式イメージをベースにした `Dockerfile.e2e` を使います。初回は `mcr.microsoft.com/playwright:v1.49.1-noble` のpullとE2Eイメージ作成、pnpm依存インストールが走ります。依存はDocker volumeに残るため、2回目以降は短くなります。

```bash
docker compose build e2e
docker compose run --rm e2e
```

Corepack署名キーや実行時ダウンロードに依存しないよう、開発・本番・E2Eの各イメージでは `npm install --global --force @pnpm/exe@11.7.0` でpnpmをビルド時に入れます。

## 依存関係の追加

ホストで `pnpm add` は実行しません。依存追加もDocker内で行います。

```bash
docker compose run --rm --no-deps app pnpm add <package>
docker compose run --rm --no-deps app pnpm add -D <package>
```

この操作で変更されるソース管理対象は `package.json` と `pnpm-lock.yaml` です。`node_modules` はDocker volume側に作られます。依存追加後は `docker compose build` でイメージを更新します。

## Docker構成

`app` サービス:

- `Dockerfile` からビルド
- Next.js dev serverを `0.0.0.0:3000` で起動
- `./data:/app/data` をマウントしてSQLite DBを保持
- `app_node_modules` と `app_next` named volumeを使用

`e2e` サービス:

- `Dockerfile.e2e` でPlaywright公式イメージを拡張
- pnpmはCorepackではなく `@pnpm/exe` をnpm経由で事前インストール
- `test` profile配下なので通常の `docker compose up` では起動しない
- `e2e_node_modules`, `e2e_next`, `e2e_pnpm_store` named volumeを使用
- E2E用DBは `/app/data` の一時ファイルシステムに置き、実行ごとに初期化
- 通常の `./data/app.db` とは別のDBでテストする

## Phase 2の実装場所

- `prisma/schema.prisma`: Product / InventoryItem / Store / ShoppingList / ShoppingListItem
- `lib/household-data.ts`: 家庭境界付きの画面用クエリ
- `app/(app)/actions.ts`: 追加、チェック、残量更新のServer Actions
- `prisma/seed.ts`: 初期店舗・商品・在庫・買い物リスト

DBアクセスでは `session.user.householdId` を使い、読み取りだけでなく作成・更新でも家庭境界を守ります。フォームからhouseholdIdを送信する設計にはしません。

## 本番相当の起動

自宅サーバー用の本番イメージをローカルで確認する場合は次を使います。

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

必要な環境変数と運用手順は[Self-hosting Guide](self-hosting.md)を参照してください。
