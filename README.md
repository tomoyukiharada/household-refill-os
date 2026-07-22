# Household Refill OS

家庭内の買い物リストと補充判断を軽くするためのローカルWebアプリです。

日本語UI上の表示名は「お買い物リスト」です。家庭内LANで動かし、スマホから「今日買うもの」「いつものもの」「残量が少ないもの」をすばやく確認する道具として育てています。

## 現在の実装範囲

Phase 2まで実装済みです。

- Next.js App Router + TypeScript + Tailwind CSS
- スマホファーストの買い物UI
- 今日買う / いつもの / 残量 / 設定
- Auth.js / NextAuth Credentials認証
- Prisma + SQLite
- User / Household / HouseholdMember
- 初期owner seed
- 未ログイン時のログイン画面リダイレクト
- ログアウト
- Docker Compose起動
- Playwright E2E用Dockerサービス
- Product / InventoryItem / Store / ShoppingList / ShoppingListItem
- 定番品と買い物項目の追加
- 買い物チェック状態と残量レベルの永続化
- householdIdによる家庭データの分離
- 自宅サーバー向け本番Docker Compose

## 必要なもの

Dockerで開発・起動する前提です。ローカルにNode.jsやpnpmをインストールする必要はありません。

- Docker Desktop または Docker Engine
- Git

pnpmはDockerイメージ内へ固定バージョンを事前インストールします。`node_modules` と `.next` はDocker named volumeに置くため、ホスト側に依存ファイルは作りません。

## 初回セットアップ

Docker Composeは `.env` を読みます。まずサンプルをコピーし、少なくとも `AUTH_SECRET` と `INITIAL_OWNER_PASSWORD` を変更してください。

```bash
cp .env.example .env
docker compose build
docker compose up
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

`INITIAL_OWNER_PASSWORD` はseed時だけ使われます。既にDBが作成済みの場合、seedは既存ownerのパスワードを上書きしません。

## Docker Composeの動き

通常起動では `app` サービスが次を実行します。

1. Prisma Client生成
2. migration適用
3. 初期owner seed
4. Next.js dev server起動

SQLite DBは `./data/app.db` に保存されます。`data/` はGit管理しません。

## Docker内で使うコマンド

ローカルで `pnpm install` は実行しません。開発コマンドは次のようにDocker内で実行します。

```bash
docker compose run --rm --no-deps app pnpm typecheck
docker compose run --rm --no-deps app pnpm lint
docker compose run --rm --no-deps app pnpm build
docker compose run --rm --no-deps app pnpm db:generate
docker compose run --rm --no-deps app pnpm db:deploy
docker compose run --rm --no-deps app pnpm db:seed
```

同じ `app_node_modules` volumeを使うため、これらのpnpmコマンドは並列ではなく順番に実行してください。

E2EはPlaywright公式イメージを使う `e2e` サービスで実行します。初回はイメージ取得と依存インストールに時間がかかります。

```bash
docker compose build e2e
docker compose run --rm e2e
```

E2Eサービスは `Dockerfile.e2e` でpnpmを事前に入れます。Playwright公式イメージ内のCorepack署名キーが古い場合でも、`Cannot find matching keyid` で止まらないようにしています。

## 環境変数

Docker Composeで使う値は `.env` に置きます。Next.jsをホストのNode.jsで直接動かす場合だけ `.env.local` を使います。

重要な値:

- `DATABASE_URL`: Prisma schema基準のSQLite URL。標準は `file:../data/app.db`
- `AUTH_SECRET`: NextAuthの署名用secret。実運用前に必ず変更
- `APP_BASE_URL`: アプリ自身のURL。標準は `http://localhost:3000`
- `NEXTAUTH_URL`: NextAuthが使うURL。標準は `http://localhost:3000`
- `INITIAL_OWNER_EMAIL`: 初期ownerのメールアドレス
- `INITIAL_OWNER_PASSWORD`: 初期ownerの初回パスワード
- `INITIAL_HOUSEHOLD_NAME`: 初期家庭名

## ドキュメント

- [Development Roadmap](docs/roadmap.md): Phaseごとの到達点と今後の方向性
- [User Guide](docs/user-guide.md): 家庭内での基本操作
- [Development Guide](docs/development.md): 開発環境、DB操作、テスト
- [Architecture](docs/architecture.md): 構成、データ境界、設計判断
- [Self-hosting Guide](docs/self-hosting.md): 自宅サーバーへのデプロイ、更新、バックアップ

## 次のフェーズ

Phase 3では、通知、補充提案、買い物履歴、商品・店舗の管理機能を予定しています。詳しくは[Development Roadmap](docs/roadmap.md)を参照してください。
