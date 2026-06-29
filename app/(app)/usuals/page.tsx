import { AppShell } from "@/components/app-shell/AppShell";
import { UsualProductsView } from "@/components/inventory/UsualProductsView";

export default function UsualsPage() {
  return (
    <AppShell
      eyebrow="定番品"
      title="いつもの"
      summary="よく買う食品と日用品"
    >
      <UsualProductsView />
    </AppShell>
  );
}
