import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient();

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

  if (existingUser) {
    const ownerMembership = existingUser.memberships.find(
      (membership) => membership.role === "owner"
    );

    if (!ownerMembership) {
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
    }

    console.log(`Seed skipped: owner already exists (${email})`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
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
    }
  });

  console.log(`Seeded owner user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
