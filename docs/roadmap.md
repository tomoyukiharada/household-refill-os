# Development Roadmap

Household Refill OSは、家庭の補充判断を「記憶に頼らず、買い物中に迷わない」状態へ段階的に育てます。各Phaseは前段のデータと運用を壊さずに追加します。

## Phase 1: アプリ基盤（完了）

- Next.js App Router / TypeScript / Tailwind CSS
- スマホファーストの「今日買う」「いつもの」「残量」「設定」画面
- Auth.js Credentials認証とowner seed
- User / Household / HouseholdMember
- SQLite / Prisma migration
- Docker Compose開発環境とPlaywright E2E

## Phase 2: 家庭データの永続化（完了）

- Product / InventoryItem / Store / ShoppingList / ShoppingListItem
- 定番品の登録と一覧表示
- 定番品・在庫画面から今日の買い物への追加
- 自由入力による買い物項目追加
- 購入済み状態の保存と再読込後の復元
- 在庫レベル（十分 / 少ない / 空 / 未確認）の更新
- 認証セッション由来のhouseholdIdによる読み書きの分離
- 既存家庭にも安全に適用できるmigrationとidempotent seed

Phase 2では日常利用に必要な中核操作を優先しています。商品・店舗の名称変更、削除、買い物履歴のアーカイブは以降の管理機能で追加します。

## Phase 3: 補充支援

- 買い忘れと残量低下の通知
- 購入間隔・消費傾向からの補充候補
- 買い物リストの履歴と再利用
- 商品・店舗の編集、削除、並び替え
- owner/memberの操作権限を画面とServer Actionに反映

## Phase 4: 家庭内運用品質

- PWA対応とホーム画面追加
- オフライン時の閲覧・更新戦略
- DBバックアップ / 復元支援
- ヘルスチェック、ログ、更新手順の改善
- 複数端末での競合や同時更新の扱い

## 将来候補

- AIによる商品名・カテゴリ・数量候補
- レシートやバーコードからの入力補助
- 外部通知サービスとの連携
- LAN外公開が必要になった場合の認証・TLS・監査強化

将来候補は方向性であり、実装順は家庭内での利用結果を見て調整します。
