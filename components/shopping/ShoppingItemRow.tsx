import { Check, Circle, RotateCcw } from "lucide-react";
import { toggleShoppingItem } from "@/app/(app)/actions";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/utils";
import type { ShoppingItem } from "@/lib/types";

const priorityLabels: Record<ShoppingItem["priority"], string> = {
  low: "低",
  normal: "通常",
  high: "高"
};

const priorityTones: Record<ShoppingItem["priority"], "neutral" | "amber" | "red"> =
  {
    low: "neutral",
    normal: "amber",
    high: "red"
  };

type ShoppingItemRowProps = {
  item: ShoppingItem;
  compact?: boolean;
};

export function ShoppingItemRow({
  item,
  compact = false
}: ShoppingItemRowProps) {
  const checked = item.status === "checked";

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-slate-100 px-4 last:border-b-0",
        compact ? "py-3" : "py-4",
        checked && "bg-slate-50"
      )}
    >
      <form action={toggleShoppingItem}>
        <input type="hidden" name="itemId" value={item.id} />
        <button
          type="submit"
          aria-label={
            checked ? `${item.title}を未購入に戻す` : `${item.title}を購入済みにする`
          }
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-lg border transition",
            checked
              ? "border-emerald-200 bg-emerald-50 text-leaf"
              : "border-slate-300 bg-white text-slate-500 hover:border-leaf hover:text-leaf"
          )}
        >
          {checked ? (
            compact ? (
              <RotateCcw aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Check aria-hidden="true" className="h-5 w-5" />
            )
          ) : (
            <Circle aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "min-w-0 text-base font-bold leading-6 text-ink",
              checked && "text-slate-400 line-through"
            )}
          >
            {item.title}
          </h3>
          {!checked ? (
            <StatusPill tone={priorityTones[item.priority]}>
              {priorityLabels[item.priority]}
            </StatusPill>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span>
            {item.quantity}
            {item.unit}
          </span>
          {compact ? <span>{item.store}</span> : null}
          {item.note ? <span className="break-words">{item.note}</span> : null}
        </div>
      </div>
    </div>
  );
}
