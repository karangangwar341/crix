"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const registered = searchParams.get("registered");

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
      userType: "customer",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please check your credentials and try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 sm:p-10 shadow-[var(--shadow-hover)]">
      <div className="text-center">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-faint">
          Member Access
        </span>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-ink">
          Sign In
        </h1>
        <p className="mt-2 text-xs text-ink-soft">
          Sign in to manage your equipment orders, delivery updates, and profile.
        </p>
      </div>

      {registered && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800">
          Account created successfully. Please sign in with your credentials.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
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
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 pl-10 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-xs font-semibold uppercase tracking-widest text-bg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              Signing In...
            </span>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-line-soft pt-6 text-center text-xs text-ink-soft">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
          Create an account
        </Link>
      </div>

      <div className="mt-4 text-center">
        <Link href="/admin/login" className="text-[11px] text-ink-faint hover:text-ink">
          Staff & Administrator Portal →
        </Link>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-bg px-4 py-16">
      <Suspense fallback={<div className="text-xs text-ink-faint">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
