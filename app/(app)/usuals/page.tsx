import { AppShell } from "@/components/app-shell/AppShell";
import { UsualProductsView } from "@/components/inventory/UsualProductsView";
import { getUsualsPageData } from "@/lib/household-data";

export default async function UsualsPage() {
  const { products, stores } = await getUsualsPageData();

  return (
    <AppShell
      eyebrow="定番品"
      title="いつもの"
      summary="よく買う食品と日用品"
    >
      <UsualProductsView products={products} stores={stores} />
    </AppShell>
  );
}
