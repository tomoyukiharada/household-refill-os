import { AppShell } from "@/components/app-shell/AppShell";
import { InventoryStatusView } from "@/components/inventory/InventoryStatusView";

export default function InventoryPage() {
  return (
    <AppShell
      eyebrow="補充候補"
      title="残量"
      summary="少ないものと切れそうなもの"
    >
      <InventoryStatusView />
    </AppShell>
  );
}
