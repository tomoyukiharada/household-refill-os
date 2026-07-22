import { AppShell } from "@/components/app-shell/AppShell";
import { ShoppingTodayView } from "@/components/shopping/ShoppingTodayView";
import { getShoppingPageData } from "@/lib/household-data";

export default async function HomePage() {
  const { items, stores } = await getShoppingPageData();

  return (
    <AppShell
      eyebrow="Household Refill OS"
      title="今日買う"
      summary="マルエツとAmazonの買い物をまとめています"
    >
      <ShoppingTodayView items={items} stores={stores} />
    </AppShell>
  );
}
