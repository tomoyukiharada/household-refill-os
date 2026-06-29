import { AlertTriangle, Plus } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockInventoryItems } from "@/lib/mock-data";
import type { ProductLevel } from "@/lib/types";

const levelTone: Record<ProductLevel, "amber" | "red" | "neutral" | "green"> = {
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

export function InventoryStatusView() {
  const refillItems = mockInventoryItems.filter(
    (item) => item.level === "low" || item.level === "empty"
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 text-honey" />
          <h2 className="text-base font-bold text-ink">補充候補</h2>
        </div>
        <p className="mt-2 text-sm font-semibold text-amber-800">
          {refillItems.length}件
        </p>
      </section>

      <div className="space-y-3">
        {refillItems.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold leading-7 text-ink">
                    {item.name}
                  </h3>
                  <StatusPill tone={levelTone[item.level]}>
                    {levelLabel[item.level]}
                  </StatusPill>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span>{item.category}</span>
                  <span>{item.store}</span>
                  <span>{item.remaining}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  補充目安: {item.estimatedRunout}
                </p>
              </div>

              <button
                type="button"
                className="flex min-h-11 shrink-0 items-center gap-1 rounded-lg bg-ink px-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                追加
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
