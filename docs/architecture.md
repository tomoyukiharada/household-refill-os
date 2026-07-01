# Architecture

Household Refill OSは、家庭内LANで動かす単一リポジトリのローカルWebアプリです。外部公開SaaSではなく、家庭内の補充判断を軽くする道具として設計します。

## 現在のフェーズ

Phase 1では、静的UIに認証とアプリ骨格を追加しています。

実装済み:

- Next.js App Router
- TypeScript
- Tailwind CSS
- NextAuth Credentials Provider
- Prisma
- SQLite
- User / Household / HouseholdMember
- owner / memberロール
- seedによる初期owner作成
- 認証済みlayout
- Docker Composeによる起動
- Docker内での検証コマンド実行

未実装:

- 商品・在庫・買い物リストの永続化
- CRUD API / Server Actions
- AI補助
- PWA
- 通知
- 細かなロール別UI制御

## ランタイム構成

```text
Browser
  -> Next.js App Router
    -> Auth.js / NextAuth
    -> Server Components / Client Components
    -> Prisma Client
      -> SQLite
```

開発・運用の標準入口はDocker Composeです。

```text
docker compose up
  -> app container
    -> pnpm db:generate
    -> pnpm db:deploy
    -> pnpm db:seed
    -> pnpm dev --hostname 0.0.0.0
```

ホスト側にNode.jsやpnpmを要求しません。依存関係とNext.js build成果物はDocker named volumeに置きます。

## レイヤー構成

```text
app/
  (auth)/
    login/
  (app)/
    page.tsx
    usuals/
    inventory/
    settings/
  api/
    auth/[...nextauth]/

components/
  app-shell/
  auth/
  inventory/
  settings/
  shopping/
  ui/

lib/
  auth/
  db/

prisma/
  schema.prisma
  migrations/
  seed.ts

tests/
  e2e/
```

## ルーティング

`app/(app)/layout.tsx` が認証ガードです。未ログインの場合は `/login` にリダイレクトします。

`app/(auth)/login/page.tsx` はログイン済みユーザーを `/` に戻します。

`app/api/auth/[...nextauth]/route.ts` はNextAuthのRoute Handlerです。

Phase 2以降のアプリ用Route HandlerまたはServer Actionでは、最初に `requireAppSession()` を呼び、家庭境界に必要な `householdId` を取得します。

## 認証

認証はNextAuth v4のCredentials Providerです。

- ログインIDはメールアドレス文字列
- パスワードはbcryptjsでハッシュ検証
- セッション方式はJWT
- JWTとsessionには `userId`, `householdId`, `householdName`, `role` を含める
- 初期ownerはseedで作成する

認証設定は `lib/auth/options.ts` に集約しています。サーバー側でセッションが必要な場合は `lib/auth/session.ts` の `requireAppSession()` を使います。

## データモデル

Phase 1のDBモデルは最小限です。

```mermaid
erDiagram
  User ||--o{ HouseholdMember : has
  Household ||--o{ HouseholdMember : has

  User {
    string id
    string email
    string name
    string passwordHash
    datetime createdAt
    datetime updatedAt
  }

  Household {
    string id
    string name
    datetime createdAt
    datetime updatedAt
  }

  HouseholdMember {
    string id
    string userId
    string householdId
    string role
    datetime createdAt
    datetime updatedAt
  }
```

`HouseholdMember.role` は `owner` / `member` です。Phase 1ではロールの保存と表示までを行い、細かな権限制御はPhase 2以降で追加します。

## householdId境界

このアプリのデータ分離単位は `Household` です。Phase 2以降で追加する `Product`, `InventoryItem`, `Store`, `ShoppingList`, `ShoppingListItem` は、必ず `householdId` を持つ設計にします。

実装ルール:

- DB読み取りでは `where` に `householdId: session.user.householdId` を含める
- DB作成では入力値ではなくsession由来の `householdId` を使う
- URLパラメータやフォーム値の `householdId` を信用しない
- 削除・更新も必ず `householdId` で絞る
- owner/memberの権限制御を追加するときも家庭境界を先に守る

## SQLite配置

Prisma 6ではSQLiteの相対パスが `prisma/schema.prisma` 基準で解釈されます。

そのため、プロジェクト直下のDBを使う設定は次です。

```bash
DATABASE_URL="file:../data/app.db"
```

実体:

```text
./data/app.db
```

`data/` は `.gitignore` 済みです。

## Docker

Dockerはこのプロジェクトの標準開発面です。ホストにpnpmを入れず、コマンドはコンテナ内で実行します。

`Dockerfile` では、依存インストール前に `prisma/` と `prisma.config.ts` をコピーします。これは `@prisma/client` のpostinstallおよび `pnpm db:generate` がschemaを必要とするためです。

`app` サービス:

- `Dockerfile` からビルド
- `.env` の値をComposeが展開
- `./data:/app/data` でSQLite DBを保持
- `app_node_modules:/app/node_modules`
- `app_next:/app/.next`
- `3000:3000` を公開

`e2e` サービス:

- `mcr.microsoft.com/playwright:v1.49.1-noble` を使用
- `profiles: ["test"]` のため通常起動では走らない
- Playwrightブラウザをホストに入れずにE2Eを実行する
- E2E用DBは `e2e_data` volumeに分離する

## 環境変数ファイル

Docker Compose:

```text
.env
```

ホストNode.jsで直接動かす場合:

```text
.env.local
```

このプロジェクトの標準はDocker Composeなので、通常は `.env` だけで足ります。`.env`, `.env.local`, `data/` はコミットしません。

## テスト境界

Phase 1で確認する主な項目です。

- 型チェック
- ESLint
- Next.js build
- 未ログイン時のログイン画面表示
- seed ownerでログインできること
- 認証後に「今日買う」へ入れること
- 買い物リストのチェックUIが動くこと

標準コマンド:

```bash
docker compose run --rm --no-deps app pnpm typecheck
docker compose run --rm --no-deps app pnpm lint
docker compose run --rm --no-deps app pnpm build
docker compose run --rm e2e
```

## セキュリティ境界

- `.env` と `.env.local` はコミットしない
- `AUTH_SECRET` は実運用前に変更する
- seed passwordはハッシュ化して保存する
- seedは既存ownerのパスワードを上書きしない
- アプリ画面は認証済みlayout配下に置く
- Phase 2以降のDBアクセスは必ず `householdId` を条件に含める
- LAN外公開はしない前提
- 外部公開する場合は別途セキュリティレビューを行う

## 次の設計課題

Phase 2で追加する永続化データは、まずServer ActionsまたはRoute Handlersのどちらに寄せるかを決めます。家庭内ローカルアプリとしては、UI密着の操作はServer Actions、外部連携や将来のAPI化が必要な操作はRoute Handlersに分ける方針が自然です。

Phase 2で優先して設計するもの:

- Product / InventoryItem / Store / ShoppingList / ShoppingListItem
- householdIdを含むPrisma schema
- 買い物リスト追加とチェック状態保存
- 残量更新
- 入力validation
- CRUD操作のエラー表示
