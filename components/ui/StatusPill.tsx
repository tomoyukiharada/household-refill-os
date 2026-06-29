import { cn } from "@/lib/utils";

type Tone = "neutral" | "green" | "amber" | "red" | "blue" | "slate";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-sky-50 text-sky-700",
  slate: "bg-slate-900 text-white"
};

type StatusPillProps = {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
};

export function StatusPill({
  tone = "neutral",
  children,
  className
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-bold tracking-normal",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
