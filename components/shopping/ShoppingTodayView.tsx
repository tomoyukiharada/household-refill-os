"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { StoreSection } from "@/components/shopping/StoreSection";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockShoppingItems } from "@/lib/mock-data";
import type { ShoppingItem } from "@/lib/types";

function groupItemsByStore(items: ShoppingItem[]) {
  return items.reduce<Record<string, ShoppingItem[]>>((groups, item) => {
    const storeName = item.store || "未分類";
    groups[storeName] = [...(groups[storeName] || []), item];
    return groups;
  }, {});
}

export function ShoppingTodayView() {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems);
  const [showCompleted, setShowCompleted] = useState(true);

  const activeItems = items.filter((item) => item.status === "active");
  const checkedItems = items.filter((item) => item.status === "checked");
  const highPriorityCount = activeItems.filter(
    (item) => item.priority === "high"
  ).length;

  const groupedItems = useMemo(
    () => groupItemsByStore(activeItems),
    [activeItems]
  );

  const toggleItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "checked" ? "active" : "checked"
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-3 gap-2" aria-label="買い物状況">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">未購入</p>
          <p className="mt-1 text-2xl font-bold text-ink">{activeItems.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">高優先</p>
          <p className="mt-1 text-2xl font-bold text-tomato">
            {highPriorityCount}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">店舗</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {Object.keys(groupedItems).length}
          </p>
        </div>
      </section>

      <div className="space-y-3">
        {Object.entries(groupedItems).map(([store, storeItems]) => (
          <StoreSection
            key={store}
            store={store}
            items={storeItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowCompleted((current) => !current)}
          className="flex min-h-12 w-full items-center justify-between px-4 text-left"
          aria-expanded={showCompleted}
        >
          <span className="flex items-center gap-2 font-bold text-ink">
            完了済み
            <StatusPill tone="green">{checkedItems.length}</StatusPill>
          </span>
          {showCompleted ? (
            <ChevronUp aria-hidden="true" className="h-5 w-5 text-slate-500" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-5 w-5 text-slate-500" />
          )}
        </button>

        {showCompleted ? (
          <div className="border-t border-slate-200">
            {checkedItems.map((item) => (
              <StoreSection
                key={item.id}
                store={item.store}
                items={[item]}
                compact
                onToggleItem={toggleItem}
              />
            ))}
          </div>
        ) : null}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-[480px] px-4">
        <button
          type="button"
          className="pointer-events-auto flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white shadow-soft transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
          追加
        </button>
      </div>
    </div>
  );
}
