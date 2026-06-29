import { BottomNav } from "@/components/app-shell/BottomNav";

type AppShellProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: React.ReactNode;
};

export function AppShell({ eyebrow, title, summary, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white shadow-soft">
        <header className="border-b border-slate-200 px-5 pb-4 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
            {eyebrow}
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[2rem] font-bold leading-tight tracking-normal text-ink">
                {title}
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">{summary}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
