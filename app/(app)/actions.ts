"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAppSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const itemIdSchema = z.string().cuid();
const inventoryLevelSchema = z.enum(["enough", "low", "empty", "unknown"]);
const shoppingItemSchema = z.object({
  title: z.string().trim().min(1).max(80),
  quantity: z.coerce.number().positive().max(999),
  unit: z.string().trim().min(1).max(20),
  storeId: z.string().cuid().optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high"]),
  note: z.string().trim().max(200)
});
const productSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40),
  defaultQuantity: z.coerce.number().positive().max(999),
  defaultUnit: z.string().trim().min(1).max(20),
  defaultStoreId: z.string().cuid().optional().or(z.literal(""))
});

async function getActiveShoppingList(householdId: string) {
  const existingList = await prisma.shoppingList.findFirst({
    where: { householdId, status: "active" },
    orderBy: { createdAt: "desc" }
  });

  return (
    existingList ??
    prisma.shoppingList.create({
      data: { householdId, name: "今日買う" }
    })
  );
}

export async function addShoppingItem(formData: FormData) {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const parsed = shoppingItemSchema.safeParse({
    title: formData.get("title"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    storeId: formData.get("storeId"),
    priority: formData.get("priority"),
    note: formData.get("note")
  });

  if (!parsed.success) {
    throw new Error("入力内容を確認してください");
  }

  const { storeId, ...item } = parsed.data;
  const store = storeId
    ? await prisma.store.findFirst({ where: { id: storeId, householdId } })
    : null;
  const shoppingList = await getActiveShoppingList(householdId);
  const position = await prisma.shoppingListItem.count({
    where: { householdId, shoppingListId: shoppingList.id }
  });

  await prisma.shoppingListItem.create({
    data: {
      householdId,
      shoppingListId: shoppingList.id,
      storeId: store?.id,
      position,
      ...item
    }
  });

  revalidatePath("/");
}

export async function toggleShoppingItem(formData: FormData) {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const parsedId = itemIdSchema.safeParse(formData.get("itemId"));
  if (!parsedId.success) throw new Error("買い物項目が見つかりません");

  const item = await prisma.shoppingListItem.findFirst({
    where: { id: parsedId.data, householdId },
    select: { id: true, status: true }
  });
  if (!item) throw new Error("買い物項目が見つかりません");

  await prisma.shoppingListItem.updateMany({
    where: { id: item.id, householdId },
    data: { status: item.status === "checked" ? "active" : "checked" }
  });

  revalidatePath("/");
}

export async function addProductToShoppingList(formData: FormData) {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const parsedId = itemIdSchema.safeParse(formData.get("productId"));
  if (!parsedId.success) throw new Error("商品が見つかりません");

  const product = await prisma.product.findFirst({
    where: { id: parsedId.data, householdId }
  });
  if (!product) throw new Error("商品が見つかりません");

  const shoppingList = await getActiveShoppingList(householdId);
  const existingItem = await prisma.shoppingListItem.findFirst({
    where: {
      householdId,
      shoppingListId: shoppingList.id,
      productId: product.id,
      status: "active"
    }
  });
  if (existingItem) return;

  const position = await prisma.shoppingListItem.count({
    where: { householdId, shoppingListId: shoppingList.id }
  });
  await prisma.shoppingListItem.create({
    data: {
      householdId,
      shoppingListId: shoppingList.id,
      productId: product.id,
      storeId: product.defaultStoreId,
      title: product.name,
      quantity: product.defaultQuantity,
      unit: product.defaultUnit,
      position
    }
  });

  revalidatePath("/");
  revalidatePath("/usuals");
  revalidatePath("/inventory");
}

export async function createProduct(formData: FormData) {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    defaultQuantity: formData.get("defaultQuantity"),
    defaultUnit: formData.get("defaultUnit"),
    defaultStoreId: formData.get("defaultStoreId")
  });
  if (!parsed.success) throw new Error("商品情報を確認してください");

  const { defaultStoreId, ...productData } = parsed.data;
  const [existingProduct, store] = await Promise.all([
    prisma.product.findUnique({
      where: {
        householdId_name: { householdId, name: productData.name }
      }
    }),
    defaultStoreId
      ? prisma.store.findFirst({
          where: { id: defaultStoreId, householdId }
        })
      : null
  ]);
  if (existingProduct) throw new Error("同じ名前の商品が既にあります");

  await prisma.product.create({
    data: {
      householdId,
      defaultStoreId: store?.id,
      ...productData,
      inventoryItems: {
        create: { householdId, level: "unknown", remainingNote: "未確認" }
      }
    }
  });

  revalidatePath("/usuals");
  revalidatePath("/inventory");
}

export async function updateInventoryLevel(formData: FormData) {
  const session = await requireAppSession();
  const householdId = session.user.householdId;
  const parsedId = itemIdSchema.safeParse(formData.get("inventoryItemId"));
  const parsedLevel = inventoryLevelSchema.safeParse(formData.get("level"));
  if (!parsedId.success || !parsedLevel.success) {
    throw new Error("残量の更新内容を確認してください");
  }

  const result = await prisma.inventoryItem.updateMany({
    where: { id: parsedId.data, householdId },
    data: { level: parsedLevel.data }
  });
  if (result.count === 0) throw new Error("残量データが見つかりません");

  revalidatePath("/inventory");
  revalidatePath("/usuals");
}
