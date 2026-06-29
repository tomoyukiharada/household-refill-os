import { requireAppSession } from "@/lib/auth/session";

export default async function AuthenticatedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAppSession();

  return children;
}
