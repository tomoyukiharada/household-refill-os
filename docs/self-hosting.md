# Self-hosting Guide

このガイドは、家庭内LANの自宅サーバーでHousehold Refill OSを常時起動する手順です。標準構成はDocker Compose、SQLite、LAN内HTTPです。

## 前提

- Linux等の常時稼働サーバー
- Docker EngineとDocker Compose v2
- Git
- サーバー上の永続ディスク
- 同一LAN内の端末から到達できる固定IP、またはDHCP予約

LAN外へポートを公開しないでください。外出先から使う場合は、直接ポート開放するのではなくVPNを利用するか、TLS・アクセス制御を含む別途のセキュリティ設計を行います。

## 初回デプロイ

リポジトリを取得し、設定ファイルを作ります。

```bash
git clone <repository-url> household-refill-os
cd household-refill-os
cp .env.example .env
```

`.env` の最低限の例です。`192.168.1.20` は自宅サーバーのIPに置き換えてください。

```dotenv
AUTH_SECRET="十分に長いランダム文字列"
APP_BASE_URL="http://192.168.1.20:3000"
NEXTAUTH_URL="http://192.168.1.20:3000"
APP_PORT="3000"
INITIAL_OWNER_EMAIL="owner@example.local"
INITIAL_OWNER_PASSWORD="長く推測されにくい初期パスワード"
INITIAL_HOUSEHOLD_NAME="Home"
```

`AUTH_SECRET` は次のように生成できます。

```bash
openssl rand -base64 32
```

本番用イメージをビルドして起動します。

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

スマホ等から `http://192.168.1.20:3000` を開き、設定したownerでログインします。起動時にmigrationとseedが自動適用されます。

## 開発用Composeとの違い

`docker-compose.yml` はソースをマウントしてNext.js開発サーバーを起動します。自宅サーバーでは `docker-compose.prod.yml` を使い、ビルド済みNext.jsを `pnpm start` で起動します。DBだけを `./data/app.db` に永続化し、コンテナは再起動可能です。

## 更新

更新前にDBをバックアップし、最新コードを取得して再ビルドします。

```bash
docker compose -f docker-compose.prod.yml stop app
cp data/app.db "data/app.db.backup-$(date +%Y%m%d-%H%M%S)"
docker compose -f docker-compose.prod.yml start app
git pull --ff-only
docker compose -f docker-compose.prod.yml up -d --build
```

migrationは新コンテナ起動時に自動適用されます。`git pull` 前に、ローカル変更がないことを確認してください。

## バックアップと復元

SQLiteファイルを整合した状態で保存するため、コピー中はアプリを停止します。

```bash
docker compose -f docker-compose.prod.yml stop app
cp data/app.db /path/to/backup/app.db
docker compose -f docker-compose.prod.yml start app
```

復元時もアプリを停止し、現在のDBを別名で退避してからバックアップを `data/app.db` に戻します。復元後はログインと主要画面を確認してください。

## ログと稼働確認

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=200 app
```

Composeのhealthcheckは `/login` を確認します。`healthy` にならない場合はログ、`.env` の必須値、`data/` の書き込み権限を確認します。

## LAN内の保護

- ルーターで3000番ポートをインターネットへ転送しない
- サーバーのファイアウォールでは家庭内サブネットだけを許可する
- `.env` と `data/app.db` を共有フォルダやGitへ置かない
- 初期パスワードを使い回さない
- バックアップにも本体と同等のアクセス制御を設定する

HTTPS化や独自ホスト名が必要なら、リバースプロキシを同一サーバーに置き、`APP_BASE_URL` と `NEXTAUTH_URL` を実際のHTTPS URLへ変更します。
