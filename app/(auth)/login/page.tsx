import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();
  const callbackUrl =
    searchParams?.callbackUrl?.startsWith("/") &&
    !searchParams.callbackUrl.startsWith("//")
      ? searchParams.callbackUrl
      : "/";

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[480px] flex-col justify-center">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
            Household Refill OS
          </p>
          <h1 className="mt-3 text-[2rem] font-bold leading-tight tracking-normal">
            ログイン
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            家庭の買い物リストに入ります
          </p>
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}
