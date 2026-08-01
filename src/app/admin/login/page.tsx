"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 font-(family-name:--font-display) text-2xl font-bold">
        Owner sign-in
      </h1>
      <p className="mb-6 text-sm text-(--color-ink-faint)">
        Only Hamza needs this page — it unlocks the edit icons across the site.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-(--color-ink-faint)">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-(--color-paper-line) bg-transparent py-1.5 outline-none focus:border-(--color-pen-blue)"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-(--color-ink-faint)">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-(--color-paper-line) bg-transparent py-1.5 outline-none focus:border-(--color-pen-blue)"
          />
        </div>

        {errorMsg && <p className="text-sm text-(--color-stamp-red)">{errorMsg}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 border border-(--color-ink) px-4 py-2 font-(family-name:--font-mono) text-xs uppercase hover:bg-(--color-ink) hover:text-(--color-paper) disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
