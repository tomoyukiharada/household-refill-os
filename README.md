# Household Refill OS

家庭内の買い物リストと補充判断を軽くするためのローカルWebアプリです。

## Phase 0

このリポジトリはPhase 0として、DB、認証、OpenAI APIを使わない静的なスマホファーストUIを実装しています。

## 起動

```bash
pnpm install
pnpm dev
```

確認URL:

```text
http://localhost:3000
```

Docker Composeでも起動できます。

```bash
docker compose up
```

## 確認

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

## 次のPhase

Phase 1ではAuth.js、Credentials Provider、User/Household/HouseholdMemberのDBスキーマ、初期owner seed、ログイン画面を追加します。
