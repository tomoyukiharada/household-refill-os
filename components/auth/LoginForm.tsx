"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    setSubmitting(false);

    if (result?.error) {
      setError("メールアドレスまたはパスワードが違います");
      return;
    }

    const destination = result?.url
      ? new URL(result.url, window.location.origin)
      : null;
    const nextUrl =
      destination?.origin === window.location.origin
        ? `${destination.pathname}${destination.search}`
        : callbackUrl;

    router.push(nextUrl);
    router.refresh();
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">
          メールアドレス
        </span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-emerald-100"
          name="email"
          type="text"
          inputMode="email"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-slate-700">パスワード</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-emerald-100"
          name="password"
          type="password"
          required
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 text-base font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn aria-hidden="true" className="h-5 w-5" />
        {submitting ? "確認中" : "ログイン"}
      </button>
    </form>
  );
}
