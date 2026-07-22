import { requireAppSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import type { InventoryItem, ShoppingItem, UsualProduct } from "@/lib/types";

export async function getShoppingPageData() {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const [shoppingList, stores] = await Promise.all([
    prisma.shoppingList.findFirst({
      where: { householdId, status: "active" },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          where: { householdId },
          orderBy: [{ position: "asc" }, { createdAt: "asc" }],
          include: { store: true }
        }
      }
    }),
    prisma.store.findMany({
      where: { householdId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  const items: ShoppingItem[] = (shoppingList?.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    unit: item.unit,
    store: item.store?.name ?? "未分類",
    priority: item.priority,
    status: item.status,
    note: item.note
  }));

  return {
    items,
    stores: stores.map((store) => ({ id: store.id, name: store.name }))
  };
}
export async function getUsualsPageData(): Promise<{
  products: UsualProduct[];
  stores: Array<{ id: string; name: string }>;
}> {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const [products, stores] = await Promise.all([
    prisma.product.findMany({
      where: { householdId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: {
        defaultStore: true,
        inventoryItems: { where: { householdId }, take: 1 }
      }
    }),
    prisma.store.findMany({
      where: { householdId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      defaultStore: product.defaultStore?.name ?? "未分類",
      defaultQuantity: `${product.defaultQuantity}${product.defaultUnit}`,
      level: product.inventoryItems[0]?.level ?? "unknown",
      nextRefill: product.inventoryItems[0]?.estimatedRunout || "未確認"
    })),
    stores: stores.map((store) => ({ id: store.id, name: store.name }))
  };
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const items = await prisma.inventoryItem.findMany({
    where: { householdId },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      product: { include: { defaultStore: true } }
    }
  });

  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    category: item.product.category,
    store: item.product.defaultStore?.name ?? "未分類",
    remaining: item.remainingNote || "メモなし",
    level: item.level,
    estimatedRunout: item.estimatedRunout || "未確認"
  }));
}
