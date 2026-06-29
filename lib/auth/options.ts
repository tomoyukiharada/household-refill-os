import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { credentialsSchema } from "@/lib/auth/schema";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "メールアドレス",
          type: "text"
        },
        password: {
          label: "パスワード",
          type: "password"
        }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email
          },
          include: {
            memberships: {
              include: {
                household: true
              },
              orderBy: {
                createdAt: "asc"
              }
            }
          }
        });

        if (!user || user.memberships.length === 0) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        const membership =
          user.memberships.find((member) => member.role === "owner") ??
          user.memberships[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          householdId: membership.householdId,
          householdName: membership.household.name,
          role: membership.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.householdId = user.householdId;
        token.householdName = user.householdName;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ?? "";
        session.user.householdId = token.householdId ?? "";
        session.user.householdName = token.householdName ?? "";
        session.user.role = token.role ?? "member";
      }

      return session;
    }
  }
};
