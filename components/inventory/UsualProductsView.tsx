import { Plus } from "lucide-react";
import {
  addProductToShoppingList,
  createProduct
} from "@/app/(app)/actions";
import { StatusPill } from "@/components/ui/StatusPill";
import type { ProductLevel, UsualProduct } from "@/lib/types";

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

type UsualProductsViewProps = {
  products: UsualProduct[];
  stores: Array<{ id: string; name: string }>;
};

export function UsualProductsView({ products, stores }: UsualProductsViewProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
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

            <form action={addProductToShoppingList}>
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-leaf hover:text-leaf"
                aria-label={`${product.name}を今日買うリストに追加`}
              >
                <Plus aria-hidden="true" className="h-5 w-5" />
              </button>
            </form>
          </div>
        </article>
      ))}
      <details className="rounded-lg border border-emerald-200 bg-white">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 px-4 font-bold text-leaf">
          <Plus aria-hidden="true" className="h-5 w-5" />
          定番品を登録
        </summary>
        <form action={createProduct} className="space-y-3 border-t border-slate-200 p-4">
          <label className="block text-sm font-bold text-ink">
            商品名
            <input required name="name" maxLength={80} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" />
          </label>
          <label className="block text-sm font-bold text-ink">
            カテゴリ
            <input required name="category" maxLength={40} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-ink">
              標準数量
              <input required name="defaultQuantity" type="number" min="0.1" max="999" step="0.1" defaultValue="1" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" />
            </label>
            <label className="block text-sm font-bold text-ink">
              単位
              <input required name="defaultUnit" maxLength={20} defaultValue="個" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" />
            </label>
          </div>
          <label className="block text-sm font-bold text-ink">
            標準店舗
            <select name="defaultStoreId" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal">
              <option value="">未分類</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="min-h-11 w-full rounded-lg bg-ink px-4 font-bold text-white">
            定番品として保存
          </button>
        </form>
      </details>
    </div>
  );
}
