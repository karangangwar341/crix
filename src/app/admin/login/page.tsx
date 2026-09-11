"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      userType: "admin",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid administrative credentials. Please verify your email and password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 sm:p-10 shadow-[var(--shadow-hover)]">
      <div className="text-center">
        <Link href="/" className="inline-block font-display text-2xl tracking-widest text-black">
          CRIX
        </Link>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          <ShieldCheck size={14} className="text-black" />
          <span>Management Portal</span>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Enter authorized administrative credentials to access the CMS & CRM.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Administrator Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-ink-faint" />
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@crixcricket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-neutral-50/50 pl-10 pr-4 py-2.5 text-sm text-ink outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-ink-faint" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-neutral-50/50 pl-10 pr-4 py-2.5 text-sm text-ink outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-60"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="mt-8 text-center border-t border-line pt-6">
        <Link href="/" className="text-xs text-ink-soft hover:text-black transition-colors">
          ← Return to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f4] px-4 py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
