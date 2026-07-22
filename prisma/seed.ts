import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient();

async function seedHouseholdData(householdId: string) {
  const storeDefinitions = [
    { name: "マルエツ", sortOrder: 1 },
    { name: "ドラッグストア", sortOrder: 2 },
    { name: "Amazon", sortOrder: 3 },
    { name: "楽天", sortOrder: 4 }
  ];

  const stores = new Map<string, string>();
  for (const storeDefinition of storeDefinitions) {
    const store = await prisma.store.upsert({
      where: {
        householdId_name: {
          householdId,
          name: storeDefinition.name
        }
      },
      update: { sortOrder: storeDefinition.sortOrder },
      create: { householdId, ...storeDefinition }
    });
    stores.set(store.name, store.id);
  }

  const productDefinitions = [
    {
      name: "牛乳",
      category: "食品",
      defaultQuantity: 1,
      defaultUnit: "本",
      store: "マルエツ",
      level: "low" as const,
      remainingNote: "残り少し",
      estimatedRunout: "明日"
    },
    {
      name: "トイレットペーパー",
      category: "日用品",
      defaultQuantity: 1,
      defaultUnit: "パック",
      store: "Amazon",
      level: "empty" as const,
      remainingNote: "残り2ロール",
      estimatedRunout: "今日"
    },
    {
      name: "洗濯洗剤",
      category: "洗濯",
      defaultQuantity: 1,
      defaultUnit: "袋",
      store: "楽天",
      level: "enough" as const,
      remainingNote: "十分",
      estimatedRunout: "12日後"
    },
    {
      name: "卵",
      category: "食品",
      defaultQuantity: 1,
      defaultUnit: "パック",
      store: "マルエツ",
      level: "unknown" as const,
      remainingNote: "未確認",
      estimatedRunout: "未確認"
    },
    {
      name: "食器用洗剤",
      category: "キッチン",
      defaultQuantity: 1,
      defaultUnit: "本",
      store: "ドラッグストア",
      level: "low" as const,
      remainingNote: "残り1/4",
      estimatedRunout: "3日後"
    }
  ];

  const products = new Map<string, { id: string; storeId: string | null }>();
  for (const definition of productDefinitions) {
    const storeId = stores.get(definition.store) ?? null;
    const product = await prisma.product.upsert({
      where: {
        householdId_name: { householdId, name: definition.name }
      },
      update: {},
      create: {
        householdId,
        name: definition.name,
        category: definition.category,
        defaultQuantity: definition.defaultQuantity,
        defaultUnit: definition.defaultUnit,
        defaultStoreId: storeId
      }
    });
    products.set(product.name, { id: product.id, storeId });

    await prisma.inventoryItem.upsert({
      where: {
        householdId_productId: { householdId, productId: product.id }
      },
      update: {},
      create: {
        householdId,
        productId: product.id,
        level: definition.level,
        remainingNote: definition.remainingNote,
        estimatedRunout: definition.estimatedRunout
      }
    });
  }

  let shoppingList = await prisma.shoppingList.findFirst({
    where: { householdId, status: "active" },
    orderBy: { createdAt: "desc" }
  });

  if (!shoppingList) {
    shoppingList = await prisma.shoppingList.create({
      data: { householdId, name: "今日買う" }
    });
  }

  const itemCount = await prisma.shoppingListItem.count({
    where: { householdId, shoppingListId: shoppingList.id }
  });

  if (itemCount === 0) {
    const initialItems = [
      { product: "牛乳", priority: "normal" as const, note: "低脂肪ではないもの" },
      { product: "トイレットペーパー", priority: "high" as const, note: "残り2ロール" },
      { product: "卵", priority: "normal" as const, note: "", status: "checked" as const },
      { product: "食器用洗剤", priority: "low" as const, note: "詰め替え用" }
    ];

    for (const [position, item] of initialItems.entries()) {
      const product = productDefinitions.find(
        (definition) => definition.name === item.product
      );
      const productRecord = products.get(item.product);
      if (!product || !productRecord) continue;

      await prisma.shoppingListItem.create({
        data: {
          householdId,
          shoppingListId: shoppingList.id,
          productId: productRecord.id,
          storeId: productRecord.storeId,
          title: product.name,
          quantity: product.defaultQuantity,
          unit: product.defaultUnit,
          priority: item.priority,
          status: item.status ?? "active",
          note: item.note,
          position
        }
      });
    }
  }
}

async function main() {
  const email = (process.env.INITIAL_OWNER_EMAIL ?? "owner@example.local")
    .trim()
    .toLowerCase();
  const password = process.env.INITIAL_OWNER_PASSWORD ?? "change-me";
  const householdName = process.env.INITIAL_HOUSEHOLD_NAME ?? "Home";

  if (!email || !password) {
    throw new Error("INITIAL_OWNER_EMAIL and INITIAL_OWNER_PASSWORD are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    },
    include: {
      memberships: true
    }
  });

  let householdId: string;

  if (existingUser) {
    const ownerMembership = existingUser.memberships.find(
      (membership) => membership.role === "owner"
    );

    if (ownerMembership) {
      householdId = ownerMembership.householdId;
    } else {
      const household = await prisma.household.create({
        data: {
          name: householdName
        }
      });

      await prisma.householdMember.create({
        data: {
          userId: existingUser.id,
          householdId: household.id,
          role: "owner"
        }
      });
      householdId = household.id;
    }
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: "Owner",
        passwordHash,
        memberships: {
          create: {
            role: "owner",
            household: {
              create: {
                name: householdName
              }
            }
          }
        }
      },
      include: { memberships: true }
    });
    householdId = user.memberships[0].householdId;
  }

  await seedHouseholdData(householdId);
  console.log(`Seeded household data for: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
