import type {
  InventoryItem,
  SettingsSection,
  ShoppingItem,
  UsualProduct
} from "@/lib/types";

export const mockShoppingItems: ShoppingItem[] = [
  {
    id: "1",
    title: "牛乳",
    quantity: 1,
    unit: "本",
    store: "マルエツ",
    priority: "normal",
    status: "active",
    note: "低脂肪ではないもの"
  },
  {
    id: "2",
    title: "トイレットペーパー",
    quantity: 1,
    unit: "パック",
    store: "Amazon",
    priority: "high",
    status: "active",
    note: "残り2ロール"
  },
  {
    id: "3",
    title: "卵",
    quantity: 1,
    unit: "パック",
    store: "マルエツ",
    priority: "normal",
    status: "checked",
    note: ""
  },
  {
    id: "4",
    title: "食器用洗剤",
    quantity: 1,
    unit: "本",
    store: "ドラッグストア",
    priority: "low",
    status: "active",
    note: "詰め替え用"
  }
];

export const mockUsualProducts: UsualProduct[] = [
  {
    id: "usual-1",
    name: "牛乳",
    category: "食品",
    defaultStore: "マルエツ",
    defaultQuantity: "1本",
    level: "low",
    nextRefill: "2日後"
  },
  {
    id: "usual-2",
    name: "トイレットペーパー",
    category: "日用品",
    defaultStore: "Amazon",
    defaultQuantity: "1パック",
    level: "empty",
    nextRefill: "今日"
  },
  {
    id: "usual-3",
    name: "洗濯洗剤",
    category: "洗濯",
    defaultStore: "楽天",
    defaultQuantity: "1袋",
    level: "enough",
    nextRefill: "12日後"
  },
  {
    id: "usual-4",
    name: "卵",
    category: "食品",
    defaultStore: "マルエツ",
    defaultQuantity: "1パック",
    level: "unknown",
    nextRefill: "未確認"
  }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "inventory-1",
    name: "トイレットペーパー",
    category: "日用品",
    store: "Amazon",
    remaining: "残り2ロール",
    level: "empty",
    estimatedRunout: "今日"
  },
  {
    id: "inventory-2",
    name: "牛乳",
    category: "食品",
    store: "マルエツ",
    remaining: "残り少し",
    level: "low",
    estimatedRunout: "明日"
  },
  {
    id: "inventory-3",
    name: "食器用洗剤",
    category: "キッチン",
    store: "ドラッグストア",
    remaining: "残り1/4",
    level: "low",
    estimatedRunout: "3日後"
  },
  {
    id: "inventory-4",
    name: "洗濯洗剤",
    category: "洗濯",
    store: "楽天",
    remaining: "十分",
    level: "enough",
    estimatedRunout: "12日後"
  }
];

export const mockSettingsSections: SettingsSection[] = [
  {
    id: "settings-auth",
    title: "認証",
    summary: "メールアドレスまたはユーザー名でログイン",
    phase: "Phase 1",
    icon: "auth"
  },
  {
    id: "settings-members",
    title: "家族メンバー",
    summary: "ownerとmemberのロール管理",
    phase: "Phase 1",
    icon: "members"
  },
  {
    id: "settings-notifications",
    title: "通知",
    summary: "補充候補と買い忘れの通知設定",
    phase: "Phase 3+",
    icon: "notifications"
  }
];
