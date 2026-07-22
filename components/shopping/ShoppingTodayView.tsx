"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { addShoppingItem } from "@/app/(app)/actions";
import { StoreSection } from "@/components/shopping/StoreSection";
import { StatusPill } from "@/components/ui/StatusPill";
import type { ShoppingItem } from "@/lib/types";

function groupItemsByStore(items: ShoppingItem[]) {
  return items.reduce<Record<string, ShoppingItem[]>>((groups, item) => {
    const storeName = item.store || "未分類";
    groups[storeName] = [...(groups[storeName] || []), item];
    return groups;
  }, {});
}

type ShoppingTodayViewProps = {
  items: ShoppingItem[];
  stores: Array<{ id: string; name: string }>;
};

export function ShoppingTodayView({ items, stores }: ShoppingTodayViewProps) {
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
              />
            ))}
          </div>
        ) : null}
      </section>

      <details className="rounded-lg border border-emerald-200 bg-white shadow-soft">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 rounded-lg bg-leaf px-5 text-base font-bold text-white">
          <Plus aria-hidden="true" className="h-5 w-5" />
          買うものを追加
        </summary>
        <form action={addShoppingItem} className="space-y-3 p-4">
          <label className="block text-sm font-bold text-ink">
            商品名
            <input
              required
              name="title"
              maxLength={80}
              className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-ink">
              数量
              <input
                required
                name="quantity"
                type="number"
                min="0.1"
                max="999"
                step="0.1"
                defaultValue="1"
                className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
              />
            </label>
            <label className="block text-sm font-bold text-ink">
              単位
              <input
                required
                name="unit"
                maxLength={20}
                defaultValue="個"
                className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-ink">
              店舗
              <select
                name="storeId"
                className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
              >
                <option value="">未分類</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink">
              優先度
              <select
                name="priority"
                defaultValue="normal"
                className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
              >
                <option value="low">低</option>
                <option value="normal">通常</option>
                <option value="high">高</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-bold text-ink">
            メモ
            <input
              name="note"
              maxLength={200}
              className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 w-full rounded-lg bg-ink px-4 font-bold text-white"
          >
            リストに保存
          </button>
        </form>
      </details>
    </div>
  );
}
