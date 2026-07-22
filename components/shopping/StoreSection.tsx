import { ShoppingBasket } from "lucide-react";
import { ShoppingItemRow } from "@/components/shopping/ShoppingItemRow";
import type { ShoppingItem } from "@/lib/types";

type StoreSectionProps = {
  store: string;
  items: ShoppingItem[];
  compact?: boolean;
};

export function StoreSection({
  store,
  items,
  compact = false
}: StoreSectionProps) {
  if (compact) {
    return (
      <div>
        {items.map((item) => (
          <ShoppingItemRow
            key={item.id}
            item={item}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex min-h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
        <div className="flex items-center gap-2">
          <ShoppingBasket aria-hidden="true" className="h-4 w-4 text-leaf" />
          <h2 className="font-bold text-ink">{store}</h2>
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {items.length}件
        </span>
      </div>

      <div>
        {items.map((item) => (
          <ShoppingItemRow
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
