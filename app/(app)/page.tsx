import { AppShell } from "@/components/app-shell/AppShell";
import { ShoppingTodayView } from "@/components/shopping/ShoppingTodayView";

export default function HomePage() {
  return (
    <AppShell
      eyebrow="Household Refill OS"
      title="今日買う"
      summary="マルエツとAmazonの買い物をまとめています"
    >
      <ShoppingTodayView />
    </AppShell>
  );
}
