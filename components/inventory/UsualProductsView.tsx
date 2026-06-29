import { Plus } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockUsualProducts } from "@/lib/mock-data";
import type { ProductLevel } from "@/lib/types";

const levelTone: Record<ProductLevel, "green" | "amber" | "red" | "neutral"> = {
  enough: "green",
  low: "amber",
  empty: "red",
  unknown: "neutral"
};

const levelLabel: Record<ProductLevel, string> = {
  enough: "十分",
  low: "少ない",
  empty: "空",
  unknown: "未確認"
};

export function UsualProductsView() {
  return (
    <div className="space-y-3">
      {mockUsualProducts.map((product) => (
        <article
          key={product.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold leading-7 text-ink">
                  {product.name}
                </h2>
                <StatusPill tone={levelTone[product.level]}>
                  {levelLabel[product.level]}
                </StatusPill>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                <span>{product.category}</span>
                <span>{product.defaultStore}</span>
                <span>{product.defaultQuantity}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                次回目安: {product.nextRefill}
              </p>
            </div>

            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-leaf hover:text-leaf"
              aria-label={`${product.name}を今日買うリストに追加`}
            >
              <Plus aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
