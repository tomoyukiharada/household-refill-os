export type Priority = "low" | "normal" | "high";
export type ShoppingStatus = "active" | "checked" | "skipped";
export type ProductLevel = "enough" | "low" | "empty" | "unknown";

export type ShoppingItem = {
  id: string;
  title: string;
  quantity: number;
  unit: string;
  store: string;
  priority: Priority;
  status: ShoppingStatus;
  note: string;
};

export type UsualProduct = {
  id: string;
  name: string;
  category: string;
  defaultStore: string;
  defaultQuantity: string;
  level: ProductLevel;
  nextRefill: string;
};

export type InventoryItem = {
  id: string;
  productId: string;
  name: string;
  category: string;
  store: string;
  remaining: string;
  level: ProductLevel;
  estimatedRunout: string;
};

export type SettingsSection = {
  id: string;
  title: string;
  summary: string;
  phase: string;
  icon: "auth" | "members" | "notifications";
};
