import { AppShell } from "@/components/app-shell/AppShell";
import { InventoryStatusView } from "@/components/inventory/InventoryStatusView";
import { getInventoryItems } from "@/lib/household-data";

export default async function InventoryPage() {
  const items = await getInventoryItems();

  return (
    <AppShell
      eyebrow="補充候補"
      title="残量"
      summary="少ないものと切れそうなもの"
    >
      <InventoryStatusView items={items} />
    </AppShell>
  );
}
